import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { Sparkles, Zap, Target, FileText, TrendingUp, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-50" />
        <div className="container mx-auto px-4 py-24 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Para alunos da Escola de Automação & I.A.</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Transforme reuniões em
              <span className="text-primary"> propostas vendáveis</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Cole o resumo da reunião consultiva e receba em minutos um diagnóstico estruturado com automações priorizadas, plano de trabalho e orientação de precificação profissional.
            </p>
            
            <div className="flex items-center justify-center gap-4">
              <Button variant="hero" size="lg" asChild>
                <Link to="/dashboard">
                  Começar agora
                  <Sparkles className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/dashboard">Ver exemplo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Como funciona
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Três passos simples para transformar conversa em proposta estruturada
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-8 text-center hover:shadow-xl transition-all">
              <div className="w-14 h-14 rounded-2xl bg-gradient-primary mx-auto mb-6 flex items-center justify-center">
                <FileText className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">1. Cole o Resumo</h3>
              <p className="text-muted-foreground">
                Insira a transcrição ou resumo da reunião com o cliente. Nossa I.A. analisa e identifica problemas, dores e oportunidades.
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-all">
              <div className="w-14 h-14 rounded-2xl bg-gradient-primary mx-auto mb-6 flex items-center justify-center">
                <Target className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">2. Analise Sugestões</h3>
              <p className="text-muted-foreground">
                Receba lista priorizada de automações com impacto, complexidade, tempo estimado e ferramentas sugeridas.
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-all">
              <div className="w-14 h-14 rounded-2xl bg-gradient-primary mx-auto mb-6 flex items-center justify-center">
                <Zap className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">3. Gere Proposta</h3>
              <p className="text-muted-foreground">
                Selecione automações e receba plano de trabalho completo + orientação de precificação baseada em mercado.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Economize horas e feche mais negócios
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Não perca tempo estruturando propostas manualmente. Deixe a I.A. fazer o trabalho pesado enquanto você foca em vender.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-success shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Priorização Inteligente</h4>
                      <p className="text-muted-foreground">Automações ordenadas por impacto vs. complexidade</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-success shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Planos Estruturados</h4>
                      <p className="text-muted-foreground">Etapas claras, prazos realistas e entregáveis definidos</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-success shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Precificação Profissional</h4>
                      <p className="text-muted-foreground">3 metodologias com faixas de mercado para negociar com confiança</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-success shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Histórico Organizado</h4>
                      <p className="text-muted-foreground">Todos os diagnósticos salvos para consulta e reutilização</p>
                    </div>
                  </div>
                </div>
              </div>

              <Card className="p-8 bg-gradient-hero border-primary/20">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Tempo médio de análise</p>
                      <p className="text-3xl font-bold text-foreground">2-3 min</p>
                    </div>
                    <TrendingUp className="w-12 h-12 text-primary" />
                  </div>
                  
                  <div className="h-px bg-border" />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Sugestões por diagnóstico</p>
                      <p className="text-3xl font-bold text-foreground">4-8</p>
                    </div>
                    <Zap className="w-12 h-12 text-accent" />
                  </div>
                  
                  <div className="h-px bg-border" />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Economia de tempo</p>
                      <p className="text-3xl font-bold text-foreground">~2h</p>
                    </div>
                    <Target className="w-12 h-12 text-success" />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            Pronto para profissionalizar suas propostas?
          </h2>
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Comece agora e transforme sua próxima reunião em uma proposta vendável em minutos.
          </p>
          <Button variant="secondary" size="lg" asChild>
            <Link to="/dashboard">
              Acessar plataforma
              <Sparkles className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 AutoDiagnostic. Exclusivo para alunos da Escola de Automação & I.A.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
