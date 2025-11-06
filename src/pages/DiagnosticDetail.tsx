import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AutomationSuggestionCard } from "@/components/diagnostics/AutomationSuggestionCard";
import { mockSuggestions, mockInputText, mockPlanDocument, mockPricingAdvice } from "@/data/mockData";
import { ArrowLeft, Copy, FileText, DollarSign, Calendar } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const DiagnosticDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: `${label} copiado para a área de transferência.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Dashboard
            </Link>
          </Button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Análise Imobiliária Premium
              </h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Criado em 05/11/2025</span>
                </div>
                <Badge className="bg-muted text-muted-foreground">Imobiliária</Badge>
                <Badge className="bg-success-light text-success">Concluído</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Original Input */}
        <Card className="p-6 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Resumo Original da Reunião
          </h2>
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <pre className="font-mono text-sm whitespace-pre-wrap text-foreground">
              {mockInputText}
            </pre>
          </div>
        </Card>

        {/* Suggestions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Sugestões de Automação (5)
          </h2>
          <div className="space-y-4">
            {mockSuggestions
              .sort((a, b) => b.priorityScore - a.priorityScore)
              .map((suggestion) => (
                <AutomationSuggestionCard
                  key={suggestion.id}
                  suggestion={suggestion}
                />
              ))}
          </div>
        </div>

        {/* Plan Document */}
        <Card className="p-6 mb-8">
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
                  Gerado para as automações selecionadas
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

        {/* Pricing Advice */}
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
      </div>
    </div>
  );
};

export default DiagnosticDetail;
