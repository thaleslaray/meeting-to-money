export interface ValidationResult {
  isValid: boolean;
  score: number; // 0-100
  issues: string[];
  warnings: string[];
}

/**
 * Extrai valores monetários de um texto (formato R$ XX.XXX ou R$ XXXXX)
 */
function extractPriceValues(text: string): number[] {
  const regex = /R\$\s*(\d{1,3}(?:\.\d{3})*|\d+)/g;
  const matches = text.matchAll(regex);
  const values: number[] = [];
  
  for (const match of matches) {
    const valueStr = match[1].replace(/\./g, '');
    const value = parseInt(valueStr, 10);
    if (!isNaN(value)) {
      values.push(value);
    }
  }
  
  return values;
}

/**
 * Verifica se todas as seções obrigatórias estão presentes no texto
 */
function hasRequiredSections(text: string, sections: string[]): boolean {
  const textUpper = text.toUpperCase();
  return sections.every(section => textUpper.includes(section.toUpperCase()));
}

/**
 * Valida a qualidade de um plano de trabalho
 */
export function validatePlanQuality(plan: string): ValidationResult {
  const issues: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  if (!plan || plan.trim().length < 100) {
    return {
      isValid: false,
      score: 0,
      issues: ['Plano muito curto ou vazio'],
      warnings: [],
    };
  }

  // Verificar estrutura obrigatória (40 pontos)
  const requiredSections = [
    'RESUMO',
    'AUTOMAÇÕES INCLUÍDAS',
    'FASES DE IMPLEMENTAÇÃO',
    'BENEFÍCIOS ESPERADOS'
  ];
  
  const missingSections = requiredSections.filter(
    section => !plan.toUpperCase().includes(section)
  );
  
  if (missingSections.length > 0) {
    issues.push(`Faltam seções: ${missingSections.join(', ')}`);
    score -= missingSections.length * 10;
  }

  // Verificar conteúdo detalhado (30 pontos)
  if (plan.length < 500) {
    warnings.push('Plano parece muito resumido');
    score -= 15;
  }

  // Verificar se menciona automações (necessário ter pelo menos 1)
  const automationCount = (plan.match(/Automação \d+:/g) || []).length;
  if (automationCount === 0) {
    issues.push('Nenhuma automação detalhada encontrada');
    score -= 20;
  }

  // Verificar prazo realista (15 pontos)
  const daysMatch = plan.match(/(\d+)\s*dias?\s*úteis/i);
  if (daysMatch) {
    const days = parseInt(daysMatch[1], 10);
    if (days < 3) {
      warnings.push('Prazo muito curto (< 3 dias)');
      score -= 10;
    } else if (days > 60) {
      warnings.push('Prazo muito longo (> 60 dias)');
      score -= 5;
    }
  } else {
    warnings.push('Prazo total não encontrado');
    score -= 10;
  }

  // Verificar benefícios mensuráveis (15 pontos)
  if (!plan.includes('%') && !plan.toLowerCase().includes('redução') && !plan.toLowerCase().includes('aumento')) {
    warnings.push('Benefícios poderiam ser mais específicos/mensuráveis');
    score -= 10;
  }

  score = Math.max(0, Math.min(100, score));

  return {
    isValid: score >= 50,
    score,
    issues,
    warnings,
  };
}

/**
 * Valida a qualidade de uma orientação de precificação
 */
export function validatePricingQuality(pricing: string): ValidationResult {
  const issues: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  if (!pricing || pricing.trim().length < 100) {
    return {
      isValid: false,
      score: 0,
      issues: ['Precificação muito curta ou vazia'],
      warnings: [],
    };
  }

  // Verificar presença das 3 metodologias (30 pontos)
  const methodologies = ['TIME-BASED', 'COMPLEXITY-BASED', 'VALUE-BASED'];
  const missingMethodologies = methodologies.filter(
    method => !pricing.toUpperCase().includes(method)
  );
  
  if (missingMethodologies.length > 0) {
    issues.push(`Faltam metodologias: ${missingMethodologies.join(', ')}`);
    score -= missingMethodologies.length * 10;
  }

  // Extrair valores monetários
  const values = extractPriceValues(pricing);
  
  // Verificar faixa de valores (30 pontos)
  const MIN_VALUE = 1000;
  const MAX_VALUE = 100000;
  const outOfRangeValues = values.filter(v => v < MIN_VALUE || v > MAX_VALUE);
  
  if (outOfRangeValues.length > 0) {
    issues.push(`Valores fora da faixa (R$ 1.000 - R$ 100.000): ${outOfRangeValues.map(v => `R$ ${v.toLocaleString('pt-BR')}`).join(', ')}`);
    score -= 30;
  }

  // Verificar alinhamento entre metodologias (20 pontos)
  if (values.length >= 3) {
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    const difference = ((maxValue - minValue) / minValue) * 100;
    
    if (difference > 100) {
      warnings.push(`Metodologias muito desalinhadas (diferença de ${difference.toFixed(0)}%)`);
      score -= 15;
    } else if (difference > 50) {
      warnings.push(`Alguma variação entre metodologias (${difference.toFixed(0)}%)`);
      score -= 5;
    }
  }

  // Verificar recomendação clara (20 pontos)
  if (!pricing.toUpperCase().includes('RECOMENDAÇÃO')) {
    warnings.push('Falta seção de recomendação final');
    score -= 10;
  }
  
  if (!pricing.toUpperCase().includes('IMPORTANTE')) {
    warnings.push('Falta seção de considerações importantes');
    score -= 10;
  }

  score = Math.max(0, Math.min(100, score));

  return {
    isValid: score >= 50,
    score,
    issues,
    warnings,
  };
}
