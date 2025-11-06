import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AutomationSuggestion {
  id: string;
  name: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  complexity: 'easy' | 'moderate' | 'advanced';
  estimatedDays: number;
  tools: string;
  priorityScore: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { automations } = await req.json() as { automations: AutomationSuggestion[] };
    
    if (!automations || automations.length === 0) {
      throw new Error('Nenhuma automação fornecida');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY não configurada');
    }

    // Inicializar cliente Supabase para buscar prompts
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`Gerando plano e precificação para ${automations.length} automações`);

    // Preparar dados das automações para o contexto da IA
    const automationsContext = automations.map(a => 
      `- ${a.name}: ${a.description} (Impacto: ${a.impact}, Complexidade: ${a.complexity}, Estimativa: ${a.estimatedDays} dias, Ferramentas: ${a.tools})`
    ).join('\n');

    const totalDays = automations.reduce((sum, a) => sum + a.estimatedDays, 0);
    const avgComplexity = automations.some(a => a.complexity === 'advanced') ? 'advanced' : 
                          automations.some(a => a.complexity === 'moderate') ? 'moderate' : 'easy';

    // Buscar prompts customizados
    const { data: planPromptData } = await supabase
      .from('prompt_templates')
      .select('content')
      .eq('key', 'generate_plan_system')
      .single();

    const { data: pricingPromptData } = await supabase
      .from('prompt_templates')
      .select('content')
      .eq('key', 'generate_pricing_system')
      .single();

    // Gerar Plano de Trabalho
    console.log('Chamando Lovable AI para gerar plano de trabalho...');
    const planPrompt = `Crie um PLANO DE TRABALHO detalhado e profissional para implementar as seguintes automações:

${automationsContext}

ESTRUTURA OBRIGATÓRIA:

## 📊 RESUMO EXECUTIVO
- Quantidade de automações: ${automations.length}
- Prazo total estimado: ${totalDays} dias úteis
- Complexidade geral: ${avgComplexity}

## 🎯 AUTOMAÇÕES INCLUÍDAS
${automations.map(a => `### ${a.name}
- **Descrição**: ${a.description}
- **Impacto**: ${a.impact}
- **Tempo estimado**: ${a.estimatedDays} dias
- **Ferramentas**: ${a.tools}
- **Complexidade**: ${a.complexity}`).join('\n\n')}

## 📅 FASES DE IMPLEMENTAÇÃO

### Fase 1: Planejamento e Configuração (20% do tempo)
[Detalhe atividades específicas desta fase]

### Fase 2: Desenvolvimento e Integração (50% do tempo)
[Detalhe atividades específicas desta fase]

### Fase 3: Testes, Ajustes e Entrega (30% do tempo)
[Detalhe atividades específicas desta fase]

## 💡 BENEFÍCIOS ESPERADOS
[Liste 4-6 benefícios mensuráveis com percentuais realistas]

REQUISITOS:
- Seja específico e detalhado em cada fase
- Inclua atividades concretas e mensuráveis
- Mantenha o prazo realista entre 3-60 dias úteis
- Foque em benefícios práticos e mensuráveis`;

    const planResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { 
            role: 'system', 
            content: planPromptData?.content || 'Você é um gerente de projetos especializado em automação empresarial. Crie planos detalhados, realistas e profissionais.'
          },
          { role: 'user', content: planPrompt }
        ],
      }),
    });

    if (!planResponse.ok) {
      const errorText = await planResponse.text();
      console.error('Erro ao gerar plano:', planResponse.status, errorText);
      throw new Error(`Erro na API Lovable AI: ${planResponse.status}`);
    }

    const planData = await planResponse.json();
    const plan = planData.choices[0].message.content;
    console.log('Plano de trabalho gerado com sucesso');

    // Gerar Orientação de Precificação
    console.log('Chamando Lovable AI para gerar precificação...');
    const pricingPrompt = `Calcule a PRECIFICAÇÃO profissional para o seguinte projeto de automação:

**Automações**: ${automations.length}
**Prazo total**: ${totalDays} dias úteis
**Complexidade**: ${avgComplexity}

Detalhes das automações:
${automationsContext}

ESTRUTURA OBRIGATÓRIA:

## 💰 METODOLOGIAS DE PRECIFICAÇÃO

### 1. TIME-BASED (Baseada em Tempo)
**Cálculo**: ${totalDays} dias × 8 horas × R$ 150/hora
**Valor**: R$ [calcule]
**Justificativa**: [explique o cálculo]

### 2. COMPLEXITY-BASED (Baseada em Complexidade)
**Valor base**: R$ [calcule baseado no time-based]
**Multiplicador de complexidade**: 
- ${avgComplexity === 'easy' ? '0.8x para projetos simples' : avgComplexity === 'moderate' ? '1.0x para projetos moderados' : '1.3x para projetos avançados'}
**Valor final**: R$ [calcule]
**Justificativa**: [explique os ajustes]

### 3. VALUE-BASED (Baseada em Valor)
**Impacto estimado**: [analise o impacto das automações]
**Valor proposto**: R$ [calcule baseado no ROI esperado]
**Justificativa**: [explique o valor de negócio]

## 🎯 RECOMENDAÇÃO FINAL
**Faixa recomendada**: R$ [mínimo] - R$ [máximo]
**Valor sugerido**: R$ [valor médio das 3 metodologias]

## ⚠️ IMPORTANTE
- Valores incluem planejamento, desenvolvimento, testes e suporte inicial
- Manutenção contínua pode ser cobrada separadamente
- Ajustes podem ser necessários após levantamento detalhado

REQUISITOS CRÍTICOS:
- TODOS os valores DEVEM estar entre R$ 1.000 e R$ 100.000
- As 3 metodologias devem ter valores alinhados (diferença máxima de 100%)
- Seja realista e justifique cada cálculo
- Use valores redondos (múltiplos de 500 ou 1000)`;

    const pricingResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { 
            role: 'system', 
            content: pricingPromptData?.content || 'Você é um consultor de precificação especializado em projetos de automação. Calcule valores realistas entre R$ 1.000 e R$ 100.000, usando as 3 metodologias solicitadas.'
          },
          { role: 'user', content: pricingPrompt }
        ],
      }),
    });

    if (!pricingResponse.ok) {
      const errorText = await pricingResponse.text();
      console.error('Erro ao gerar precificação:', pricingResponse.status, errorText);
      throw new Error(`Erro na API Lovable AI: ${pricingResponse.status}`);
    }

    const pricingData = await pricingResponse.json();
    const pricing = pricingData.choices[0].message.content;
    console.log('Precificação gerada com sucesso');

    return new Response(
      JSON.stringify({ plan, pricing }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Erro em generate-work-plan:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        details: error 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
