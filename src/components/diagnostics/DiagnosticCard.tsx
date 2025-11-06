import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronRight, FileText } from "lucide-react";
import { Link } from "react-router-dom";

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

      <Button variant="outline" className="w-full" asChild>
        <Link to={`/diagnostico/${id}`}>
          Ver detalhes
          <ChevronRight className="ml-auto w-4 h-4" />
        </Link>
      </Button>
    </Card>
  );
};
