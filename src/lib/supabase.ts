import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not configured. Lead capture will be disabled.');
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// TypeScript interfaces for database
export interface LeadData {
  cnpj: string;
  razao_social: string;
  whatsapp: string;
  faturamento_mensal: number;
  folha_pagamento: number;
  regime_sugerido: string;
  economia_estimada: number;
  origem_lead?: string;
  uf?: string;
  metadata?: Record<string, any>;
}

export interface Lead extends LeadData {
  id: string;
  created_at: string;
}
