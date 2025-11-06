import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Automation {
  id: string;
  name: string;
  description: string;
  sector: string;
  impact: 'low' | 'medium' | 'high';
  complexity: 'easy' | 'moderate' | 'advanced';
  estimated_days: number;
  tools: string;
  keywords: string[];
  created_at: string;
}

export const useAutomations = () => {
  return useQuery({
    queryKey: ['automations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('automation_library')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Automation[];
    },
  });
};
