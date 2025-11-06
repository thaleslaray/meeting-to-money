import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.80.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { inputText, sector } = await req.json();
    
    if (!inputText || !sector) {
      throw new Error('inputText and sector are required');
    }

    console.log('Analyzing diagnostic for sector:', sector);

    // Inicializar cliente Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Buscar automações relevantes da base de conhecimento
    const { data: automations, error: dbError } = await supabase
      .from('automation_library')
      .select('*')
      .or(`sector.eq.${sector},keywords.cs.{${sector}}`);

    if (dbError) {
      console.error('Error fetching automation library:', dbError);
    }

    const automationContext = automations 
      ? `\n\nBase de Conhecimento de Automações:\n${automations.map(a => 
          `- ${a.name}: ${a.description} (Impacto: ${a.impact}, Complexidade: ${a.complexity}, Prazo: ${a.estimated_days} dias)`
        ).join('\n')}`
      : '';

    // Chamar Lovable AI
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const systemPrompt = `Você é um especialista em automação de processos de negócios. 
Analise o texto da reunião e identifique EXATAMENTE 5 oportunidades de automação viáveis.
Considere a base de conhecimento de automações disponíveis e sugira soluções práticas.

Para cada automação, retorne:
- name: nome claro e objetivo
- description: descrição detalhada (2-3 frases)
- impact: low, medium ou high
- complexity: easy, moderate ou advanced
- estimatedDays: prazo realista em dias
- tools: ferramentas específicas recomendadas
- priorityScore: número de 1 a 100 (quanto maior, mais prioritário)

Setor: ${sector}${automationContext}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: inputText }
        ],
        tools: [{
          type: 'function',
          function: {
            name: 'suggest_automations',
            description: 'Return exactly 5 automation suggestions',
            parameters: {
              type: 'object',
              properties: {
                suggestions: {
                  type: 'array',
                  minItems: 5,
                  maxItems: 5,
                  items: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      description: { type: 'string' },
                      impact: { type: 'string', enum: ['low', 'medium', 'high'] },
                      complexity: { type: 'string', enum: ['easy', 'moderate', 'advanced'] },
                      estimatedDays: { type: 'number' },
                      tools: { type: 'string' },
                      priorityScore: { type: 'number', minimum: 1, maximum: 100 }
                    },
                    required: ['name', 'description', 'impact', 'complexity', 'estimatedDays', 'tools', 'priorityScore'],
                    additionalProperties: false
                  }
                }
              },
              required: ['suggestions'],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: 'function', function: { name: 'suggest_automations' } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiData = await response.json();
    console.log('AI Response:', JSON.stringify(aiData, null, 2));

    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error('No tool call in AI response');
    }

    const suggestionsData = JSON.parse(toolCall.function.arguments);
    const suggestions = suggestionsData.suggestions.map((s: any, index: number) => ({
      id: `ai-${Date.now()}-${index}`,
      ...s
    }));

    console.log('Generated suggestions:', suggestions.length);

    return new Response(
      JSON.stringify({ suggestions }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-diagnostic:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});