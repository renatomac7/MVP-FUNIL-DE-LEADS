import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Shield, FileText } from "lucide-react";

export function PrivacyPolicy() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="text-accent underline hover:text-accent/80 transition-colors">
                    Política de Privacidade e Termos de Uso
                </button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-foreground">
                        <Shield className="w-6 h-6 text-success" />
                        Política de Privacidade e Uso de Dados
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 text-foreground/80 mt-4">
                    <section className="space-y-2">
                        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            1. Coleta de Dados
                        </h3>
                        <p className="text-sm leading-relaxed">
                            Em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018),
                            informamos que coletamos os seguintes dados com a finalidade exclusiva de realizar
                            a simulação tributária e entrar em contato para apresentar os resultados:
                        </p>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                            <li>CNPJ e Razão Social (dados públicos da empresa)</li>
                            <li>Faturamento e Folha de Pagamento (dados sigilosos para cálculo)</li>
                            <li>Número de WhatsApp (para contato comercial)</li>
                        </ul>
                    </section>

                    <section className="space-y-2">
                        <h3 className="text-lg font-semibold text-foreground">2. Finalidade e Uso</h3>
                        <p className="text-sm leading-relaxed">
                            Os dados fornecidos serão utilizados estritamente para:
                        </p>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                            <li>Processar o cálculo comparativo entre regimes tributários.</li>
                            <li>Identificar oportunidades de economia e impacto da Reforma Tributária 2026.</li>
                            <li>Permitir que nossa equipe de especialistas entre em contato via WhatsApp para explicar o relatório.</li>
                        </ul>
                    </section>

                    <section className="space-y-2">
                        <h3 className="text-lg font-semibold text-foreground">3. Armazenamento e Segurança</h3>
                        <p className="text-sm leading-relaxed">
                            Seus dados são armazenados em ambiente seguro e criptografado.
                            Não compartilhamos, vendemos ou alugamos suas informações para terceiros.
                            O acesso é restrito à nossa equipe de consultoria tributária.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h3 className="text-lg font-semibold text-foreground">4. Seus Direitos</h3>
                        <p className="text-sm leading-relaxed">
                            Como titular dos dados, você tem o direito de solicitar, a qualquer momento:
                        </p>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                            <li>A confirmação da existência de tratamento dos dados.</li>
                            <li>O acesso, correção, anonimização, bloqueio ou eliminação dos dados.</li>
                            <li>A revogação do consentimento para contato.</li>
                        </ul>
                    </section>

                    <div className="bg-muted p-4 rounded-lg text-sm border-l-4 border-accent">
                        <p>
                            Ao utilizar este simulador, você declara estar ciente e concordar com o tratamento
                            dos seus dados para as finalidades descritas acima.
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
