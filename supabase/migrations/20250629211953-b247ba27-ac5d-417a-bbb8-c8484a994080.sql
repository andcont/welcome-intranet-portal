
-- Adicionar coluna parent_comment_id à tabela comments para suportar respostas
ALTER TABLE public.comments 
ADD COLUMN parent_comment_id uuid REFERENCES public.comments(id) ON DELETE CASCADE;

-- Criar índice para melhor performance na busca de respostas
CREATE INDEX idx_comments_parent_id ON public.comments(parent_comment_id);
