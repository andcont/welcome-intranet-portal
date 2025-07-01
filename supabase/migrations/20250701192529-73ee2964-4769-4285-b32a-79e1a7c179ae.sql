
-- Create HR posts table
CREATE TABLE public.hr_posts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid NOT NULL,
  image_url text
);

-- Enable Row Level Security
ALTER TABLE public.hr_posts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Everyone can view HR posts" 
  ON public.hr_posts 
  FOR SELECT 
  USING (true);

CREATE POLICY "Only admins can manage HR posts" 
  ON public.hr_posts 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );
