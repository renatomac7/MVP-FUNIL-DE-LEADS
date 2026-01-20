-- ============================================================================
-- TABELA DE LEADS - Simulador Tributário MA/PI/CE
-- ============================================================================
-- Execute este SQL no seu painel do Supabase (SQL Editor)

CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Dados da empresa
  cnpj TEXT NOT NULL,
  razao_social TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  uf TEXT,
  
  -- Dados financeiros
  faturamento_mensal NUMERIC NOT NULL,
  folha_pagamento NUMERIC NOT NULL,
  
  -- Resultado da simulação
  regime_sugerido TEXT NOT NULL,
  economia_estimada NUMERIC NOT NULL,
  
  -- Rastreamento
  origem_lead TEXT DEFAULT 'Simulador_Tributario_MA_PI_CE',
  
  -- Metadata adicional (JSON flexível)
  metadata JSONB
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_cnpj ON leads(cnpj);
CREATE INDEX IF NOT EXISTS idx_leads_origem ON leads(origem_lead);
CREATE INDEX IF NOT EXISTS idx_leads_economia ON leads(economia_estimada DESC);

-- Comentários para documentação
COMMENT ON TABLE leads IS 'Leads capturados pelo Simulador Tributário focado em MA/PI/CE';
COMMENT ON COLUMN leads.origem_lead IS 'Identificador da fonte do lead para rastreio de comissões';
COMMENT ON COLUMN leads.metadata IS 'Dados adicionais como anexo usado, fator R, tipo de atividade, etc.';

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) - Opcional
-- ============================================================================
-- Descomente se quiser habilitar RLS

-- ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- -- Policy para inserção pública (anon key pode inserir)
-- CREATE POLICY "Enable insert for anon" ON leads
--   FOR INSERT
--   WITH CHECK (true);

-- -- Policy para leitura apenas autenticada
-- CREATE POLICY "Enable read for authenticated only" ON leads
--   FOR SELECT
--   USING (auth.role() = 'authenticated');
