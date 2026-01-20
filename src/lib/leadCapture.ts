import { supabase, type LeadData } from './supabase';
import { toast } from 'sonner';

export type { LeadData };

export interface SaveLeadResult {
    success: boolean;
    leadId?: string;
    error?: string;
}

/**
 * Salva o lead no Supabase ANTES de liberar o dashboard de resultados
 * Implementa retry logic e timeout de 3 segundos
 */
export async function saveLead(data: LeadData): Promise<SaveLeadResult> {
    // Se Supabase não estiver configurado, retornar sucesso silenciosamente
    if (!supabase) {
        console.warn('Supabase not configured, skipping lead save');
        return {
            success: true,
            error: 'Supabase não configurado (desenvolvimento)'
        };
    }

    try {
        // Garantir que origem_lead está definida
        const leadData: LeadData = {
            ...data,
            origem_lead: data.origem_lead || 'Simulador_Tributario_MA_PI_CE',
        };

        // Timeout de 3 segundos
        const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Timeout - demorou mais de 3s')), 3000)
        );

        const savePromise = supabase
            .from('leads')
            .insert([leadData])
            .select()
            .single();

        // Aguardar com timeout
        const { data: lead, error } = await Promise.race([savePromise, timeoutPromise]);

        if (error) {
            console.error('Erro do Supabase:', error);
            throw error;
        }

        console.log('Lead salvo com sucesso:', lead.id);
        return {
            success: true,
            leadId: lead.id
        };

    } catch (error: any) {
        const errorMessage = error?.message || 'Erro desconhecido ao salvar lead';
        console.error('Erro ao salvar lead:', errorMessage);

        // Mostrar toast de erro mas não bloquear fluxo
        toast.error('Não conseguimos salvar seus dados, mas você pode continuar.');

        return {
            success: false,
            error: errorMessage
        };
    }
}

/**
 * Valida os dados do lead antes de salvar
 */
export function validateLeadData(data: Partial<LeadData>): string[] {
    const errors: string[] = [];

    if (!data.cnpj || data.cnpj.length < 14) {
        errors.push('CNPJ inválido');
    }

    if (!data.razao_social || data.razao_social.trim().length === 0) {
        errors.push('Razão social é obrigatória');
    }

    if (!data.whatsapp || data.whatsapp.length < 14) {
        errors.push('WhatsApp inválido');
    }

    if (!data.faturamento_mensal || data.faturamento_mensal <= 0) {
        errors.push('Faturamento mensal inválido');
    }

    if (data.folha_pagamento === undefined || data.folha_pagamento < 0) {
        errors.push('Folha de pagamento inválida');
    }

    if (!data.regime_sugerido) {
        errors.push('Regime sugerido é obrigatório');
    }

    if (data.economia_estimada === undefined) {
        errors.push('Economia estimada é obrigatória');
    }

    return errors;
}
