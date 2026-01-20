// CNPJ API Integration using BrasilAPI

export interface CNPJData {
  cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  cnae_fiscal: number;
  cnae_fiscal_descricao: string;
  porte: string;
  natureza_juridica: string;
  situacao_cadastral: string;
  logradouro: string;
  municipio: string;
  uf: string;
  cnaes_secundarios: Array<{
    codigo: number;
    descricao: string;
  }>;
}

export async function fetchCNPJData(cnpj: string): Promise<CNPJData | null> {
  // Remove formatting from CNPJ
  const cleanCNPJ = cnpj.replace(/\D/g, '');
  
  if (cleanCNPJ.length !== 14) {
    throw new Error('CNPJ deve ter 14 dígitos');
  }
  
  try {
    const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanCNPJ}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('CNPJ não encontrado');
      }
      throw new Error('Erro ao consultar CNPJ');
    }
    
    const data = await response.json();
    return data as CNPJData;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Erro de conexão');
  }
}

// Format CNPJ with mask
export function formatCNPJ(value: string): string {
  const numbers = value.replace(/\D/g, '');
  return numbers
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .slice(0, 18);
}

// Validate CNPJ
export function validateCNPJ(cnpj: string): boolean {
  const numbers = cnpj.replace(/\D/g, '');
  
  if (numbers.length !== 14) return false;
  
  // Check for known invalid patterns
  if (/^(\d)\1+$/.test(numbers)) return false;
  
  // Validate check digits
  let sum = 0;
  let weight = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  
  for (let i = 0; i < 12; i++) {
    sum += parseInt(numbers[i]) * weight[i];
  }
  
  let remainder = sum % 11;
  const digit1 = remainder < 2 ? 0 : 11 - remainder;
  
  if (parseInt(numbers[12]) !== digit1) return false;
  
  sum = 0;
  weight = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  
  for (let i = 0; i < 13; i++) {
    sum += parseInt(numbers[i]) * weight[i];
  }
  
  remainder = sum % 11;
  const digit2 = remainder < 2 ? 0 : 11 - remainder;
  
  return parseInt(numbers[13]) === digit2;
}

// Format phone number
export function formatPhone(value: string): string {
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length <= 10) {
    return numbers
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }
  
  return numbers
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .slice(0, 15);
}

// Determine activity type from CNAE
export function getActivityTypeFromCNAE(cnae: number): 'commerce' | 'services' | 'industry' | 'transport' {
  const cnaeStr = cnae.toString();
  
  // Transport (49-53)
  if (cnaeStr.startsWith('49') || cnaeStr.startsWith('50') || 
      cnaeStr.startsWith('51') || cnaeStr.startsWith('52') || cnaeStr.startsWith('53')) {
    return 'transport';
  }
  
  // Commerce (45-47)
  if (cnaeStr.startsWith('45') || cnaeStr.startsWith('46') || cnaeStr.startsWith('47')) {
    return 'commerce';
  }
  
  // Industry (10-33)
  const industryPrefixes = ['10', '11', '12', '13', '14', '15', '16', '17', '18', '19', 
                            '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', 
                            '30', '31', '32', '33'];
  if (industryPrefixes.some(p => cnaeStr.startsWith(p))) {
    return 'industry';
  }
  
  // Default to services
  return 'services';
}
