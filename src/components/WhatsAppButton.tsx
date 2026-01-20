import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WhatsAppButtonProps {
    cnpj: string;
    razaoSocial: string;
    economia: number;
    regimeSugerido: string;
    variant?: "fixed" | "inline";
}

export function WhatsAppButton({
    cnpj,
    razaoSocial,
    economia,
    regimeSugerido,
    variant = "inline",
}: WhatsAppButtonProps) {
    const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "5598980000000";

    // Formatar economia para texto
    const economiaFormatada = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(economia);

    // Mensagem dinâmica completa com contexto da Reforma 2026
    const message = `Olá! Sou da *${razaoSocial}*.

📊 *REFORMA TRIBUTÁRIA 2026 - URGENTE*

Acabei de fazer uma simulação e descobri:
• CNPJ: ${cnpj}
• Economia anual possível: *R$ ${economia.toLocaleString('pt-BR')}*
• Regime recomendado: ${regimeSugerido}

⚠️ *POR QUE PRECISO DE AJUDA AGORA:*
Com a transição do sistema dual (IBS + CBS) se aproximando, preciso de orientação especializada para:

✓ Entender como a reforma impactará minha empresa
✓ Garantir a economia identificada na simulação
✓ Evitar riscos de autuação na transição 2026-2027
✓ Fazer o planejamento tributário correto ANTES que seja tarde

🎯 No Maranhão/Piauí/Ceará, poucos escritórios entendem a reforma. 

Quando podemos agendar uma consultoria?`;

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    const handleClick = () => {
        // Track event (opcional - para analytics futuros)
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'click', {
                event_category: 'WhatsApp CTA',
                event_label: 'Consulta Especialista',
                value: economia,
            });
        }

        window.open(whatsappUrl, '_blank');
    };

    if (variant === "fixed") {
        return (
            <div className="fixed bottom-6 right-6 z-50 animate-bounce">
                <Button
                    onClick={handleClick}
                    size="lg"
                    className="h-16 px-6 bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-2xl text-lg font-bold gap-3 animate-pulse"
                >
                    <MessageCircle className="w-6 h-6" />
                    Falar com Especialista
                </Button>
            </div>
        );
    }

    return (
        <Button
            onClick={handleClick}
            size="xl"
            className="w-full h-16 bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xl text-lg font-bold gap-3 hover:scale-105 transition-transform"
        >
            <MessageCircle className="w-6 h-6" />
            💬 Falar com Especialista - Garantir Esta Economia
        </Button>
    );
}
