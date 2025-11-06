import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Diagnostic } from '@/types/database';

export interface DiagnosticsFilters {
  sector?: string;
  status?: 'pending' | 'in_progress' | 'completed';
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
}

export const useDiagnostics = (filters?: DiagnosticsFilters) => {
  const { user } = useAuth();
  const page = filters?.page || 1;
  const pageSize = filters?.pageSize || 12;

  return useQuery({
    queryKey: ['diagnostics', user?.id, filters],
    queryFn: async () => {
      if (!user) return { data: [], count: 0 };

      let query = supabase
        .from('diagnostics')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      // Aplicar filtros
      if (filters?.sector) {
        query = query.eq('sector', filters.sector);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }
      if (filters?.dateTo) {
        query = query.lte('created_at', filters.dateTo);
      }

      // Aplicar paginação
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;
      return { 
        data: (data as unknown as Diagnostic[]) || [], 
        count: count || 0 
      };
    },
    enabled: !!user,
  });
};