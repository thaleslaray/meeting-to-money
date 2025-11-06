import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, Zap, Wrench } from "lucide-react";

export interface AutomationSuggestion {
  id: string;
  name: string;
  description: string;
  impact: "low" | "medium" | "high";
  complexity: "easy" | "moderate" | "advanced";
  estimatedDays: number;
  tools: string;
  priorityScore: number;
}

interface AutomationSuggestionCardProps {
  suggestion: AutomationSuggestion;
  selected?: boolean;
  onToggle?: (id: string) => void;
}

export const AutomationSuggestionCard = ({
  suggestion,
  selected = false,
  onToggle,
}: AutomationSuggestionCardProps) => {
  const impactColors = {
    low: "bg-muted text-muted-foreground",
    medium: "bg-accent/20 text-accent",
    high: "bg-success-light text-success",
  };

  const impactLabels = {
    low: "Baixo",
    medium: "Médio",
    high: "Alto",
  };

  const complexityColors = {
    easy: "bg-success-light text-success",
    moderate: "bg-accent/20 text-accent",
    advanced: "bg-muted text-muted-foreground",
  };

  const complexityLabels = {
    easy: "Fácil",
    moderate: "Moderado",
    advanced: "Avançado",
  };

  return (
    <Card
      className={`p-6 transition-all border-2 ${
        selected ? "border-primary shadow-lg" : "border-border hover:border-primary/50"
      }`}
    >
      <div className="flex items-start gap-4">
        {onToggle && (
          <Checkbox
            checked={selected}
            onCheckedChange={() => onToggle(suggestion.id)}
            className="mt-1"
          />
        )}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-semibold text-foreground flex-1 pr-4">{suggestion.name}</h3>
            <div className="flex items-center gap-2 shrink-0">
              <Badge className={impactColors[suggestion.impact]}>
                <Zap className="w-3 h-3 mr-1" />
                {impactLabels[suggestion.impact]}
              </Badge>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-4">{suggestion.description}</p>

          <div className="flex items-center gap-4 flex-wrap">
            <Badge variant="outline" className={complexityColors[suggestion.complexity]}>
              <Wrench className="w-3 h-3 mr-1" />
              {complexityLabels[suggestion.complexity]}
            </Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{suggestion.estimatedDays} dias</span>
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Ferramentas:</span> {suggestion.tools}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
