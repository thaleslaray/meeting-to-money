import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AutomationSuggestionCard } from "@/components/diagnostics/AutomationSuggestionCard";
import { QualityBadge } from "@/components/diagnostics/QualityBadge";
import { ArrowLeft, Copy, FileText, DollarSign, Calendar, AlertCircle, Trash2 } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useDiagnostic } from "@/hooks/useDiagnostic";
import { useDeleteDiagnostic } from "@/hooks/useDeleteDiagnostic";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const DiagnosticDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { data: diagnostic, isLoading, error } = useDiagnostic(id);
  const deleteDiagnostic = useDeleteDiagnostic();

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: `${label} copiado para a área de transferência.`,
    });
  };

  const handleDelete = async () => {
    if (!id) return;
    
    setIsDeleting(true);
    try {
      await deleteDiagnostic.mutateAsync(id);
      toast({
        title: "Diagnóstico excluído",
        description: "O diagnóstico foi removido com sucesso.",
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Erro ao excluir diagnóstico:", error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o diagnóstico. Tente novamente.",
        variant: "destructive",
      });
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Loading State */}
      {isLoading && (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Dashboard
            </Link>
          </Button>
          
          <div className="space-y-6">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Dashboard
            </Link>
          </Button>
          
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Erro ao carregar diagnóstico. Por favor, tente novamente.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Not Found State */}
      {!isLoading && !error && !diagnostic && (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Dashboard
            </Link>
          </Button>
          
          <Card className="p-12 text-center">
            <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Diagnóstico não encontrado
            </h3>
            <p className="text-muted-foreground mb-4">
              O diagnóstico que você está procurando não existe ou foi excluído.
            </p>
            <Button asChild>
              <Link to="/dashboard">Voltar ao Dashboard</Link>
            </Button>
          </Card>
        </div>
      )}

      {/* Success State */}
      {!isLoading && !error && diagnostic && (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <Button variant="ghost" asChild className="mb-4">
              <Link to="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Dashboard
              </Link>
            </Button>
            
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {diagnostic.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Criado em {format(new Date(diagnostic.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </span>
                  </div>
                  <Badge className="bg-muted text-muted-foreground">{diagnostic.sector}</Badge>
                  <Badge className={
                    diagnostic.status === 'completed' 
                      ? "bg-success-light text-success" 
                      : diagnostic.status === 'in_progress'
                      ? "bg-warning-light text-warning"
                      : "bg-muted text-muted-foreground"
                  }>
                    {diagnostic.status === 'completed' ? 'Concluído' 
                      : diagnostic.status === 'in_progress' ? 'Em Progresso' 
                      : 'Pendente'}
                  </Badge>
                  {diagnostic.quality_score && (
                    <QualityBadge score={diagnostic.quality_score} />
                  )}
                </div>
              </div>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" disabled={isDeleting}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja excluir este diagnóstico? Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
                {diagnostic.input_text}
              </pre>
            </div>
          </Card>

          {/* Suggestions */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Sugestões de Automação ({diagnostic.generated_suggestions.length})
            </h2>
            <div className="space-y-4">
              {diagnostic.generated_suggestions
                .sort((a, b) => b.priorityScore - a.priorityScore)
                .map((suggestion) => (
                  <AutomationSuggestionCard
                    key={suggestion.id}
                    suggestion={suggestion}
                    selected={diagnostic.selected_automations?.includes(suggestion.id)}
                  />
                ))}
            </div>
          </div>

          {/* Plan Document */}
          {diagnostic.plan_document && (
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
                  onClick={() => handleCopy(diagnostic.plan_document || '', "Plano de Trabalho")}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar
                </Button>
              </div>
              
              <div className="prose prose-sm max-w-none">
                <div className="p-4 rounded-lg bg-muted/50 border border-border font-mono text-xs whitespace-pre-wrap">
                  {diagnostic.plan_document}
                </div>
              </div>
            </Card>
          )}

          {/* Pricing Advice */}
          {diagnostic.pricing_advice && (
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
                  onClick={() => handleCopy(diagnostic.pricing_advice || '', "Orientação de Precificação")}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar
                </Button>
              </div>
              
              <div className="prose prose-sm max-w-none">
                <div className="p-4 rounded-lg bg-muted/50 border border-border font-mono text-xs whitespace-pre-wrap">
                  {diagnostic.pricing_advice}
                </div>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default DiagnosticDetail;
