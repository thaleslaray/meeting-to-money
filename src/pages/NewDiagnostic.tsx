import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { AutomationSuggestionCard } from "@/components/diagnostics/AutomationSuggestionCard";
import { mockSuggestions, mockInputText, mockPlanDocument, mockPricingAdvice } from "@/data/mockData";
import { Sparkles, Loader2, Copy, CheckCircle2, FileText, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const NewDiagnostic = () => {
  const [inputText, setInputText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([]);
  const { toast } = useToast();

  const handleAnalyze = () => {
    if (!inputText.trim()) {
      toast({
        title: "Atenção",
        description: "Por favor, insira o resumo da reunião antes de analisar.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    // Simulate API call
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
      toast({
        title: "Análise concluída!",
        description: "5 sugestões de automação identificadas e priorizadas.",
      });
    }, 2000);
  };

  const handleToggleSuggestion = (id: string) => {
    setSelectedSuggestions((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
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
                {mockSuggestions
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
                      onClick={() => handleCopy(mockPlanDocument, "Plano de Trabalho")}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar
                    </Button>
                  </div>
                  
                  <div className="prose prose-sm max-w-none">
                    <div className="p-4 rounded-lg bg-muted/50 border border-border font-mono text-xs whitespace-pre-wrap">
                      {mockPlanDocument}
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
                      onClick={() => handleCopy(mockPricingAdvice, "Orientação de Precificação")}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar
                    </Button>
                  </div>
                  
                  <div className="prose prose-sm max-w-none">
                    <div className="p-4 rounded-lg bg-muted/50 border border-border font-mono text-xs whitespace-pre-wrap">
                      {mockPricingAdvice}
                    </div>
                  </div>
                </Card>
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
