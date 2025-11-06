import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { DiagnosticUpdate } from '@/types/database';

export const useUpdateDiagnostic = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: DiagnosticUpdate }) => {
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('diagnostics')
        .update({
          ...updates,
          generated_suggestions: updates.generated_suggestions as any,
        } as any)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['diagnostics', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['diagnostic', data.id] });
    },
  });
};
