import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { AutomationSuggestionCard } from "@/components/diagnostics/AutomationSuggestionCard";
import { mockInputText } from "@/data/mockData";
import { Sparkles, Loader2, Copy, CheckCircle2, FileText, DollarSign, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateDiagnostic } from "@/hooks/useCreateDiagnostic";
import { useUpdateDiagnostic } from "@/hooks/useUpdateDiagnostic";
import { AutomationSuggestion } from "@/types/database";

const NewDiagnostic = () => {
  const [inputText, setInputText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([]);
  const [diagnosticId, setDiagnosticId] = useState<string | null>(null);
  const [generatedSuggestions, setGeneratedSuggestions] = useState<AutomationSuggestion[]>([]);
  const [planDocument, setPlanDocument] = useState<string>("");
  const [pricingAdvice, setPricingAdvice] = useState<string>("");
  
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const createDiagnostic = useCreateDiagnostic();
  const updateDiagnostic = useUpdateDiagnostic();

  const generateMockSuggestions = (text: string): AutomationSuggestion[] => {
    const lowerText = text.toLowerCase();
    const suggestions: AutomationSuggestion[] = [];

    if (lowerText.includes('lead') || lowerText.includes('contato') || lowerText.includes('cliente')) {
      suggestions.push({
        id: 'lead-management',
        name: 'Sistema de Gestão de Leads',
        description: 'Centralizar captura, qualificação e distribuição automática de leads',
        impact: 'high',
        complexity: 'moderate',
        estimatedDays: 8,
        tools: 'Zapier, Google Sheets, CRM (Bitrix24 ou Pipedrive)',
        priorityScore: 1.5,
      });
    }

    if (lowerText.includes('mensagem') || lowerText.includes('resposta') || lowerText.includes('whatsapp')) {
      suggestions.push({
        id: 'auto-communication',
        name: 'Respostas Automáticas',
        description: 'Respostas instantâneas via WhatsApp/email com templates personalizados',
        impact: 'medium',
        complexity: 'easy',
        estimatedDays: 3,
        tools: 'WhatsApp Business API, Make.com',
        priorityScore: 2.0,
      });
    }

    if (lowerText.includes('agendar') || lowerText.includes('reunião') || lowerText.includes('visita')) {
      suggestions.push({
        id: 'scheduling',
        name: 'Agendamento Inteligente',
        description: 'Sistema de agendamento com sincronização de calendário e lembretes automáticos',
        impact: 'medium',
        complexity: 'easy',
        estimatedDays: 5,
        tools: 'Calendly, Google Calendar, Zapier',
        priorityScore: 2.0,
      });
    }

    if (lowerText.includes('contrato') || lowerText.includes('proposta') || lowerText.includes('documento')) {
      suggestions.push({
        id: 'document-generation',
        name: 'Geração Automática de Documentos',
        description: 'Criação de contratos e propostas com dados preenchidos automaticamente',
        impact: 'high',
        complexity: 'moderate',
        estimatedDays: 7,
        tools: 'Google Docs, Zapier, PandaDoc',
        priorityScore: 1.5,
      });
    }

    suggestions.push({
      id: 'reporting-dashboard',
      name: 'Dashboard de Métricas',
      description: 'Painel com indicadores de performance e relatórios automáticos',
      impact: 'medium',
      complexity: 'moderate',
      estimatedDays: 10,
      tools: 'Google Data Studio, Sheets, Integromat',
      priorityScore: 1.0,
    });

    if (suggestions.length === 0) {
      suggestions.push({
        id: 'process-automation',
        name: 'Automação de Processos Básicos',
        description: 'Identificar e automatizar processos manuais repetitivos',
        impact: 'medium',
        complexity: 'easy',
        estimatedDays: 5,
        tools: 'Zapier, Make.com',
        priorityScore: 2.0,
      });
    }

    return suggestions;
  };

  const extractMetadata = (text: string): { title: string; sector: string } => {
    const lowerText = text.toLowerCase();
    
    let sector = 'Outros';
    if (lowerText.includes('imob') || lowerText.includes('imóve')) sector = 'Imobiliária';
    else if (lowerText.includes('restaurante') || lowerText.includes('comida')) sector = 'Restaurante';
    else if (lowerText.includes('clínica') || lowerText.includes('saúde') || lowerText.includes('médic')) sector = 'Saúde';
    else if (lowerText.includes('loja') || lowerText.includes('e-commerce') || lowerText.includes('venda')) sector = 'E-commerce';
    else if (lowerText.includes('consultoria') || lowerText.includes('serviço')) sector = 'Serviços';
    
    const timestamp = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    const title = `Diagnóstico ${sector} - ${timestamp}`;
    
    return { title, sector };
  };

  const generateMockPlan = (suggestions: AutomationSuggestion[]): string => {
    const totalDays = suggestions.reduce((sum, s) => sum + s.estimatedDays, 0);
    const avgComplexity = suggestions.some(s => s.complexity === 'advanced') ? 'Alta' 
      : suggestions.some(s => s.complexity === 'moderate') ? 'Média' : 'Baixa';

    return `PLANO DE TRABALHO - Automações Selecionadas

📋 RESUMO
- Automações: ${suggestions.length}
- Prazo estimado: ${totalDays} dias úteis
- Complexidade geral: ${avgComplexity}

🎯 AUTOMAÇÕES INCLUÍDAS
${suggestions.map((s, i) => `${i + 1}. ${s.name}
   - Impacto: ${s.impact === 'high' ? 'Alto' : s.impact === 'medium' ? 'Médio' : 'Baixo'}
   - Tempo: ${s.estimatedDays} dias
   - Ferramentas: ${s.tools}`).join('\n\n')}

📅 FASES DE IMPLEMENTAÇÃO
Fase 1 (Dias 1-${Math.ceil(totalDays * 0.3)}): Planejamento e configuração inicial
- Levantamento detalhado de requisitos
- Configuração de contas e integrações
- Definição de fluxos de trabalho

Fase 2 (Dias ${Math.ceil(totalDays * 0.3) + 1}-${Math.ceil(totalDays * 0.7)}): Desenvolvimento
- Implementação das automações selecionadas
- Testes internos
- Ajustes e otimizações

Fase 3 (Dias ${Math.ceil(totalDays * 0.7) + 1}-${totalDays}): Entrega e treinamento
- Testes com dados reais
- Documentação
- Treinamento da equipe

✅ BENEFÍCIOS ESPERADOS
- Redução de tempo em tarefas manuais: 60-80%
- Melhoria na taxa de resposta: 40-60%
- Padronização de processos
- Escalabilidade do negócio`;
  };

  const generateMockPricing = (suggestions: AutomationSuggestion[]): string => {
    const totalDays = suggestions.reduce((sum, s) => sum + s.estimatedDays, 0);
    const hourlyRate = 150;
    const hoursPerDay = 8;
    
    const timeBased = totalDays * hoursPerDay * hourlyRate;
    const complexityMultiplier = suggestions.some(s => s.complexity === 'advanced') ? 1.3 : 1.0;
    const complexityBased = Math.round(timeBased * complexityMultiplier);
    
    const impactScore = suggestions.reduce((sum, s) => 
      sum + (s.impact === 'high' ? 3 : s.impact === 'medium' ? 2 : 1), 0);
    const valueBased = Math.round(timeBased * (1 + impactScore / 10));

    return `ORIENTAÇÃO DE PRECIFICAÇÃO

📊 METODOLOGIA 1: TIME-BASED (Baseado em Tempo)
Cálculo: ${totalDays} dias × ${hoursPerDay} horas × R$ ${hourlyRate}/hora
Valor sugerido: R$ ${timeBased.toLocaleString('pt-BR')} - R$ ${Math.round(timeBased * 1.2).toLocaleString('pt-BR')}

🎯 METODOLOGIA 2: COMPLEXITY-BASED (Baseado em Complexidade)
Análise: Complexidade ${suggestions.some(s => s.complexity === 'advanced') ? 'Alta' : suggestions.some(s => s.complexity === 'moderate') ? 'Média' : 'Baixa'}
Valor sugerido: R$ ${complexityBased.toLocaleString('pt-BR')} - R$ ${Math.round(complexityBased * 1.3).toLocaleString('pt-BR')}

💎 METODOLOGIA 3: VALUE-BASED (Baseado em Valor Entregue)
Impacto esperado: ${impactScore > 10 ? 'Muito Alto' : impactScore > 6 ? 'Alto' : 'Médio'}
Valor sugerido: R$ ${valueBased.toLocaleString('pt-BR')} - R$ ${Math.round(valueBased * 1.5).toLocaleString('pt-BR')}

💡 RECOMENDAÇÃO
Para este projeto, considerando:
- ${suggestions.length} automações
- ${totalDays} dias de trabalho
- Impacto ${impactScore > 10 ? 'muito alto' : impactScore > 6 ? 'alto' : 'médio'} no negócio

Faixa recomendada: R$ ${Math.min(timeBased, complexityBased, valueBased).toLocaleString('pt-BR')} - R$ ${Math.max(timeBased, complexityBased, valueBased).toLocaleString('pt-BR')}

⚠️ IMPORTANTE: Avalie o valor que o cliente perceberá. Se a economia mensal for superior a R$ 5.000, considere cobrar um percentual do valor economizado (20-30%).`;
  };

  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Atenção",
        description: "Por favor, insira o resumo da reunião antes de analisar.",
        variant: "destructive",
      });
      return;
    }

    if (inputText.length > 10000) {
      toast({
        title: "Texto muito longo",
        description: "O resumo deve ter no máximo 10.000 caracteres.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar autenticado para criar um diagnóstico.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      const suggestions = generateMockSuggestions(inputText);
      setGeneratedSuggestions(suggestions);

      const { title, sector } = extractMetadata(inputText);

      const newDiagnostic = await createDiagnostic.mutateAsync({
        title: title,
        sector: sector,
        input_text: inputText,
        generated_suggestions: suggestions,
        selected_automations: [],
        status: 'completed',
      });

      setDiagnosticId(newDiagnostic.id);
      setShowResults(true);

      toast({
        title: "Análise concluída!",
        description: `${suggestions.length} sugestões de automação identificadas e priorizadas.`,
      });

    } catch (error) {
      console.error("Erro ao criar diagnóstico:", error);
      toast({
        title: "Erro ao analisar",
        description: "Não foi possível criar o diagnóstico. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleToggleSuggestion = async (id: string) => {
    const newSelected = selectedSuggestions.includes(id)
      ? selectedSuggestions.filter((s) => s !== id)
      : [...selectedSuggestions, id];

    setSelectedSuggestions(newSelected);

    if (diagnosticId && newSelected.length > 0) {
      const selected = generatedSuggestions.filter(s => newSelected.includes(s.id));
      
      const plan = generateMockPlan(selected);
      const pricing = generateMockPricing(selected);
      
      setPlanDocument(plan);
      setPricingAdvice(pricing);

      try {
        await updateDiagnostic.mutateAsync({
          id: diagnosticId,
          updates: {
            selected_automations: newSelected,
            plan_document: plan,
            pricing_advice: pricing,
          },
        });
      } catch (error) {
        console.error("Erro ao atualizar diagnóstico:", error);
      }
    } else if (newSelected.length === 0) {
      setPlanDocument("");
      setPricingAdvice("");
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: `${label} copiado para a área de transferência.`,
    });
  };

  const handleLoadExample = () => {
    setInputText(mockInputText);
    toast({
      title: "Exemplo carregado",
      description: "Agora clique em 'Analisar' para ver os resultados.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Novo Diagnóstico</h1>
          <p className="text-muted-foreground">
            Cole o resumo ou transcrição da reunião consultiva para gerar análise automatizada
          </p>
        </div>

        {/* Input Section */}
        <Card className="p-6 mb-8">
          <div className="mb-4 flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">
              Resumo da Reunião
            </label>
            <Button variant="ghost" size="sm" onClick={handleLoadExample}>
              Carregar exemplo
            </Button>
          </div>
          
          <Textarea
            placeholder="Cole aqui o resumo ou transcrição da reunião com o cliente. Inclua informações sobre o negócio, principais problemas identificados, processos manuais, e expectativas do cliente..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[200px] mb-4 font-mono text-sm"
          />

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {inputText.length} caracteres
            </p>
            <Button
              variant="hero"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analisando...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Analisar
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Results Section */}
        {showResults && (
          <div className="space-y-8">
            {/* Suggestions Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-1">
                    Sugestões de Automação
                  </h2>
                  <p className="text-muted-foreground">
                    Ordenadas por prioridade (impacto vs. complexidade)
                  </p>
                </div>
                {selectedSuggestions.length > 0 && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-success-light">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                    <span className="text-sm font-medium text-success">
                      {selectedSuggestions.length} selecionada(s)
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {generatedSuggestions
                  .sort((a, b) => b.priorityScore - a.priorityScore)
                  .map((suggestion) => (
                    <AutomationSuggestionCard
                      key={suggestion.id}
                      suggestion={suggestion}
                      selected={selectedSuggestions.includes(suggestion.id)}
                      onToggle={handleToggleSuggestion}
                    />
                  ))}
              </div>
            </div>

            {/* Plan Document Section */}
            {selectedSuggestions.length > 0 && (
              <>
                <Card className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-foreground mb-1">
                          Plano de Trabalho
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Baseado nas {selectedSuggestions.length} automações selecionadas
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(planDocument, "Plano de Trabalho")}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar
                    </Button>
                  </div>
                  
                  <div className="prose prose-sm max-w-none">
                    <div className="p-4 rounded-lg bg-muted/50 border border-border font-mono text-xs whitespace-pre-wrap">
                      {planDocument}
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                        <DollarSign className="w-5 h-5 text-success" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-foreground mb-1">
                          Orientação de Precificação
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          3 metodologias com faixas de mercado
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(pricingAdvice, "Orientação de Precificação")}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar
                    </Button>
                  </div>
                  
                  <div className="prose prose-sm max-w-none">
                    <div className="p-4 rounded-lg bg-muted/50 border border-border font-mono text-xs whitespace-pre-wrap">
                      {pricingAdvice}
                    </div>
                  </div>
                </Card>

                <div className="mt-8 flex justify-end">
                  <Button
                    variant="hero"
                    size="lg"
                    onClick={() => {
                      if (diagnosticId) {
                        navigate(`/diagnostico/${diagnosticId}`);
                      }
                    }}
                    disabled={!diagnosticId}
                  >
                    Salvar e Ver Detalhes
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Empty State (when not analyzing and no results) */}
        {!showResults && !isAnalyzing && (
          <Card className="p-12 text-center">
            <Sparkles className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Pronto para começar?
            </h3>
            <p className="text-muted-foreground">
              Cole o resumo da reunião acima e clique em "Analisar" para gerar sugestões de automação.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default NewDiagnostic;
