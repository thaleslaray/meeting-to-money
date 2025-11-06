import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DiagnosticCard } from "@/components/diagnostics/DiagnosticCard";
import { useDiagnostics } from "@/hooks/useDiagnostics";
import { Plus, TrendingUp, FileText, Clock, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { data: diagnostics = [], isLoading, error } = useDiagnostics();

  // Calcular métricas reais
  const totalDiagnostics = diagnostics?.length || 0;

  const thisWeekDiagnostics = diagnostics?.filter(d => {
    const createdDate = new Date(d.created_at);
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return createdDate >= weekAgo;
  }).length || 0;

  const totalAutomations = diagnostics?.reduce((sum, d) => 
    sum + (d.generated_suggestions?.length || 0), 0) || 0;

  const avgAnalysisTime = diagnostics?.length > 0
    ? Math.round(diagnostics.reduce((sum, d) => {
        const created = new Date(d.created_at);
        const updated = new Date(d.updated_at);
        return sum + (updated.getTime() - created.getTime());
      }, 0) / diagnostics.length / 1000 / 60)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Acompanhe seus diagnósticos e análises</p>
          </div>
          <Button variant="hero" asChild>
            <Link to="/diagnostico/novo">
              <Plus className="w-5 h-5 mr-2" />
              Novo Diagnóstico
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Diagnósticos esta semana</p>
                <p className="text-3xl font-bold text-foreground">{thisWeekDiagnostics}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {totalDiagnostics > 0 ? `${totalDiagnostics} no total` : 'Nenhum diagnóstico'}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total de sugestões</p>
                <p className="text-3xl font-bold text-foreground">{totalAutomations}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {totalDiagnostics > 0 ? `Em ${totalDiagnostics} diagnóstico${totalDiagnostics !== 1 ? 's' : ''}` : 'Nenhuma sugestão'}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-accent" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Tempo médio de análise</p>
                <p className="text-3xl font-bold text-foreground">
                  {avgAnalysisTime > 0 ? `${avgAnalysisTime}min` : '-'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Por diagnóstico</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-success" />
              </div>
            </div>
          </Card>
        </div>

        {/* Diagnostics List */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">Diagnósticos recentes</h2>
          
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}
          
          {error && (
            <Card className="p-8 text-center">
              <p className="text-destructive">Erro ao carregar diagnósticos. Tente novamente.</p>
            </Card>
          )}
          
          {!isLoading && !error && diagnostics.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {diagnostics.map((diagnostic) => (
                <DiagnosticCard 
                  key={diagnostic.id}
                  id={diagnostic.id}
                  title={diagnostic.title}
                  sector={diagnostic.sector}
                  suggestionsCount={diagnostic.generated_suggestions.length}
                  createdAt={new Date(diagnostic.created_at).toLocaleDateString('pt-BR')}
                  status={diagnostic.status}
                />
              ))}
            </div>
          )}
        </div>

        {/* Empty State */}
        {!isLoading && !error && diagnostics.length === 0 && (
          <Card className="p-12 text-center">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Nenhum diagnóstico ainda
            </h3>
            <p className="text-muted-foreground mb-6">
              Crie seu primeiro diagnóstico para começar a transformar reuniões em propostas vendáveis.
            </p>
            <Button variant="hero" asChild>
              <Link to="/diagnostico/novo">
                <Plus className="w-5 h-5 mr-2" />
                Criar primeiro diagnóstico
              </Link>
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
