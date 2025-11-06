import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DiagnosticCard } from "@/components/diagnostics/DiagnosticCard";
import { mockDiagnostics } from "@/data/mockData";
import { Plus, TrendingUp, FileText, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
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
                <p className="text-3xl font-bold text-foreground">8</p>
                <p className="text-sm text-success mt-1">+25% vs. semana anterior</p>
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
                <p className="text-3xl font-bold text-foreground">42</p>
                <p className="text-sm text-muted-foreground mt-1">Em 3 diagnósticos</p>
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
                <p className="text-3xl font-bold text-foreground">2min</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockDiagnostics.map((diagnostic) => (
              <DiagnosticCard key={diagnostic.id} {...diagnostic} />
            ))}
          </div>
        </div>

        {/* Empty State (hidden when there are diagnostics) */}
        {mockDiagnostics.length === 0 && (
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
