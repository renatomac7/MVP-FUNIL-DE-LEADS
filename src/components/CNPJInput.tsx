import { useState } from "react";
import { Search, Loader2, Building2, CheckCircle2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { fetchCNPJData, formatCNPJ, validateCNPJ, getActivityTypeFromCNAE, type CNPJData } from "@/lib/cnpjApi";

interface CNPJInputProps {
  onDataFetched: (data: CNPJData, activityType: 'commerce' | 'services' | 'industry' | 'transport') => void;
}

export function CNPJInput({ onDataFetched }: CNPJInputProps) {
  const [cnpj, setCnpj] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [companyData, setCompanyData] = useState<CNPJData | null>(null);

  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCNPJ(e.target.value);
    setCnpj(formatted);
    setError(null);
  };

  const handleSearch = async () => {
    if (!validateCNPJ(cnpj)) {
      setError("CNPJ inválido. Verifique os dígitos.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchCNPJData(cnpj);
      if (data) {
        setCompanyData(data);
        const activityType = getActivityTypeFromCNAE(data.cnae_fiscal);
        onDataFetched(data, activityType);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao buscar CNPJ");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cnpj" className="text-foreground font-semibold">
          CNPJ da Empresa
        </Label>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="cnpj"
              type="text"
              inputMode="numeric"
              placeholder="00.000.000/0000-00"
              value={cnpj}
              onChange={handleCNPJChange}
              onKeyDown={handleKeyDown}
              className="pl-10 h-12 text-lg font-medium bg-card border-2 border-border focus:border-accent transition-all"
              maxLength={18}
              autoComplete="off"
            />
          </div>
          <Button
            onClick={handleSearch}
            disabled={isLoading || cnpj.length < 18}
            variant="hero"
            size="lg"
            className="min-w-[140px]"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Search className="w-5 h-5" />
                Buscar
              </>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive animate-scale-in">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {companyData && (
        <div className="p-4 rounded-xl bg-success/10 border-2 border-success/30 animate-scale-in">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-bold text-foreground">{companyData.razao_social}</h3>
              {companyData.nome_fantasia && (
                <p className="text-sm text-muted-foreground">{companyData.nome_fantasia}</p>
              )}
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">CNAE:</span> {companyData.cnae_fiscal} - {companyData.cnae_fiscal_descricao}
              </p>
              <p className="text-sm text-muted-foreground">
                {companyData.municipio}/{companyData.uf} • {companyData.situacao_cadastral}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
