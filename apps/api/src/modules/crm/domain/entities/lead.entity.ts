import { randomUUID } from 'node:crypto';
import { Contact, type ContactValue } from '../value-objects/contact.vo.js';
import { LeadScore } from '../value-objects/lead-score.vo.js';

export type LeadStatus = 'new' | 'qualified' | 'converted' | 'lost';

export interface LeadSnapshot {
  contact: ContactValue;
  createdAt: string;
  id: string;
  score: number;
  source: string;
  status: LeadStatus;
  tenantId?: string;
}

interface CreateLeadInput {
  contact: ContactValue;
  source: string;
  tenantId?: string;
}

export class Lead {
  private constructor(
    readonly id: string,
    readonly contact: Contact,
    readonly source: string,
    readonly createdAt: string,
    readonly tenantId?: string,
    private status: LeadStatus = 'new',
    private score: LeadScore = LeadScore.create(0),
  ) {}

  static create(input: CreateLeadInput): Lead {
    return new Lead(randomUUID(), Contact.create(input.contact), input.source.trim() || 'unknown', new Date().toISOString(), input.tenantId);
  }

  setScore(score: LeadScore): void {
    this.score = score;
    this.status = score.value >= 70 ? 'qualified' : 'new';
  }

  toJSON(): LeadSnapshot {
    return {
      contact: this.contact.toJSON(),
      createdAt: this.createdAt,
      id: this.id,
      score: this.score.value,
      source: this.source,
      status: this.status,
      tenantId: this.tenantId,
    };
  }
}
