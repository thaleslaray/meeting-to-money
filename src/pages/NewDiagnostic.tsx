import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AutomationSuggestionCard } from "@/components/diagnostics/AutomationSuggestionCard";
import { QualityBadge } from "@/components/diagnostics/QualityBadge";
import { mockInputText } from "@/data/mockData";
import { Sparkles, Loader2, Copy, CheckCircle2, FileText, DollarSign, ArrowRight, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateDiagnostic } from "@/hooks/useCreateDiagnostic";
import { useUpdateDiagnostic } from "@/hooks/useUpdateDiagnostic";
import { checkAndIncrementUsage } from "@/hooks/useUsageLimit";
import { AutomationSuggestion } from "@/types/database";
import { supabase } from "@/integrations/supabase/client";
import { diagnosticInputSchema, sanitizeInput } from "@/lib/validation";
import { validatePlanQuality, validatePricingQuality, ValidationResult } from "@/lib/qualityValidation";

const NewDiagnostic = () => {
  const [title, setTitle] = useState("");
  const [sector, setSector] = useState("");
  const [inputText, setInputText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([]);
  const [diagnosticId, setDiagnosticId] = useState<string | null>(null);
  const [generatedSuggestions, setGeneratedSuggestions] = useState<AutomationSuggestion[]>([]);
  const [planDocument, setPlanDocument] = useState<string>("");
  const [pricingAdvice, setPricingAdvice] = useState<string>("");
  const [errors, setErrors] = useState<any>({});
  const [planValidation, setPlanValidation] = useState<ValidationResult | null>(null);
  const [pricingValidation, setPricingValidation] = useState<ValidationResult | null>(null);
  const [qualityScore, setQualityScore] = useState<number | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  
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

  const handleAnalyze = async () => {
    // Validação com zod
    const validationResult = diagnosticInputSchema.safeParse({
      title: title.trim(),
      sector: sector.trim(),
      inputText: inputText.trim()
    });

    if (!validationResult.success) {
      const fieldErrors: any = {};
      validationResult.error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0]] = err.message;
        }
      });
      setErrors(fieldErrors);
      toast({
        title: "Erro de validação",
        description: "Por favor, corrija os campos destacados.",
        variant: "destructive",
      });
      return;
    }

    setErrors({});

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
      // Verificar limite de uso
      const usageCheck = await checkAndIncrementUsage(user.id);
      
      if (!usageCheck.allowed) {
        toast({
          title: "Limite atingido",
          description: `Você atingiu o limite de ${usageCheck.limit} diagnósticos por mês. O limite será reiniciado no próximo mês.`,
          variant: "destructive",
        });
        setIsAnalyzing(false);
        return;
      }

      // Chamar IA real para gerar sugestões
      console.log('Chamando edge function analyze-diagnostic...');
      const { data: aiResponse, error: aiError } = await supabase.functions.invoke('analyze-diagnostic', {
        body: { 
          inputText: sanitizeInput(inputText),
          sector: sanitizeInput(sector)
        }
      });

      if (aiError) {
        console.error('Erro na edge function:', aiError);
        throw new Error('Erro ao analisar com IA: ' + aiError.message);
      }

      if (!aiResponse?.suggestions || aiResponse.suggestions.length === 0) {
        throw new Error('Nenhuma sugestão foi gerada pela IA');
      }

      const suggestions = aiResponse.suggestions;
      setGeneratedSuggestions(suggestions);

      const newDiagnostic = await createDiagnostic.mutateAsync({
        title: sanitizeInput(title),
        sector: sanitizeInput(sector),
        input_text: sanitizeInput(inputText),
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
      setIsGeneratingPlan(true);
      
      try {
        const selected = generatedSuggestions.filter(s => newSelected.includes(s.id));
        
        toast({
          title: "Gerando plano e precificação...",
          description: "Usando IA para criar conteúdo personalizado",
        });

        // Chamar edge function para gerar plano e precificação com IA
        console.log('Chamando generate-work-plan com', selected.length, 'automações');
        const { data: workPlanData, error: workPlanError } = await supabase.functions.invoke('generate-work-plan', {
          body: { automations: selected }
        });

        if (workPlanError) {
          console.error('Erro ao gerar plano:', workPlanError);
          throw new Error('Erro ao gerar plano e precificação');
        }

        const { plan, pricing } = workPlanData;
        
        // Validar qualidade
        const planVal = validatePlanQuality(plan);
        const pricingVal = validatePricingQuality(pricing);
        const avgScore = Math.round((planVal.score + pricingVal.score) / 2);
        
        setPlanDocument(plan);
        setPricingAdvice(pricing);
        setPlanValidation(planVal);
        setPricingValidation(pricingVal);
        setQualityScore(avgScore);

        await updateDiagnostic.mutateAsync({
          id: diagnosticId,
          updates: {
            selected_automations: newSelected,
            plan_document: plan,
            pricing_advice: pricing,
            quality_score: avgScore,
          },
        });
        
        toast({
          title: "✅ Plano gerado com sucesso",
          description: `Score de qualidade: ${avgScore}/100`,
        });
        
        if (avgScore < 70) {
          toast({
            title: "⚠️ Qualidade abaixo do esperado",
            description: "O conteúdo gerado pode necessitar revisão. Veja os detalhes abaixo.",
            variant: "default",
          });
        }
      } catch (error) {
        console.error("Erro ao gerar plano:", error);
        toast({
          title: "Erro ao gerar plano",
          description: "Não foi possível gerar o plano. Tente novamente.",
          variant: "destructive",
        });
      } finally {
        setIsGeneratingPlan(false);
      }
    } else if (newSelected.length === 0) {
      setPlanDocument("");
      setPricingAdvice("");
      setPlanValidation(null);
      setPricingValidation(null);
      setQualityScore(null);
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

  const handleRegenerate = async () => {
    if (!diagnosticId || selectedSuggestions.length === 0) return;
    
    setIsGeneratingPlan(true);
    
    try {
      const selected = generatedSuggestions.filter(s => selectedSuggestions.includes(s.id));
      
      toast({
        title: "Re-gerando com IA...",
        description: "Criando nova versão do plano e precificação",
      });

      const { data: workPlanData, error: workPlanError } = await supabase.functions.invoke('generate-work-plan', {
        body: { automations: selected }
      });

      if (workPlanError) {
        throw new Error('Erro ao re-gerar plano e precificação');
      }

      const { plan, pricing } = workPlanData;
      
      const planVal = validatePlanQuality(plan);
      const pricingVal = validatePricingQuality(pricing);
      const avgScore = Math.round((planVal.score + pricingVal.score) / 2);
      
      setPlanDocument(plan);
      setPricingAdvice(pricing);
      setPlanValidation(planVal);
      setPricingValidation(pricingVal);
      setQualityScore(avgScore);
      
      await updateDiagnostic.mutateAsync({
        id: diagnosticId,
        updates: { 
          plan_document: plan, 
          pricing_advice: pricing, 
          quality_score: avgScore 
        },
      });
      
      toast({
        title: "Conteúdo re-gerado com sucesso",
        description: `Novo score de qualidade: ${avgScore}/100`,
      });
    } catch (error) {
      console.error("Erro ao re-gerar:", error);
      toast({
        title: "Erro ao re-gerar",
        description: "Não foi possível re-gerar o conteúdo. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPlan(false);
    }
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
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className={errors.title ? 'text-destructive' : ''}>
                Título do Diagnóstico
              </Label>
              <Input
                id="title"
                placeholder="Ex: Diagnóstico Vendas - Imobiliária"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={errors.title ? 'border-destructive' : ''}
              />
              {errors.title && (
                <p className="text-sm text-destructive mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <Label htmlFor="sector" className={errors.sector ? 'text-destructive' : ''}>
                Setor/Área
              </Label>
              <Input
                id="sector"
                placeholder="Ex: vendas, marketing, atendimento"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className={errors.sector ? 'border-destructive' : ''}
              />
              {errors.sector && (
                <p className="text-sm text-destructive mt-1">{errors.sector}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="inputText" className={errors.inputText ? 'text-destructive' : ''}>
                  Resumo da Reunião
                </Label>
                <Button variant="ghost" size="sm" onClick={handleLoadExample}>
                  Carregar exemplo
                </Button>
              </div>
              
              <Textarea
                id="inputText"
                placeholder="Cole aqui o resumo ou transcrição da reunião com o cliente. Inclua informações sobre o negócio, principais problemas identificados, processos manuais, e expectativas do cliente..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className={`min-h-[200px] font-mono text-sm ${errors.inputText ? 'border-destructive' : ''}`}
              />
              {errors.inputText && (
                <p className="text-sm text-destructive mt-1">{errors.inputText}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
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
                  Analisando com IA...
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
                      onToggle={isGeneratingPlan ? undefined : handleToggleSuggestion}
                    />
                  ))}
              </div>
            </div>

            {/* Plan Document Section */}
            {selectedSuggestions.length > 0 && (
              <>
                {isGeneratingPlan && (
                  <Card className="p-6">
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          Gerando plano e precificação com IA...
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Isso pode levar alguns segundos
                        </p>
                      </div>
                    </div>
                  </Card>
                )}
                
                {!isGeneratingPlan && planDocument && (
                <Card className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-semibold text-foreground">
                            Plano de Trabalho
                          </h3>
                          {qualityScore && <QualityBadge score={qualityScore} />}
                          {planValidation && planValidation.issues.length > 0 && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <AlertCircle className="w-4 h-4 text-yellow-500" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <p className="font-semibold mb-2">Problemas identificados:</p>
                                  <ul className="list-disc pl-4 space-y-1">
                                    {planValidation.issues.map((issue, i) => (
                                      <li key={i} className="text-sm">{issue}</li>
                                    ))}
                                  </ul>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
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
                  
                  {qualityScore && qualityScore < 70 && (
                    <div className="mt-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleRegenerate}
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Re-gerar com melhor qualidade
                      </Button>
                    </div>
                  )}
                </Card>
                )}

                {!isGeneratingPlan && pricingAdvice && (
                <Card className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                        <DollarSign className="w-5 h-5 text-success" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-semibold text-foreground">
                            Orientação de Precificação
                          </h3>
                          {pricingValidation && pricingValidation.issues.length > 0 && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <AlertCircle className="w-4 h-4 text-yellow-500" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <p className="font-semibold mb-2">Problemas identificados:</p>
                                  <ul className="list-disc pl-4 space-y-1">
                                    {pricingValidation.issues.map((issue, i) => (
                                      <li key={i} className="text-sm">{issue}</li>
                                    ))}
                                  </ul>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
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
                )}

                {!isGeneratingPlan && planDocument && pricingAdvice && (
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
                )}
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
