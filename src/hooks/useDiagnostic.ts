import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Diagnostic } from '@/types/database';

export const useDiagnostic = (id: string | undefined) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['diagnostic', id],
    queryFn: async () => {
      if (!user || !id) return null;

      const { data, error } = await supabase
        .from('diagnostics')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data as unknown as Diagnostic | null;
    },
    enabled: !!user && !!id,
  });
};
