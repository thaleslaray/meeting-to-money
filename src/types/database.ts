export interface AutomationSuggestion {
  id: string;
  name: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  complexity: 'easy' | 'moderate' | 'advanced';
  estimatedDays: number;
  tools: string;
  priorityScore: number;
}

export interface Diagnostic {
  id: string;
  user_id: string;
  title: string;
  sector: string;
  input_text: string;
  generated_suggestions: AutomationSuggestion[];
  selected_automations: string[];
  plan_document: string | null;
  pricing_advice: string | null;
  quality_score: number | null;
  status: 'pending' | 'in_progress' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface DiagnosticInsert {
  title: string;
  sector: string;
  input_text: string;
  generated_suggestions: AutomationSuggestion[];
  selected_automations?: string[];
  plan_document?: string;
  pricing_advice?: string;
  status?: 'pending' | 'in_progress' | 'completed';
}

export interface DiagnosticUpdate {
  title?: string;
  sector?: string;
  input_text?: string;
  generated_suggestions?: AutomationSuggestion[];
  selected_automations?: string[];
  plan_document?: string;
  pricing_advice?: string;
  quality_score?: number;
  status?: 'pending' | 'in_progress' | 'completed';
}
