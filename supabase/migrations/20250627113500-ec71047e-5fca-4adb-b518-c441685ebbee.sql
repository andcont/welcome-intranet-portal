
-- Remover todas as políticas existentes para recriar corretamente
DROP POLICY IF EXISTS "Everyone can view announcements" ON public.announcements;
DROP POLICY IF EXISTS "Only admins can manage announcements" ON public.announcements;
DROP POLICY IF EXISTS "Everyone can view links" ON public.useful_links;
DROP POLICY IF EXISTS "Only admins can manage links" ON public.useful_links;
DROP POLICY IF EXISTS "Everyone can view events" ON public.events;
DROP POLICY IF EXISTS "Only admins can manage events" ON public.events;
DROP POLICY IF EXISTS "Everyone can view feed posts" ON public.feed_posts;
DROP POLICY IF EXISTS "Users can create their own posts" ON public.feed_posts;
DROP POLICY IF EXISTS "Users can update their own posts" ON public.feed_posts;
DROP POLICY IF EXISTS "Users can delete their own posts or admins can delete any" ON public.feed_posts;
DROP POLICY IF EXISTS "Everyone can view comments" ON public.comments;
DROP POLICY IF EXISTS "Authenticated users can create comments" ON public.comments;
DROP POLICY IF EXISTS "Users can delete their own comments or admins can delete any" ON public.comments;
DROP POLICY IF EXISTS "Everyone can view reactions" ON public.reactions;
DROP POLICY IF EXISTS "Authenticated users can manage their own reactions" ON public.reactions;
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Recriar todas as políticas corretamente
CREATE POLICY "Everyone can view announcements" ON public.announcements FOR SELECT USING (true);
CREATE POLICY "Only admins can manage announcements" ON public.announcements FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

CREATE POLICY "Everyone can view links" ON public.useful_links FOR SELECT USING (true);
CREATE POLICY "Only admins can manage links" ON public.useful_links FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

CREATE POLICY "Everyone can view events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Only admins can manage events" ON public.events FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

CREATE POLICY "Everyone can view feed posts" ON public.feed_posts FOR SELECT USING (true);
CREATE POLICY "Users can create their own posts" ON public.feed_posts FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update their own posts" ON public.feed_posts FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete their own posts or admins can delete any" ON public.feed_posts FOR DELETE USING (
  auth.uid() = created_by OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

CREATE POLICY "Everyone can view comments" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create comments" ON public.comments FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can delete their own comments or admins can delete any" ON public.comments FOR DELETE USING (
  auth.uid() = created_by OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

CREATE POLICY "Everyone can view reactions" ON public.reactions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage their own reactions" ON public.reactions FOR ALL USING (auth.uid() = created_by);

CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
