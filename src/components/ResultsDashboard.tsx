import { Trophy, TrendingDown, Info, BarChart3, AlertTriangle, Clock, TrendingUp, Zap } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { formatCurrency, formatPercent, calculateReforma2026Impact, TAX_RATES_2026, type TaxResult } from "@/lib/taxCalculations";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ResultsDashboardProps {
  simples: TaxResult;
  presumido: TaxResult;
  real: TaxResult;
  bestOption: string;
  savings: number;
  annualRevenue: number;
  activityType?: 'commerce' | 'services' | 'industry' | 'transport';
  isImprecise?: boolean;
}

export function ResultsDashboard({
  simples,
  presumido,
  real,
  bestOption,
  savings,
  annualRevenue,
  activityType = 'services',
  isImprecise = false,
}: ResultsDashboardProps) {
  // Calcular impacto da Reforma 2026
  const reforma2026 = calculateReforma2026Impact(annualRevenue, activityType);
  const reformImpactsNegatively = reforma2026.difference > 0;

  // Verificar se há alerta de Fator R
  const hasFatorRAlert = simples.optimizationAlerts && simples.optimizationAlerts.length > 0;
  const results = [
    { ...simples, color: "#2563eb", eligible: simples.annualTax > 0 },
    { ...presumido, color: "#7c3aed" },
    { ...real, color: "#0891b2" },
  ];

  const chartData = results
    .filter(r => r.annualTax > 0)
    .map(r => ({
      name: r.regime.replace("Lucro ", "L. "),
      fullName: r.regime,
      value: r.annualTax,
      rate: r.effectiveRate,
      isBest: r.regime === bestOption,
    }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card p-3 rounded-lg shadow-elevated border border-border">
          <p className="font-semibold text-foreground">{data.fullName}</p>
          <p className="text-success font-bold">{formatCurrency(data.value)}</p>
          <p className="text-muted-foreground text-sm">
            Alíquota efetiva: {formatPercent(data.rate)}
          </p>
        </div>
      );
    }
    return null;
  };

  // Helper para ajustar tamanho da fonte baseado no tamanho do número
  const getFontSize = (value: number, baseSize = "text-2xl") => {
    const formatted = formatCurrency(value);
    // Sem decimais, R$ 10.000.000 tem ~12-13 chars
    if (formatted.length > 15) return "text-lg"; // > 100M
    if (formatted.length > 12) return "text-xl"; // > 10M
    return baseSize;
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Imprecise Report Warning */}
      {isImprecise && (
        <Alert className="border-amber-500 bg-amber-50 dark:bg-amber-950/20">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <AlertTitle className="text-amber-800 dark:text-amber-200 font-bold">Relatório Preliminar (Dados Parciais)</AlertTitle>
          <AlertDescription className="text-amber-700 dark:text-amber-300 text-sm">
            A margem de erro pode ser alta pois <strong>Folha de Pagamento</strong> e <strong>Despesas</strong> não foram consideradas.
            Isso afeta diretamente o cálculo do Fator R e Lucro Real.
          </AlertDescription>
        </Alert>
      )}

      {/* Best Option Banner */}
      <div className="relative overflow-hidden rounded-2xl gradient-success p-6 text-success-foreground">
        <div className="absolute top-0 right-0 w-32 h-32 bg-success-foreground/10 rounded-full -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-success-foreground/10 rounded-full -ml-12 -mb-12" />

        <div className="relative flex items-center gap-4">
          <div className="p-3 bg-success-foreground/20 rounded-xl">
            <Trophy className="w-10 h-10" />
          </div>
          <div>
            <p className="text-success-foreground/80 text-sm font-medium">Melhor Opção</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold">{bestOption}</h3>
          </div>
        </div>

        <div className="relative mt-4 pt-4 border-t border-success-foreground/20 flex flex-wrap gap-6">
          <div>
            <p className="text-success-foreground/80 text-sm">Economia Anual</p>
            <p className={`${getFontSize(savings, "text-3xl")} font-bold flex items-center gap-2`}>
              <TrendingDown className="w-6 h-6" />
              {formatCurrency(savings)}
            </p>
          </div>
          <div>
            <p className="text-success-foreground/80 text-sm">Faturamento Anual</p>
            <p className={`${getFontSize(annualRevenue, "text-xl")} font-semibold`}>
              {formatCurrency(annualRevenue)}
            </p>
          </div>
        </div>
      </div>

      {/* ⚠️ DESTAQUE PRINCIPAL: Impacto da Reforma Tributária 2026 */}
      <div className="relative overflow-hidden rounded-2xl border-4 border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 p-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -mr-32 -mt-32" />

        <div className="relative space-y-4">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-500 text-white rounded-xl shadow-lg">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-extrabold text-amber-900 dark:text-amber-100 mb-1">
                ⚡ Reforma Tributária 2026: Você Está Preparado?
              </h3>
              <p className="text-amber-800 dark:text-amber-200 text-sm font-medium">
                Sistema dual IBS + CBS substituirá PIS/COFINS/ISS gradualmente
              </p>
            </div>
          </div>

          {/* Comparação Sistema Atual vs 2026 */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur rounded-xl p-4 border-2 border-slate-200 dark:border-slate-700">
              <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                Sistema Atual (2024-2025)
              </p>
              <p className={`${getFontSize(reforma2026.currentSystem, "text-2xl")} font-bold text-slate-700 dark:text-slate-300 mb-1`}>
                {formatCurrency(reforma2026.currentSystem)}/ano
              </p>
              <p className="text-xs text-muted-foreground">
                PIS ({TAX_RATES_2026.current.pis}%) + COFINS ({TAX_RATES_2026.current.cofins}%) + ISS (est.)
              </p>
            </div>

            <div className={`backdrop-blur rounded-xl p-4 border-2 ${reformImpactsNegatively
              ? 'bg-red-50/80 dark:bg-red-950/30 border-red-300 dark:border-red-700'
              : 'bg-green-50/80 dark:bg-green-950/30 border-green-300 dark:border-green-700'
              }`}>
              <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide flex items-center gap-2">
                <Zap className="w-3 h-3" />
                Sistema 2026 (IBS + CBS)
              </p>
              <p className={`${getFontSize(reforma2026.futureSystem, "text-2xl")} font-bold mb-1 ${reformImpactsNegatively ? 'text-red-700 dark:text-red-400' : 'text-green-700 dark:text-green-400'
                }`}>
                {formatCurrency(reforma2026.futureSystem)}/ano
              </p>
              <div className="flex items-center gap-2">
                {reformImpactsNegatively ? (
                  <TrendingUp className="w-4 h-4 text-red-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-green-600" />
                )}
                <p className={`text-sm font-bold ${reformImpactsNegatively ? 'text-red-700 dark:text-red-400' : 'text-green-700 dark:text-green-400'
                  }`}>
                  {reformImpactsNegatively ? '+' : ''}{formatCurrency(Math.abs(reforma2026.difference))}
                  ({reforma2026.percentageChange >= 0 ? '+' : ''}{reforma2026.percentageChange.toFixed(1)}%)
                </p>
              </div>
            </div>
          </div>

          {/* Alerta de urgência regional MA/PI/CE */}
          <Alert variant="destructive" className="border-l-4 border-red-600 bg-red-50/80 dark:bg-red-950/30">
            <Clock className="h-5 w-5" />
            <AlertTitle className="font-bold text-lg">Prazo Crítico: Adaptação até 2027</AlertTitle>
            <AlertDescription className="text-sm mt-2 space-y-2">
              <p className="font-semibold">
                📊 No Maranhão, Piauí e Ceará, menos de 5% dos escritórios de contabilidade
                estão preparados para orientar empresas na transição da Reforma Tributária.
              </p>
              <p>
                💡 <strong>A janela de planejamento está se fechando.</strong> Empresas que não se
                adaptarem pagarão {reformImpactsNegatively ? 'significativamente mais impostos' : 'mais do que o necessário'}
                ou enfrentarão riscos de autuação.
              </p>
            </AlertDescription>
          </Alert>
        </div>
      </div>

      {/* Alerta de Fator R (se aplicável) */}
      {hasFatorRAlert && simples.fatorRAnalysis?.alert && (
        <div className="relative overflow-hidden rounded-xl border-3 border-red-500 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 p-5 shadow-xl animate-pulse-slow">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-red-500 text-white rounded-lg">
              <Zap className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-red-900 dark:text-red-100 mb-1">
                Oportunidade de Economia Imediata Identificada!
              </h4>
              <p className="text-red-800 dark:text-red-200 font-medium">
                {simples.fatorRAnalysis.alert}
              </p>
              {simples.fatorRAnalysis.potentialSavings > 0 && (
                <p className="text-sm text-red-700 dark:text-red-300 mt-2">
                  <strong>Análise do Fator R:</strong> Sua folha de pagamento representa {simples.fatorRAnalysis.value.toFixed(1)}%
                  do faturamento. Isso pode qualificar sua empresa para um anexo mais vantajoso.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Comparison Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {results.map((result) => {
          const isBest = result.regime === bestOption;
          const isIneligible = result.annualTax === 0;

          return (
            <div
              key={result.regime}
              className={`relative p-5 rounded-xl border-2 transition-all duration-300 ${isBest
                ? "border-success bg-success/5 shadow-card-hover"
                : isIneligible
                  ? "border-border bg-muted/50 opacity-60"
                  : "border-border bg-card shadow-card hover:shadow-card-hover"
                }`}
            >
              {isBest && (
                <div className="absolute -top-3 left-4 px-3 py-1 bg-success text-success-foreground text-xs font-bold rounded-full">
                  MELHOR OPÇÃO
                </div>
              )}

              {isIneligible && (
                <div className="absolute -top-3 left-4 px-3 py-1 bg-muted text-muted-foreground text-xs font-bold rounded-full">
                  INELEGÍVEL
                </div>
              )}

              <h4 className="font-bold text-foreground mb-4 mt-1">{result.regime}</h4>

              {!isIneligible ? (
                <>
                  <p className={`${getFontSize(result.annualTax, "text-2xl")} font-extrabold mb-1 ${isBest ? "text-success" : "text-foreground"}`}>
                    {formatCurrency(result.annualTax)}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Alíquota: {formatPercent(result.effectiveRate)}
                  </p>

                  {result.details && (
                    <div className="pt-3 border-t border-border space-y-1">
                      {result.regime === "Simples Nacional" && (
                        <>
                          <p className="text-xs text-muted-foreground">
                            Fator R: {result.details.fatorR.toFixed(1)}%
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Anexo: {result.details.anexoUsado === 3 ? "III" : "V"}
                          </p>
                        </>
                      )}
                      {(result.regime === "Lucro Presumido" || result.regime === "Lucro Real") && (
                        <>
                          <p className="text-xs text-muted-foreground">
                            IRPJ: {formatCurrency(result.details.irpj)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PIS/COFINS: {formatCurrency(result.details.pis + result.details.cofins)}
                          </p>
                        </>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Faturamento acima de R$ 4,8M/ano. Não elegível.
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Chart */}
      <div className="bg-card rounded-xl p-6 shadow-card border border-border">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-accent" />
          <h4 className="font-bold text-foreground">Comparativo de Carga Tributária</h4>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                type="number"
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis
                type="category"
                dataKey="name"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                width={80}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.isBest ? "hsl(var(--success))" : "hsl(var(--accent))"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border text-xs text-muted-foreground">
        <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p>
            <strong>Aviso Legal:</strong> Este é um cálculo estimativo para fins de planejamento.
            Os valores reais podem variar conforme particularidades da empresa,
            atividades exercidas e legislação vigente.
          </p>
          <ul className="list-disc pl-4 space-y-0.5 mt-2">
            <li>
              <strong>Lucro Presumido:</strong> Cálculo considera ISS médio de 5% (para serviços).
            </li>
            <li>
              <strong>Lucro Real:</strong> Estimativa considera aproveitamento de créditos de PIS/COFINS sobre ~50% dos custos operacionais informados.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
