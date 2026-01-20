// Brazilian Tax Calculation Logic
// 🎯 Constantes configuráveis - Fácil atualização de alíquotas

// ============================================================================
// TAX RATES 2024 (Sistema Atual)
// ============================================================================

// Simples Nacional Annexes (2024 values - simplified)
export const SIMPLES_ANEXO_III = [
  { maxRevenue: 180000, aliquot: 6.0, deduction: 0 },
  { maxRevenue: 360000, aliquot: 11.2, deduction: 9360 },
  { maxRevenue: 720000, aliquot: 13.5, deduction: 17640 },
  { maxRevenue: 1800000, aliquot: 16.0, deduction: 35640 },
  { maxRevenue: 3600000, aliquot: 21.0, deduction: 125640 },
  { maxRevenue: 4800000, aliquot: 33.0, deduction: 648000 },
];

export const SIMPLES_ANEXO_V = [
  { maxRevenue: 180000, aliquot: 15.5, deduction: 0 },
  { maxRevenue: 360000, aliquot: 18.0, deduction: 4500 },
  { maxRevenue: 720000, aliquot: 19.5, deduction: 9900 },
  { maxRevenue: 1800000, aliquot: 20.5, deduction: 17100 },
  { maxRevenue: 3600000, aliquot: 23.0, deduction: 62100 },
  { maxRevenue: 4800000, aliquot: 30.5, deduction: 540000 },
];

// Fator R threshold para otimização Simples Nacional
export const FATOR_R_THRESHOLD = 28; // %

// Lucro Presumido rates
export const LUCRO_PRESUMIDO = {
  // Presunção rates by activity type
  presumption: {
    commerce: 8, // Comércio
    services: 32, // Serviços em geral
    transport_cargo: 8, // Transporte de cargas
    transport_passengers: 16, // Transporte de passageiros
    industry: 8, // Indústria
  },
  // Tax rates
  irpj: 15, // IRPJ base
  irpj_adicional: 10, // Adicional sobre lucro > 60k/trimestre
  csll_services: 32, // Base CSLL serviços
  csll_other: 12, // Base CSLL outras atividades
  csll_rate: 9, // Alíquota CSLL
  pis: 0.65,
  cofins: 3.0,
};

// Lucro Real rates
export const LUCRO_REAL = {
  irpj: 15,
  irpj_adicional: 10, // Sobre lucro > 20k/mês
  csll: 9,
  pis: 1.65, // Não-cumulativo
  cofins: 7.6, // Não-cumulativo
};

// ============================================================================
// TAX RATES 2026 - REFORMA TRIBUTÁRIA (Transição)
// ============================================================================

export const TAX_RATES_2026 = {
  ibs: 12.5, // IBS - Imposto sobre Bens e Serviços (Estadual/Municipal)
  cbs: 12.5, // CBS - Contribuição sobre Bens e Serviços (Federal)
  // Total sistema dual: 25% (substitui PIS/COFINS/ISS gradualmente)

  // Para comparação com sistema atual
  current: {
    pis: 1.65,
    cofins: 7.6,
    iss_min: 2.0,  // ISS médio mínimo
    iss_max: 5.0,  // ISS médio máximo
  }
};

export interface TaxInput {
  annualRevenue: number;
  monthlyPayroll: number;
  monthlyExpenses: number;
  activityType: 'commerce' | 'services' | 'industry' | 'transport';
}

export interface FatorRAnalysis {
  value: number;
  isOptimized: boolean;
  currentAnexo: 3 | 5;
  recommendedAnexo: 3 | 5;
  potentialSavings: number;
  alert?: string;
}

export interface Reforma2026Impact {
  currentSystem: number; // PIS + COFINS + ISS
  futureSystem: number;  // IBS + CBS
  difference: number;
  percentageChange: number;
}

