import { Calculator, TrendingDown, Shield, AlertTriangle, Clock, Lock } from "lucide-react";

export function HeroSection() {
  return (
    <header className="gradient-hero py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="animate-fade-in space-y-6">
          {/* Badge de Urgência Extrema */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-full font-extrabold text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(220,38,38,0.6)] animate-pulse">
            <AlertTriangle className="w-5 h-5" />
            Urgente: Prazo de Adaptação Correndo
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 text-balance leading-tight drop-shadow-xl">
            A Reforma Tributária 2026 Vai <span className="text-red-400 underline decoration-4 decoration-red-600 underline-offset-4">Corroer o Lucro</span> da Sua Empresa?
          </h1>

          <p className="text-xl sm:text-2xl text-red-50 mb-2 max-w-3xl mx-auto text-balance font-bold leading-relaxed shadow-black/10">
            Não espere a conta chegar. Descubra hoje como <span className="text-amber-300">blindar seu patrimônio</span> e pagar menos impostos legalmente.
          </p>

          <p className="text-base text-blue-100 mb-8 max-w-2xl mx-auto font-medium">
            Empresários do MA, PI e CE que ignorarem a transição Dual (IBS + CBS) poderão ver sua carga tributária aumentar em até <span className="text-white font-bold bg-white/20 px-1 rounded">40%</span>. Não faça parte dessa estatística.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-white/90 mb-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-3 bg-white/10 p-3 rounded-lg backdrop-blur-md border border-white/10">
              <Clock className="w-6 h-6 text-amber-400" />
              <div className="text-left leading-tight">
                <span className="block text-xs uppercase opacity-70">Janela de Ação</span>
                <span className="font-bold">Tempo Limitado</span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 bg-white/10 p-3 rounded-lg backdrop-blur-md border border-white/10">
              <TrendingDown className="w-6 h-6 text-green-400" />
              <div className="text-left leading-tight">
                <span className="block text-xs uppercase opacity-70">Objetivo</span>
                <span className="font-bold">Maximar Lucro</span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 bg-white/10 p-3 rounded-lg backdrop-blur-md border border-white/10">
              <Lock className="w-6 h-6 text-blue-300" />
              <div className="text-left leading-tight">
                <span className="block text-xs uppercase opacity-70">Garantia</span>
                <span className="font-bold">100% Seguro</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

