import type { AppServices } from '../../../../core/types/api.types.js';
import type { PropertyContract } from '../../domain/entities/property-contract.entity.js';
import type { IPropertyContractRepository } from '../../domain/repositories/property-contract.repository.js';

export interface ContractAiReview {
  riskLevel: 'low' | 'medium' | 'high';
  summary: string;
  missingFields: string[];
  detectedClauses: string[];
  warnings: string[];
  recommendations: string[];
  disclaimer: string;
}

export class PropertyContractService {
  constructor(
    private readonly repository: IPropertyContractRepository,
    private readonly services: AppServices,
  ) {}

  async findByProperty(propertyId: string): Promise<PropertyContract[]> {
    return this.repository.findByPropertyId(propertyId);
  }

  async findById(id: string): Promise<PropertyContract | null> {
    return this.repository.findById(id);
  }

  async create(data: Omit<PropertyContract, 'id' | 'createdAt' | 'updatedAt'>): Promise<PropertyContract> {
    return this.repository.create(data);
  }

  async reviewTextWithAi(draftText: string): Promise<ContractAiReview> {
    const { text } = await this.services.ai.generate({
      prompt: `Analiza el siguiente contrato inmobiliario y proporciona: nivel de riesgo (low/medium/high), resumen, campos faltantes, cláusulas detectadas, advertencias y recomendaciones. Responde en JSON.\n\n${draftText}`,
    });

    let review: Partial<ContractAiReview>;
    try {
      review = JSON.parse(text) as Partial<ContractAiReview>;
    } catch {
      review = {
        riskLevel: 'medium',
        summary: text.slice(0, 500),
        missingFields: [],
        detectedClauses: [],
        warnings: ['No se pudo estructurar la respuesta de IA'],
        recommendations: ['Consulte con un profesional legal'],
      };
    }

    return {
      riskLevel: review.riskLevel ?? 'medium',
      summary: review.summary ?? 'Revisión preliminar completada',
      missingFields: review.missingFields ?? [],
      detectedClauses: review.detectedClauses ?? [],
      warnings: review.warnings ?? [],
      recommendations: review.recommendations ?? [],
      disclaimer: 'La revisión con IA es preliminar y no reemplaza la revisión de un abogado, notario o profesional legal.',
    };
  }

  async reviewWithAi(id: string): Promise<ContractAiReview> {
    const contract = await this.repository.findById(id);
    if (!contract) throw new Error(`Contract ${id} not found`);

    const textToAnalyze = contract.draftText ?? `Contrato de ${contract.contractType} por ${contract.totalAmount} ${contract.currency}`;

    const { text } = await this.services.ai.generate({
      prompt: `Analiza el siguiente contrato inmobiliario y proporciona: nivel de riesgo (low/medium/high), resumen, campos faltantes, cláusulas detectadas, advertencias y recomendaciones. Responde en JSON.\n\n${textToAnalyze}`,
    });

    let review: Partial<ContractAiReview>;
    try {
      review = JSON.parse(text) as Partial<ContractAiReview>;
    } catch {
      review = {
        riskLevel: 'medium',
        summary: text.slice(0, 500),
        missingFields: [],
        detectedClauses: [],
        warnings: ['No se pudo estructurar la respuesta de IA'],
        recommendations: ['Consulte con un profesional legal'],
      };
    }

    return {
      riskLevel: review.riskLevel ?? 'medium',
      summary: review.summary ?? 'Revisión preliminar completada',
      missingFields: review.missingFields ?? [],
      detectedClauses: review.detectedClauses ?? [],
      warnings: review.warnings ?? [],
      recommendations: review.recommendations ?? [],
      disclaimer:
        'La revisión con IA es preliminar y no reemplaza la revisión de un abogado, notario o profesional legal.',
    };
  }
}
