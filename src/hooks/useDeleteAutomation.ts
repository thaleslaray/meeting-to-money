import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useDeleteAutomation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('automation_library')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automations'] });
      toast({
        title: "Automação excluída!",
        description: "A automação foi removida do banco.",
      });
    },
    onError: (error) => {
      console.error('Error deleting automation:', error);
      toast({
        title: "Erro ao excluir automação",
        description: "Não foi possível remover a automação. Tente novamente.",
        variant: "destructive",
      });
    },
  });
};
