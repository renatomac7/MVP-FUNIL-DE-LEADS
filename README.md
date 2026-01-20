# 🎯 Simulador Tributário - Lead Magnet MA/PI/CE 2026

Ferramenta de captura de leads de alto ticket (R$ 10k+) focada no mercado do Maranhão, Piauí e Ceará.

**🔥 Diferencial Competitivo**: Preparação para a Reforma Tributária 2026 (IBS + CBS)

## ✨ Features Implementadas

### ⚡ **DESTAQUE: Reforma Tributária 2026**
- ✅ **Página Inicial**: Badge de urgência + Headline focada em IBS+CBS
- ✅ **Dashboard**: Seção dedicada com comparação Sistema Atual vs 2026
- ✅ **Cálculo Preciso**: Impacto exato da reforma no faturamento da empresa
- ✅ **Alerta Regional**: Menos de 5% preparados no MA/PI/CE
- ✅ **WhatsApp Message**: Foco total na preparação para reforma

### 🔌 Integração Direta BrasilAPI
- ✅ Chamada direta para `https://brasilapi.com.br/api/cnpj/v1/{cnpj}`
- ✅ Auto-preenchimento de Razão Social e CNAE
- ✅ Validação e formatação de CNPJ

### 📊 Cálculos Tributários Avançados
- ✅ **Reforma Tributária 2026**: Calcula impacto do sistema dual (IBS + CBS)
- ✅ **Alerta de Fator R**: Detecta economia imediata (Anexo V → III quando folha > 28%)
- ✅ **Validação de Elegibilidade**: Simples Nacional (limite R$ 4,8M)
- ✅ Comparação Simples / Lucro Presumido / Lucro Real
- ✅ Lógica separada da UI para fácil manutenção de alíquotas

### 💾 Captura Imediata de Leads (Supabase)
- ✅ Lead salvo ANTES de mostrar dashboard de resultados
- ✅ Timeout de 3s com retry logic
- ✅ Loading overlay durante salvamento
- ✅ Campo `origem_lead` = "Simulador_Tributario_MA_PI_CE"
- ✅ Metadata completa (anexo, fator R, tipo de atividade)

### 📱 WhatsApp CTA Premium
- ✅ Botão destacado com animação pulse
- ✅ Mensagem dinâmica personalizada:
  - Razão social
  - CNPJ
  - Economia estimada
  - Regime recomendado
  - Contexto da Reforma 2026

### 🎨 Design Fintech Profissional
- ✅ Paleta: Deep blue, Green success, Red warning
- ✅ Tipografia bold, espaçamento amplo
- ✅ Sombras elevadas, bordas rounded-2xl
- ✅ Animações suaves e transições

## 🚀 Setup Rápido

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Edite o arquivo `.env` (já criado) com suas credenciais:

```env
# Supabase (obtenha em: https://app.supabase.com)
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_anon_key_aqui

# WhatsApp Business (formato: 55 + DDD + número)
# Exemplo: 5598980000000 (Maranhão)
VITE_WHATSAPP_NUMBER=5598980000000
```

### 3. Criar Tabela no Supabase

1. Acesse seu painel Supabase
2. Vá em **SQL Editor**
3. Execute o SQL do arquivo `supabase_schema.sql`

### 4. Rodar o Projeto

```bash
npm run dev
```

Acesse: `http://localhost:5173`

## 📋 Fluxo de Uso

1. **Usuário insere CNPJ** → BrasilAPI busca dados automaticamente
2. **Preenche dados financeiros** → Sistema calcula todos os regimes
3. **Modal de captura** → Solicita WhatsApp para liberar resultados
4. **Salvamento no Supabase** → Lead persistido COM loading overlay
5. **Dashboard de resultados** → Mostra economia + alertas + CTA WhatsApp

## 🔥 Destaques Técnicos

### Alerta de Economia Imediata (Fator R)
Se empresa for Simples Nacional Anexo V e folha > 28%, exibe:

```
⚠️ ECONOMIA IMEDIATA DISPONÍVEL
Migrar do Anexo V para o Anexo III pode economizar R$ X.XXX/ano!
```

### Impacto Reforma 2026
Compara carga tributária:
- **Sistema Atual**: PIS (1.65%) + COFINS (7.6%) + ISS (2-5%)
- **Sistema 2026**: IBS (12.5%) + CBS (12.5%) = 25%

### Mensagem WhatsApp Dinâmica

```
Olá! Sou da EMPRESA LTDA.

📊 Dados da simulação:
• CNPJ: 00.000.000/0000-00
• Economia estimada: R$ 50.000/ano
• Regime recomendado: Lucro Presumido

🎯 Quero agendar uma consultoria para:
✓ Garantir essa economia
✓ Preparar minha empresa para a Reforma Tributária 2026
✓ Entender a transição IBS/CBS

Quando podemos conversar?
```

## 📊 Consultar Leads no Supabase

```sql
-- Ver todos os leads
SELECT * FROM leads ORDER BY created_at DESC;

-- Leads por economia (melhores prospects)
SELECT razao_social, economia_estimada, whatsapp, created_at
FROM leads
WHERE economia_estimada > 10000
ORDER BY economia_estimada DESC;

-- Leads por UF
SELECT uf, COUNT(*) as total, SUM(economia_estimada) as economia_total
FROM leads
GROUP BY uf
ORDER BY total DESC;
```

## 🎯 Próximos Passos

1. **Configurar credenciais** no `.env`
2. **Executar SQL** no Supabase
3. **Testar fluxo completo** da captura de lead
4. **Validar WhatsApp** - verificar se mensagem está correta
5. **Ajustar cores/textos** conforme branding do escritório

## 🛠 Manutenção de Alíquotas

Todas as alíquotas estão centralizadas em `src/lib/taxCalculations.ts`:

```typescript
// Fácil atualização
export const TAX_RATES_2024 = { /* ... */ };
export const TAX_RATES_2026_TRANSITION = { /* ... */ };
export const FATOR_R_THRESHOLD = 28; // %
```

## 📞 Suporte

Dúvidas sobre implementação? Verifique:
- `implementation_plan.md` - Plano técnico completo
- `task.md` - Checklist de implementação
- `supabase_schema.sql` - Schema do banco

---

**Stack**: React + TypeScript + Vite + Tailwind CSS + Shadcn/UI + Supabase + BrasilAPI
