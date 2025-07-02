-- Add about_me field to profiles table
ALTER TABLE public.profiles 
ADD COLUMN about_me TEXT;

-- Add index for better performance
CREATE INDEX idx_profiles_about_me ON public.profiles(id) WHERE about_me IS NOT NULL;