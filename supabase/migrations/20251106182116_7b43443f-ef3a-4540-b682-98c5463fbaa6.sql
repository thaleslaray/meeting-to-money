-- Criar tabela para controle de uso mensal
CREATE TABLE public.usage_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  month_year TEXT NOT NULL,
  diagnostics_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, month_year)
);

-- Habilitar RLS
ALTER TABLE public.usage_limits ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Users can view their own usage"
ON public.usage_limits FOR SELECT
TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage"
ON public.usage_limits FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own usage"
ON public.usage_limits FOR UPDATE
TO authenticated USING (auth.uid() = user_id);

-- Índice para performance
CREATE INDEX idx_usage_limits_user_month ON public.usage_limits(user_id, month_year);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_usage_limits_updated_at
BEFORE UPDATE ON public.usage_limits
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Função para verificar e incrementar uso
CREATE OR REPLACE FUNCTION public.check_and_increment_usage(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_month_year TEXT;
  v_current_count INTEGER;
  v_limit INTEGER := 30;
BEGIN
  v_month_year := to_char(now(), 'YYYY-MM');
  
  -- Buscar ou criar registro do mês
  INSERT INTO public.usage_limits (user_id, month_year, diagnostics_count)
  VALUES (p_user_id, v_month_year, 0)
  ON CONFLICT (user_id, month_year) DO NOTHING;
  
  -- Buscar contagem atual
  SELECT diagnostics_count INTO v_current_count
  FROM public.usage_limits
  WHERE user_id = p_user_id AND month_year = v_month_year;
  
  -- Verificar limite
  IF v_current_count >= v_limit THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'current', v_current_count,
      'limit', v_limit,
      'message', 'Limite mensal de diagnósticos atingido'
    );
  END IF;
  
  -- Incrementar contador
  UPDATE public.usage_limits
  SET diagnostics_count = diagnostics_count + 1,
      updated_at = now()
  WHERE user_id = p_user_id AND month_year = v_month_year;
  
  RETURN jsonb_build_object(
    'allowed', true,
    'current', v_current_count + 1,
    'limit', v_limit
  );
END;
$$;