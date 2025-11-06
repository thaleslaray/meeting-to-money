import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UsageLimit {
  current: number;
  limit: number;
  allowed: boolean;
  message?: string;
}

export const useUsageLimit = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['usage-limit', user?.id],
    queryFn: async (): Promise<UsageLimit> => {
      if (!user) return { current: 0, limit: 30, allowed: false };

      const monthYear = new Date().toISOString().slice(0, 7); // "YYYY-MM"

      const { data, error } = await supabase
        .from('usage_limits')
        .select('diagnostics_count')
        .eq('user_id', user.id)
        .eq('month_year', monthYear)
        .maybeSingle();

      if (error) throw error;

      const current = data?.diagnostics_count || 0;
      const limit = 30;

      return {
        current,
        limit,
        allowed: current < limit,
        message: current >= limit ? 'Limite mensal de diagnósticos atingido' : undefined,
      };
    },
    enabled: !!user,
  });
};

export const checkAndIncrementUsage = async (userId: string): Promise<UsageLimit> => {
  const { data, error } = await supabase.rpc('check_and_increment_usage', {
    p_user_id: userId,
  });

  if (error) throw error;

  return data as unknown as UsageLimit;
};
