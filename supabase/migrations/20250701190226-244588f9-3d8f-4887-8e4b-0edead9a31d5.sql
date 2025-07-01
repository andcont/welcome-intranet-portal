
-- Adicionar campo birthday na tabela profiles
ALTER TABLE public.profiles ADD COLUMN birthday DATE;

-- Criar política para que apenas admins possam editar aniversários
CREATE POLICY "Only admins can update profile birthdays" 
ON public.profiles 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
  OR auth.uid() = id
);
