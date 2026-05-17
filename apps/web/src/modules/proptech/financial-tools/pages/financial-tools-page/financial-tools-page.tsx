import React, { useState } from 'react';
import './financial-tools-page.css';
import { MortgageCalculator } from '../../components/mortgage-calculator/MortgageCalculator';
import { AffordabilityCalculator } from '../../components/affordability-calculator/AffordabilityCalculator';
import { RentVsBuyCalculator } from '../../components/rent-vs-buy-calculator/RentVsBuyCalculator';
import { FinancialDisclaimer } from '../../components/financial-disclaimer/FinancialDisclaimer';

type CalculatorTab = 'mortgage' | 'affordability' | 'rent-vs-buy';

export const FinancialToolsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CalculatorTab>('mortgage');

  return (
    <div className="fin-tools-page">
      <div className="fin-tools-page__header">
        <div>
          <h1 className="fin-tools-page__title">Centro Financiero PropTech</h1>
          <p className="fin-tools-page__description">
            Calcula, compara y decide con mayor seguridad. Nuestras herramientas te ayudan a entender tu capacidad de compra, simular tu hipoteca y comparar alternativas financieras.
          </p>
        </div>
      </div>

      <div className="fin-tools-page__tabs">
        <button
          className={`fin-tools-page__tab ${activeTab === 'mortgage' ? 'fin-tools-page__tab--active' : ''}`}
          onClick={() => setActiveTab('mortgage')}
        >
          Hipoteca
        </button>
        <button
          className={`fin-tools-page__tab ${activeTab === 'affordability' ? 'fin-tools-page__tab--active' : ''}`}
          onClick={() => setActiveTab('affordability')}
        >
          Accesibilidad
        </button>
        <button
          className={`fin-tools-page__tab ${activeTab === 'rent-vs-buy' ? 'fin-tools-page__tab--active' : ''}`}
          onClick={() => setActiveTab('rent-vs-buy')}
        >
          Alquiler vs Compra
        </button>
      </div>

      <div className="fin-tools-page__content">
        {activeTab === 'mortgage' && <MortgageCalculator />}
        {activeTab === 'affordability' && <AffordabilityCalculator />}
        {activeTab === 'rent-vs-buy' && <RentVsBuyCalculator />}
      </div>

      <FinancialDisclaimer />
    </div>
  );
};
