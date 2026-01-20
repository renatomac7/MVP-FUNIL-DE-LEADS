import { useState } from "react";
import { X, Phone, Lock, Gift, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPhone } from "@/lib/cnpjApi";
import { formatCurrency } from "@/lib/taxCalculations";
import { PrivacyPolicy } from "./PrivacyPolicy";

interface LeadCaptureModalProps {
  savings: number;
  companyName: string;
  onSubmit: (phone: string) => void;
  onClose: () => void;
}

export function LeadCaptureModal({ savings, companyName, onSubmit, onClose }: LeadCaptureModalProps) {
  const [phone, setPhone] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 14 && acceptedTerms) {
      onSubmit(phone);
    }
  };

  const isValid = phone.length >= 14 && acceptedTerms;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-card rounded-2xl shadow-elevated animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="gradient-success p-6 text-success-foreground">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-success-foreground/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-success-foreground/20 rounded-full">
              <Gift className="w-8 h-8" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center mb-2">
            Calculamos sua economia! 🎉
          </h2>

          <div className="text-center">
            <p className="text-success-foreground/80 mb-2">
              {companyName} pode economizar até
            </p>
            <p className="text-4xl font-extrabold animate-pulse-success inline-block px-4 py-2 bg-success-foreground/20 rounded-xl">
              {formatCurrency(savings)}
            </p>
            <p className="text-success-foreground/80 mt-2">por ano em impostos!</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="text-center mb-4">
            <p className="text-muted-foreground text-sm">
              Para liberar o relatório completo com comparativo detalhado,
              informe seu WhatsApp:
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="font-semibold flex items-center gap-2">
              <Phone className="w-4 h-4 text-accent" />
              WhatsApp
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(11) 99999-9999"
              value={phone}
              onChange={handlePhoneChange}
              className="h-12 text-lg font-medium text-center bg-background border-2 border-border focus:border-accent"
              maxLength={15}
              autoFocus
            />
          </div>

          {/* LGPD Consent Checkbox */}
          <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg border border-border/50">
            <div className="pt-0.5">
              <input
                type="checkbox"
                id="terms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="w-5 h-5 rounded border-input text-accent focus:ring-accent accent-accent cursor-pointer"
              />
            </div>
            <label htmlFor="terms" className="text-xs text-muted-foreground leading-snug cursor-pointer select-none">
              Concordo em receber o contato para apresentação dos resultados e aceito a{" "}
              <PrivacyPolicy />
            </label>
          </div>

          <Button
            type="submit"
            disabled={!isValid}
            variant="hero"
            size="xl"
            className="w-full"
          >
            Ver Relatório Completo
          </Button>

          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Lock className="w-3 h-3" />
            <span>Seus dados estão protegidos conforme a LGPD</span>
          </div>
        </form>
      </div>
    </div>
  );
}
