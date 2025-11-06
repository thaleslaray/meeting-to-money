import { Badge } from "@/components/ui/badge";

interface QualityBadgeProps {
  score: number;
}

export const QualityBadge = ({ score }: QualityBadgeProps) => {
  const getVariant = () => {
    if (score >= 90) return "default";
    if (score >= 70) return "secondary";
    if (score >= 50) return "outline";
    return "destructive";
  };
  
  const getLabel = () => {
    if (score >= 90) return "Excelente";
    if (score >= 70) return "Boa";
    if (score >= 50) return "Aceitável";
    return "⚠️ Revisar";
  };
  
  return (
    <Badge variant={getVariant()}>
      {getLabel()} ({score}/100)
    </Badge>
  );
};
