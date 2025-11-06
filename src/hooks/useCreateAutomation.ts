import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface CreateAutomationData {
  name: string;
  description: string;
  sector: string;
  impact: 'low' | 'medium' | 'high';
  complexity: 'easy' | 'moderate' | 'advanced';
  estimated_days: number;
  tools: string;
  keywords: string[];
}

export const useCreateAutomation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAutomationData) => {
      const { error } = await supabase
        .from('automation_library')
        .insert([data]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automations'] });
      toast({
        title: "Automação criada!",
        description: "A automação foi adicionada ao banco com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Error creating automation:', error);
      toast({
        title: "Erro ao criar automação",
        description: "Não foi possível adicionar a automação. Tente novamente.",
        variant: "destructive",
      });
    },
  });
};
