import { useState } from "react";
import { Calculator } from "lucide-react";
import { HeroSection } from "@/components/HeroSection";
import { CNPJInput } from "@/components/CNPJInput";
import { RevenueForm } from "@/components/RevenueForm";
import { LeadCaptureModal } from "@/components/LeadCaptureModal";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { StepIndicator } from "@/components/StepIndicator";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { calculateAllRegimes, type TaxInput } from "@/lib/taxCalculations";
import { saveLead, type LeadData } from "@/lib/leadCapture";
import type { CNPJData } from "@/lib/cnpjApi";
import { toast } from "sonner";

type Step = 1 | 2 | 3 | 4;

const STEPS = ["CNPJ", "Dados", "Contato", "Resultado"];

export default function Index() {
  const [step, setStep] = useState<Step>(1);
  const [companyData, setCompanyData] = useState<CNPJData | null>(null);
  const [activityType, setActivityType] = useState<'commerce' | 'services' | 'industry' | 'transport'>('services');
  const [taxInput, setTaxInput] = useState<TaxInput | null>(null);
  const [results, setResults] = useState<ReturnType<typeof calculateAllRegimes> | null>(null);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadPhone, setLeadPhone] = useState<string | null>(null);
  const [isSavingLead, setIsSavingLead] = useState(false);

  const handleCNPJData = (data: CNPJData, activity: 'commerce' | 'services' | 'industry' | 'transport') => {
    setCompanyData(data);
    setActivityType(activity);
    setStep(2);
  };

  const handleCalculate = (input: TaxInput) => {
    setTaxInput(input);
    const calculatedResults = calculateAllRegimes(input);
    setResults(calculatedResults);

    // Show lead capture modal before results
    setShowLeadModal(true);
  };

  const handleLeadSubmit = async (phone: string) => {
    if (!companyData || !results || !taxInput) return;

    setIsSavingLead(true);
    setLeadPhone(phone);

    // Preparar dados do lead para Supabase
    const leadData: LeadData = {
      cnpj: companyData.cnpj,
      razao_social: companyData.razao_social,
      whatsapp: phone,
      faturamento_mensal: taxInput.annualRevenue / 12,
      folha_pagamento: taxInput.monthlyPayroll,
      regime_sugerido: results.bestOption,
      economia_estimada: results.savings,
      origem_lead: 'Simulador_Tributario_MA_PI_CE',
      uf: companyData.uf,
      metadata: {
        annexo_simples: results.simples.details?.anexoUsado,
        fator_r: results.simples.details?.fatorR,
        activity_type: taxInput.activityType,
      },
    };

    // Salvar no Supabase ANTES de mostrar resultados
    const { success, leadId, error } = await saveLead(leadData);

    setIsSavingLead(false);
    setShowLeadModal(false);
    setStep(4); // Libera dashboard

    if (success) {
      toast.success('✅ Seus dados foram salvos com sucesso!');
      console.log('Lead salvo com ID:', leadId);
    } else {
      // Não bloquear UX, apenas avisar
      console.error('Erro ao salvar lead:', error);
    }
  };

  const handleLeadClose = () => {
    setShowLeadModal(false);
    setStep(4);
  };

  const handleReset = () => {
    setStep(1);
    setCompanyData(null);
    setTaxInput(null);
    setResults(null);
    setLeadPhone(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <StepIndicator currentStep={step} steps={STEPS} />

        <div className="bg-card rounded-2xl shadow-elevated border border-border p-6 sm:p-8">
          {step === 1 && (
            <div className="animate-fade-in">
              <div className="text-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-black text-foreground mb-3 text-balance">
                  Descubra Quanto Você Vai Economizar
                </h2>
                <p className="text-base text-muted-foreground max-w-lg mx-auto">
                  Digite o CNPJ abaixo para gerar o <strong className="text-foreground">diagnóstico gratuito</strong> e identificar riscos da Reforma Tributária.
                </p>
              </div>
              <CNPJInput onDataFetched={handleCNPJData} />
            </div>
          )}

          {step === 2 && companyData && (
            <div className="animate-fade-in">
              <div className="text-center mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                  Calcular Economia Real
                </h2>
                <p className="text-muted-foreground">
                  Preencha os dados abaixo para visualizar o impacto no seu caixa
                </p>
              </div>

              <div className="mb-6 p-4 rounded-xl bg-muted/50 border border-border">
                <p className="font-semibold text-foreground">{companyData.razao_social}</p>
                <p className="text-sm text-muted-foreground">
                  CNPJ: {companyData.cnpj} • {companyData.cnae_fiscal_descricao}
                </p>
              </div>

              <RevenueForm activityType={activityType} onCalculate={handleCalculate} />
            </div>
          )}

          {step === 4 && results && taxInput && (
            <div className="animate-fade-in">
              <div className="text-center mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                  Resultado da Simulação
                </h2>
                <p className="text-muted-foreground">
                  {companyData?.razao_social}
                </p>
              </div>

              <ResultsDashboard
                simples={results.simples}
                presumido={results.presumido}
                real={results.real}
                bestOption={results.bestOption}
                savings={results.savings}
                annualRevenue={taxInput.annualRevenue}
                activityType={taxInput.activityType}
              />

              {/* WhatsApp CTA - Elemento Principal de Conversão */}
              <div className="mt-8 space-y-4">
                <WhatsAppButton
                  cnpj={companyData.cnpj}
                  razaoSocial={companyData.razao_social}
                  economia={results.savings}
                  regimeSugerido={results.bestOption}
                  variant="inline"
                />
              </div>

              <button
                onClick={handleReset}
                className="mt-6 w-full py-3 text-accent font-semibold hover:underline transition-colors"
              >
                ← Nova Simulação
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center pb-8">
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
            <Calculator className="w-4 h-4" />
            <span className="text-sm font-medium">Simulador Tributário</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} • Ferramenta de planejamento tributário
          </p>
        </footer>
      </main>

      {/* Lead Capture Modal com Loading State */}
      {showLeadModal && results && companyData && (
        <>
          <LeadCaptureModal
            savings={results.savings}
            companyName={companyData.nome_fantasia || companyData.razao_social}
            onSubmit={handleLeadSubmit}
            onClose={handleLeadClose}
          />

          {/* Loading Overlay durante salvamento */}
          {isSavingLead && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/80 backdrop-blur-sm">
              <div className="bg-card p-8 rounded-2xl shadow-2xl text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                </div>
                <p className="text-lg font-semibold text-foreground">Gerando seu relatório...</p>
                <p className="text-sm text-muted-foreground">Aguarde alguns instantes</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