export interface TaxResult {
  regime: string;
  annualTax: number;
  effectiveRate: number;
  isEligible?: boolean;
  ineligibilityReason?: string;
  optimizationAlerts?: string[];
  fatorRAnalysis?: FatorRAnalysis;
  reforma2026Impact?: Reforma2026Impact;
  details: {
    [key: string]: number;
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// Calculate Fator R (payroll factor for Simples Nacional)
export function calculateFatorR(monthlyPayroll: number, monthlyRevenue: number): number {
  if (monthlyRevenue === 0) return 0;
  return (monthlyPayroll / monthlyRevenue) * 100;
}

/**
 * Analisa o Fator R e identifica oportunidades de otimização
 * ALERTA ESPECIAL: Anexo V com folha > 28% = Economia Imediata!
 */
export function analyzeFatorR(
  fatorR: number,
  currentAnexo: 3 | 5,
  annualRevenue: number
): FatorRAnalysis {
  const isOptimized = fatorR >= FATOR_R_THRESHOLD;
  const recommendedAnexo: 3 | 5 = isOptimized ? 3 : 5;

  // Calcular economia potencial se mudar de anexo
  let potentialSavings = 0;
  let alert: string | undefined;

  if (currentAnexo === 5 && isOptimized) {
    // OPORTUNIDADE! Está no Anexo V mas deveria estar no III
    const taxAnexoV = calculateTaxForAnexo(annualRevenue, SIMPLES_ANEXO_V);
    const taxAnexoIII = calculateTaxForAnexo(annualRevenue, SIMPLES_ANEXO_III);
    potentialSavings = taxAnexoV - taxAnexoIII;

    if (potentialSavings > 0) {
      alert = `⚠️ ECONOMIA IMEDIATA DISPONÍVEL: Migrar do Anexo V para o Anexo III pode economizar R$ ${formatCurrency(potentialSavings)}/ano!`;
    }
  } else if (currentAnexo === 3 && !isOptimized) {
    // Está no Anexo III mas deveria estar no V
    const taxAnexoIII = calculateTaxForAnexo(annualRevenue, SIMPLES_ANEXO_III);
    const taxAnexoV = calculateTaxForAnexo(annualRevenue, SIMPLES_ANEXO_V);
    potentialSavings = taxAnexoIII - taxAnexoV;

    if (potentialSavings > 0) {
      alert = `Atenção: Fator R abaixo de 28%. Você pode estar pagando mais impostos no Anexo III.`;
    }
  }

  return {
    value: fatorR,
    isOptimized,
    currentAnexo,
    recommendedAnexo,
    potentialSavings,
    alert,
  };
}

/**
 * Calcula o impacto da Reforma Tributária 2026 (IBS + CBS)
 * Compara sistema atual (PIS/COFINS/ISS) com sistema futuro
 */
export function calculateReforma2026Impact(annualRevenue: number, activityType: string): Reforma2026Impact {
  // Sistema atual: PIS + COFINS + ISS (estimado)
  const pis = annualRevenue * (TAX_RATES_2026.current.pis / 100);
  const cofins = annualRevenue * (TAX_RATES_2026.current.cofins / 100);

  // ISS varia por atividade (apenas serviços)
  let iss = 0;
  if (activityType === 'services') {
    // Usar média de 3.5% para serviços
    const issRate = (TAX_RATES_2026.current.iss_min + TAX_RATES_2026.current.iss_max) / 2;
    iss = annualRevenue * (issRate / 100);
  }

  const currentSystem = pis + cofins + iss;

  // Sistema 2026: IBS + CBS (25% total)
  const ibs = annualRevenue * (TAX_RATES_2026.ibs / 100);
  const cbs = annualRevenue * (TAX_RATES_2026.cbs / 100);
  const futureSystem = ibs + cbs;

  const difference = futureSystem - currentSystem;
  const percentageChange = currentSystem > 0 ? (difference / currentSystem) * 100 : 0;

  return {
    currentSystem,
    futureSystem,
    difference,
    percentageChange,
  };
}

// Helper function to calculate tax for a specific anexo
function calculateTaxForAnexo(annualRevenue: number, anexo: typeof SIMPLES_ANEXO_III): number {
  const bracket = anexo.find(b => annualRevenue <= b.maxRevenue) || anexo[anexo.length - 1];
  const effectiveAliquot = ((annualRevenue * bracket.aliquot / 100) - bracket.deduction) / annualRevenue * 100;
  return annualRevenue * (effectiveAliquot / 100);
}

// ============================================================================
// TAX CALCULATION FUNCTIONS
// ============================================================================

// Calculate Simples Nacional
export function calculateSimplesNacional(input: TaxInput): TaxResult {
  const { annualRevenue, monthlyPayroll, activityType } = input;
  const monthlyRevenue = annualRevenue / 12;
  const fatorR = calculateFatorR(monthlyPayroll, monthlyRevenue);

  // Check eligibility
  const isEligible = annualRevenue <= 4800000;
  if (!isEligible) {
    return {
      regime: 'Simples Nacional',
      annualTax: 0,
      effectiveRate: 0,
      isEligible: false,
      ineligibilityReason: 'Faturamento acima de R$ 4,8 milhões/ano',
      details: {},
    };
  }

  // Use Anexo III if Fator R >= 28%, otherwise Anexo V (for services)
  const useAnexoIII = fatorR >= FATOR_R_THRESHOLD || activityType !== 'services';
  const anexo = useAnexoIII ? SIMPLES_ANEXO_III : SIMPLES_ANEXO_V;
  const anexoUsado: 3 | 5 = useAnexoIII ? 3 : 5;

  // Find the appropriate tax bracket
  const bracket = anexo.find(b => annualRevenue <= b.maxRevenue) || anexo[anexo.length - 1];

  // Calculate effective aliquot
  const effectiveAliquot = ((annualRevenue * bracket.aliquot / 100) - bracket.deduction) / annualRevenue * 100;
  const annualTax = annualRevenue * (effectiveAliquot / 100);

  // Analyze Fator R for optimization opportunities
  const fatorRAnalysis = analyzeFatorR(fatorR, anexoUsado, annualRevenue);

  // Generate optimization alerts
  const optimizationAlerts: string[] = [];
  if (fatorRAnalysis.alert) {
    optimizationAlerts.push(fatorRAnalysis.alert);
  }

  return {
    regime: 'Simples Nacional',
    annualTax: Math.max(0, annualTax),
    effectiveRate: Math.max(0, effectiveAliquot),
    isEligible: true,
    fatorRAnalysis,
    optimizationAlerts,
    details: {
      fatorR,
      anexoUsado,
      aliquotaNominal: bracket.aliquot,
      deducao: bracket.deduction,
    },
  };
}

// Calculate Lucro Presumido
export function calculateLucroPresumido(input: TaxInput): TaxResult {
  const { annualRevenue, activityType } = input;

  // Get presumption rate based on activity
  let presumptionRate = LUCRO_PRESUMIDO.presumption.services;
  if (activityType === 'commerce' || activityType === 'industry') {
    presumptionRate = LUCRO_PRESUMIDO.presumption.commerce;
  } else if (activityType === 'transport') {
    presumptionRate = LUCRO_PRESUMIDO.presumption.transport_cargo;
  }

  // Calculate presumed profit
  const presumedProfit = annualRevenue * (presumptionRate / 100);

  // IRPJ (15% + 10% adicional sobre lucro > 240k/ano)
  const irpjBase = presumedProfit * (LUCRO_PRESUMIDO.irpj / 100);
  const irpjAdicional = Math.max(0, (presumedProfit - 240000) * (LUCRO_PRESUMIDO.irpj_adicional / 100));
  const irpj = irpjBase + irpjAdicional;

  // CSLL
  const csllBase = activityType === 'services'
    ? annualRevenue * (LUCRO_PRESUMIDO.csll_services / 100)
    : annualRevenue * (LUCRO_PRESUMIDO.csll_other / 100);
  const csll = csllBase * (LUCRO_PRESUMIDO.csll_rate / 100);

  // PIS and COFINS (cumulativo)
  const pis = annualRevenue * (LUCRO_PRESUMIDO.pis / 100);
  const cofins = annualRevenue * (LUCRO_PRESUMIDO.cofins / 100);

  // ISS (Services only)
  const iss = activityType === 'services' ? annualRevenue * 0.05 : 0;

  const annualTax = irpj + csll + pis + cofins + iss;

  return {
    regime: 'Lucro Presumido',
    annualTax,
    effectiveRate: (annualTax / annualRevenue) * 100,
    details: {
      irpj,
      csll,
      pis,
      cofins,
      iss,
      presumptionRate,
    },
  };
}

// Calculate Lucro Real
export function calculateLucroReal(input: TaxInput): TaxResult {
  const { annualRevenue, monthlyPayroll, monthlyExpenses, activityType } = input;

  // Estimate annual expenses (payroll + other expenses)
  const annualPayroll = monthlyPayroll * 12;
  const annualExpenses = monthlyExpenses * 12;

  // Estimate cost of goods/services (rough estimate based on activity)
  let costRatio = 0.5; // 50% default
  if (activityType === 'commerce') costRatio = 0.7;
  if (activityType === 'industry') costRatio = 0.6;
  if (activityType === 'services') costRatio = 0.3;

  const estimatedCosts = annualRevenue * costRatio;
  const totalDeductions = annualPayroll + annualExpenses + estimatedCosts;

  // Calculate actual profit
  const actualProfit = Math.max(0, annualRevenue - totalDeductions);

  // IRPJ (15% + 10% adicional sobre lucro > 240k/ano)
  const irpjBase = actualProfit * (LUCRO_REAL.irpj / 100);
  const irpjAdicional = Math.max(0, (actualProfit - 240000) * (LUCRO_REAL.irpj_adicional / 100));
  const irpj = irpjBase + irpjAdicional;

  // CSLL (9%)
  const csll = actualProfit * (LUCRO_REAL.csll / 100);

  // PIS and COFINS (não-cumulativo - with credits)
  // Simplified: assume 50% of costs generate credits
  const pisGross = annualRevenue * (LUCRO_REAL.pis / 100);
  const pisCredits = (estimatedCosts * 0.5) * (LUCRO_REAL.pis / 100);
  const pis = Math.max(0, pisGross - pisCredits);

  const cofinsGross = annualRevenue * (LUCRO_REAL.cofins / 100);
  const cofinsCredits = (estimatedCosts * 0.5) * (LUCRO_REAL.cofins / 100);
  const cofins = Math.max(0, cofinsGross - cofinsCredits);

  const annualTax = irpj + csll + pis + cofins;

  return {
    regime: 'Lucro Real',
    annualTax,
    effectiveRate: (annualTax / annualRevenue) * 100,
    details: {
      irpj,
      csll,
      pis,
      cofins,
      lucroLiquido: actualProfit,
      deducoes: totalDeductions,
    },
  };
}

// Calculate all regimes and find the best option
export function calculateAllRegimes(input: TaxInput): {
  simples: TaxResult;
  presumido: TaxResult;
  real: TaxResult;
  bestOption: string;
  savings: number;
} {
  const simples = calculateSimplesNacional(input);
  const presumido = calculateLucroPresumido(input);
  const real = calculateLucroReal(input);

  // Check if eligible for Simples Nacional (max 4.8M annual revenue)
  const eligibleSimples = input.annualRevenue <= 4800000;

  const options = [
    ...(eligibleSimples ? [simples] : []),
    presumido,
    real,
  ];

  const best = options.reduce((min, curr) =>
    curr.annualTax < min.annualTax ? curr : min
  );

  // Calculate worst option for savings comparison
  const worst = options.reduce((max, curr) =>
    curr.annualTax > max.annualTax ? curr : max
  );

  return {
    simples: eligibleSimples ? simples : { ...simples, annualTax: 0, effectiveRate: 0 },
    presumido,
    real,
    bestOption: best.regime,
    savings: worst.annualTax - best.annualTax,
  };
}

// Format currency for Brazilian Real
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

// Format percentage
export function formatPercent(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
}
