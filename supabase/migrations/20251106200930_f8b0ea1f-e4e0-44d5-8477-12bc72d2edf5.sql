-- Criar enum para roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Criar tabela de roles
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (user_id, role)
);

-- Habilitar RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Função security definer para verificar role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS: apenas admins podem ver roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Função para atribuir role de admin ao thales@laray.com.br
CREATE OR REPLACE FUNCTION public.assign_admin_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email = 'thales@laray.com.br' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger ao criar novo usuário no profiles
CREATE TRIGGER assign_admin_on_profile_creation
AFTER INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.assign_admin_role();

-- Criar tabela de templates de prompts
CREATE TABLE public.prompt_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    content TEXT NOT NULL,
    default_content TEXT NOT NULL,
    updated_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.prompt_templates ENABLE ROW LEVEL SECURITY;

-- RLS: todos podem ler (edge functions precisam)
CREATE POLICY "Anyone can view prompts"
ON public.prompt_templates FOR SELECT
USING (true);

-- RLS: apenas admins podem editar
CREATE POLICY "Admins can update prompts"
ON public.prompt_templates FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Inserir prompts padrão
INSERT INTO public.prompt_templates (key, name, description, content, default_content)
VALUES 
(
  'analyze_diagnostic_system',
  'Prompt de Análise de Diagnóstico (System)',
  'Prompt do sistema para a edge function analyze-diagnostic',
  'Você é um especialista em automação de processos de negócios. 
Analise o texto da reunião e identifique EXATAMENTE 5 oportunidades de automação viáveis.
Considere a base de conhecimento de automações disponíveis e sugira soluções práticas.

Para cada automação, retorne:
- name: nome claro e objetivo
- description: descrição detalhada (2-3 frases)
- impact: low, medium ou high
- complexity: easy, moderate ou advanced
- estimatedDays: prazo realista em dias
- tools: ferramentas específicas recomendadas
- priorityScore: número de 1 a 100 (quanto maior, mais prioritário)',
  'Você é um especialista em automação de processos de negócios. 
Analise o texto da reunião e identifique EXATAMENTE 5 oportunidades de automação viáveis.
Considere a base de conhecimento de automações disponíveis e sugira soluções práticas.

Para cada automação, retorne:
- name: nome claro e objetivo
- description: descrição detalhada (2-3 frases)
- impact: low, medium ou high
- complexity: easy, moderate ou advanced
- estimatedDays: prazo realista em dias
- tools: ferramentas específicas recomendadas
- priorityScore: número de 1 a 100 (quanto maior, mais prioritário)'
),
(
  'generate_plan_system',
  'Prompt de Geração de Plano (System)',
  'Prompt do sistema para a edge function generate-work-plan (plano)',
  'Você é um gerente de projetos especializado em automação empresarial. Crie planos detalhados, realistas e profissionais.',
  'Você é um gerente de projetos especializado em automação empresarial. Crie planos detalhados, realistas e profissionais.'
),
(
  'generate_pricing_system',
  'Prompt de Geração de Precificação (System)',
  'Prompt do sistema para a edge function generate-work-plan (precificação)',
  'Você é um consultor de precificação especializado em projetos de automação. Calcule valores realistas entre R$ 1.000 e R$ 100.000, usando as 3 metodologias solicitadas.',
  'Você é um consultor de precificação especializado em projetos de automação. Calcule valores realistas entre R$ 1.000 e R$ 100.000, usando as 3 metodologias solicitadas.'
);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_prompt_templates_updated_at
BEFORE UPDATE ON public.prompt_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();