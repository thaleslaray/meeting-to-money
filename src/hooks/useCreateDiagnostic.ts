import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { DiagnosticInsert } from '@/types/database';

export const useCreateDiagnostic = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (diagnostic: DiagnosticInsert) => {
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('diagnostics')
        .insert({
          ...diagnostic,
          user_id: user.id,
          generated_suggestions: diagnostic.generated_suggestions as any,
        } as any)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diagnostics', user?.id] });
    },
  });
};
