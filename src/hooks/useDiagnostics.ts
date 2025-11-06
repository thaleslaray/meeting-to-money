import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Diagnostic } from '@/types/database';

export const useDiagnostics = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['diagnostics', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('diagnostics')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as unknown as Diagnostic[];
    },
    enabled: !!user,
  });
};
