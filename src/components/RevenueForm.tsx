import { useState } from "react";
import { DollarSign, Users, Receipt, Building } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type TaxInput } from "@/lib/taxCalculations";

interface RevenueFormProps {
  activityType: 'commerce' | 'services' | 'industry' | 'transport';
  onCalculate: (input: TaxInput, isImprecise?: boolean) => void;
}

export function RevenueForm({ activityType, onCalculate }: RevenueFormProps) {
  const [monthlyRevenue, setMonthlyRevenue] = useState("");
  const [monthlyPayroll, setMonthlyPayroll] = useState("");
  const [monthlyExpenses, setMonthlyExpenses] = useState("");
  const [selectedActivityType, setSelectedActivityType] = useState<string>(activityType);

  const formatCurrency = (value: string): string => {
    const numbers = value.replace(/\D/g, "");
    const amount = parseInt(numbers) / 100;

    if (isNaN(amount) || amount === 0) return "";

    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount);
  };

  const parseCurrency = (value: string): number => {
    const numbers = value.replace(/\D/g, "");
    return parseInt(numbers) / 100 || 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const monthlyRev = parseCurrency(monthlyRevenue);
    const input: TaxInput = {
      annualRevenue: monthlyRev * 12,
      monthlyPayroll: parseCurrency(monthlyPayroll),
      monthlyExpenses: parseCurrency(monthlyExpenses),
      activityType: selectedActivityType as 'commerce' | 'services' | 'industry' | 'transport',
    };

    onCalculate(input, false);
  };

  const handleQuickSubmit = (e: React.MouseEvent) => {
    e.preventDefault();

    // Simulação Rápida: Assume valores padrão (Zero ou estimativas seguras)
    const monthlyRev = parseCurrency(monthlyRevenue);
    const input: TaxInput = {
      annualRevenue: monthlyRev * 12,
      monthlyPayroll: 0, // Assume zero para simulação de pior caso
      monthlyExpenses: 0, // Assume zero
      activityType: selectedActivityType as 'commerce' | 'services' | 'industry' | 'transport',
    };

    // Passa flag de relatório impreciso
    onCalculate(input, true);
  };

  const hasRevenue = parseCurrency(monthlyRevenue) > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="revenue" className="text-foreground font-semibold flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-accent" />
            Faturamento Mensal Médio <span className="text-destructive">*</span>
          </Label>
          <Input
            id="revenue"
            type="text"
            inputMode="numeric"
            placeholder="R$ 0,00"
            value={monthlyRevenue}
            onChange={(e) => setMonthlyRevenue(formatCurrency(e.target.value))}
            className="h-12 text-lg font-medium bg-card border-2 border-border focus:border-accent transition-colors"
          />
          <p className="text-xs text-muted-foreground">
            Receita bruta média dos últimos 12 meses
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="payroll" className="text-foreground font-semibold flex items-center gap-2">
            <Users className="w-4 h-4 text-accent" />
            Folha de Pagamento Mensal
          </Label>
          <Input
            id="payroll"
            type="text"
            inputMode="numeric"
            placeholder="R$ 0,00"
            value={monthlyPayroll}
            onChange={(e) => setMonthlyPayroll(formatCurrency(e.target.value))}
            className="h-12 text-lg font-medium bg-card border-2 border-border focus:border-accent transition-colors"
          />
          <p className="text-xs text-muted-foreground">
            Opicional para simulação rápida
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="expenses" className="text-foreground font-semibold flex items-center gap-2">
            <Receipt className="w-4 h-4 text-accent" />
            Outras Despesas Mensais
          </Label>
          <Input
            id="expenses"
            type="text"
            inputMode="numeric"
            placeholder="R$ 0,00"
            value={monthlyExpenses}
            onChange={(e) => setMonthlyExpenses(formatCurrency(e.target.value))}
            className="h-12 text-lg font-medium bg-card border-2 border-border focus:border-accent transition-colors"
          />
          <p className="text-xs text-muted-foreground">
            Opicional para simulação rápida
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="activity" className="text-foreground font-semibold flex items-center gap-2">
            <Building className="w-4 h-4 text-accent" />
            Tipo de Atividade
          </Label>
          <Select value={selectedActivityType} onValueChange={setSelectedActivityType}>
            <SelectTrigger className="h-12 text-lg font-medium bg-card border-2 border-border focus:border-accent">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="services">Serviços</SelectItem>
              <SelectItem value="commerce">Comércio</SelectItem>
              <SelectItem value="industry">Indústria</SelectItem>
              <SelectItem value="transport">Transporte</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <Button
          type="submit"
          disabled={!hasRevenue}
          variant="success"
          size="xl"
          className="w-full font-bold text-lg shadow-lg hover:shadow-xl transition-all"
        >
          Calcular Economia Exata
        </Button>

        <button
          type="button"
          onClick={handleQuickSubmit}
          disabled={!hasRevenue}
          className="w-full py-3 text-sm text-muted-foreground hover:text-accent font-medium transition-colors underline decoration-dotted"
        >
          Avançar sem dados completos (Simulação Imprecisa) →
        </button>
      </div>
    </form>
  );
}
