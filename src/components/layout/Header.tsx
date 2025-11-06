import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, LogOut, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUsageLimit } from "@/hooks/useUsageLimit";
import { useIsAdmin } from "@/hooks/useIsAdmin";

export const Header = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const isLanding = location.pathname === "/";
  const { data: usageLimit } = useUsageLimit();
  const { isAdmin } = useIsAdmin();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl text-foreground">AutoDiagnostic</span>
        </Link>
        
        <nav className="flex items-center gap-4">
          {user ? (
            <>
              {usageLimit && (
                <Badge 
                  variant="outline" 
                  className={
                    usageLimit.current >= usageLimit.limit * 0.8
                      ? "bg-warning-light text-warning border-warning"
                      : "bg-muted text-muted-foreground border-border"
                  }
                >
                  {usageLimit.current}/{usageLimit.limit} diagnósticos este mês
                </Badge>
              )}
              <Button variant="ghost" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              {isAdmin && (
                <Button variant="ghost" asChild>
                  <Link to="/admin/prompts">
                    <Settings className="w-4 h-4 mr-2" />
                    Prompts
                  </Link>
                </Button>
              )}
              <Button variant="ghost" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </>
          ) : !isLanding && (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login">Entrar</Link>
              </Button>
              <Button variant="hero" asChild>
                <Link to="/signup">Criar Conta</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
