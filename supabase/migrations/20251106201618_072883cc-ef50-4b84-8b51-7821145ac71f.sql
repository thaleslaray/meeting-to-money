-- Inserir role de admin para thales@laray.com.br
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM public.profiles
WHERE email = 'thales@laray.com.br'
ON CONFLICT (user_id, role) DO NOTHING;

-- Função auxiliar para atribuir admin manualmente (caso necessário no futuro)
CREATE OR REPLACE FUNCTION public.assign_admin_to_user(_email TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id UUID;
BEGIN
  SELECT id INTO _user_id FROM public.profiles WHERE email = _email;
  
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'Usuário com email % não encontrado', _email;
  END IF;
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RAISE NOTICE 'Role de admin atribuída para %', _email;
END;
$$;