import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Calendar, ChevronRight, FileText, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useDeleteDiagnostic } from "@/hooks/useDeleteDiagnostic";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export interface DiagnosticCardProps {
  id: string;
  title: string;
  sector: string;
  suggestionsCount: number;
  createdAt: string;
  status: "pending" | "completed" | "in_progress";
}

export const DiagnosticCard = ({
  id,
  title,
  sector,
  suggestionsCount,
  createdAt,
  status,
}: DiagnosticCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteDiagnostic = useDeleteDiagnostic();
  const { toast } = useToast();

  const statusColors = {
    pending: "bg-muted text-muted-foreground",
    in_progress: "bg-accent/20 text-accent",
    completed: "bg-success-light text-success",
  };

  const statusLabels = {
    pending: "Pendente",
    in_progress: "Em análise",
    completed: "Concluído",
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteDiagnostic.mutateAsync(id);
      toast({
        title: "Diagnóstico excluído",
        description: "O diagnóstico foi removido com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao excluir diagnóstico:", error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o diagnóstico. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-all border-border">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground mb-1 truncate">{title}</h3>
            <p className="text-sm text-muted-foreground">{sector}</p>
          </div>
        </div>
        <Badge className={statusColors[status]}>{statusLabels[status]}</Badge>
      </div>

      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>{createdAt}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-medium text-foreground">{suggestionsCount}</span>
          <span>sugestões</span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" asChild>
          <Link to={`/diagnostico/${id}`}>
            Ver detalhes
            <ChevronRight className="ml-auto w-4 h-4" />
          </Link>
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="icon" disabled={isDeleting}>
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir o diagnóstico "{title}"? Esta ação não pode ser desfeita.
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
    </Card>
  );
};
