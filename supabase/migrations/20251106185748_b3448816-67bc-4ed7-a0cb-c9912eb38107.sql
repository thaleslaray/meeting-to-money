-- Criar tabela de base de conhecimento de automações
CREATE TABLE IF NOT EXISTS public.automation_library (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  sector TEXT NOT NULL,
  impact TEXT NOT NULL CHECK (impact IN ('low', 'medium', 'high')),
  complexity TEXT NOT NULL CHECK (complexity IN ('easy', 'moderate', 'advanced')),
  estimated_days INTEGER NOT NULL,
  tools TEXT NOT NULL,
  keywords TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS policies para automation_library (leitura pública)
ALTER TABLE public.automation_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read automation library"
ON public.automation_library
FOR SELECT
USING (true);

-- Popular base de conhecimento inicial
INSERT INTO public.automation_library (name, description, sector, impact, complexity, estimated_days, tools, keywords) VALUES
  ('Automação de E-mails de Follow-up', 'Sistema automatizado para envio de e-mails de acompanhamento baseado em ações do cliente', 'vendas', 'high', 'moderate', 10, 'Zapier, Gmail API, CRM', ARRAY['email', 'follow-up', 'vendas', 'crm', 'comunicação']),
  ('Dashboard de Métricas em Tempo Real', 'Painel centralizado com KPIs atualizados automaticamente', 'gestao', 'high', 'advanced', 15, 'Power BI, Google Data Studio, APIs', ARRAY['dashboard', 'métricas', 'kpi', 'relatório', 'dados']),
  ('Chatbot de Atendimento', 'Bot inteligente para responder dúvidas frequentes 24/7', 'atendimento', 'high', 'advanced', 20, 'Dialogflow, WhatsApp API, GPT-4', ARRAY['chatbot', 'atendimento', 'suporte', 'whatsapp', 'ia']),
  ('Integração de Sistemas de Pagamento', 'Conexão automática entre plataforma de vendas e gateway de pagamento', 'financeiro', 'high', 'moderate', 12, 'Stripe API, Mercado Pago, Webhooks', ARRAY['pagamento', 'financeiro', 'integração', 'vendas']),
  ('Geração Automática de Relatórios', 'Sistema que gera relatórios periódicos automaticamente', 'gestao', 'medium', 'moderate', 8, 'Python, Excel, Google Sheets API', ARRAY['relatório', 'automação', 'documentos', 'gestão']),
  ('Sistema de Agendamento Online', 'Plataforma para clientes agendarem serviços automaticamente', 'atendimento', 'medium', 'moderate', 10, 'Calendly API, Google Calendar', ARRAY['agendamento', 'calendário', 'reserva', 'horário']),
  ('Automação de Postagens em Redes Sociais', 'Agendamento e publicação automática de conteúdo', 'marketing', 'medium', 'easy', 5, 'Buffer, Hootsuite, APIs sociais', ARRAY['redes sociais', 'marketing', 'conteúdo', 'publicação']),
  ('Sistema de Notificações por SMS/WhatsApp', 'Envio automatizado de alertas e confirmações', 'atendimento', 'medium', 'easy', 7, 'Twilio, WhatsApp Business API', ARRAY['notificação', 'sms', 'whatsapp', 'alerta']),
  ('Automação de Backup de Dados', 'Backup automático e periódico de informações críticas', 'ti', 'high', 'moderate', 8, 'AWS S3, Google Drive API, Scripts', ARRAY['backup', 'segurança', 'dados', 'armazenamento']),
  ('Sistema de Gestão de Estoque Automatizado', 'Controle automático de entrada/saída e alertas de reposição', 'operacoes', 'high', 'advanced', 18, 'ERP, Sensores IoT, APIs', ARRAY['estoque', 'inventário', 'logística', 'reposição']),
  ('Automação de Onboarding de Clientes', 'Fluxo automatizado de boas-vindas e configuração inicial', 'atendimento', 'medium', 'moderate', 9, 'CRM, E-mail Marketing, Zapier', ARRAY['onboarding', 'cliente', 'integração', 'boas-vindas']),
  ('Sistema de Coleta de Feedback Automatizado', 'Envio automático de pesquisas de satisfação', 'atendimento', 'low', 'easy', 5, 'Google Forms, Typeform API', ARRAY['feedback', 'pesquisa', 'satisfação', 'avaliação']),
  ('Automação de Processos de RH', 'Digitalização de processos de recrutamento e onboarding', 'rh', 'medium', 'moderate', 12, 'ATS, Asana, Slack API', ARRAY['rh', 'recrutamento', 'funcionários', 'processo']),
  ('Sistema de Rastreamento de Entregas', 'Acompanhamento automático e notificação de status', 'logistica', 'medium', 'moderate', 10, 'APIs de Correios, Rastreamento GPS', ARRAY['entrega', 'rastreamento', 'logística', 'transporte']),
  ('Automação de Faturamento', 'Geração e envio automático de faturas e cobranças', 'financeiro', 'high', 'moderate', 10, 'QuickBooks, Stripe, E-mail', ARRAY['fatura', 'cobrança', 'financeiro', 'pagamento'])
ON CONFLICT DO NOTHING;