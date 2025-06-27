
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface UsePostFormProps {
  activeCategory: string;
  onClose: () => void;
}

export const usePostForm = ({ activeCategory, onClose }: UsePostFormProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Usuário não autenticado");
      return;
    }
    
    if (!title.trim()) {
      toast.error("Por favor, informe um título");
      return;
    }
    
    setLoading(true);
    
    try {
      switch (activeCategory) {
        case "announcements":
          if (!content.trim()) {
            toast.error("Por favor, informe o conteúdo do comunicado");
            return;
          }
          
          const { error: announcementError } = await supabase
            .from('announcements')
            .insert({
              title,
              content,
              image_url: image,
              created_by: user.id
            });

          if (announcementError) {
            console.error('Error creating announcement:', announcementError);
            toast.error("Erro ao criar comunicado");
            return;
          }
          
          toast.success("Comunicado publicado com sucesso!");
          break;
          
        case "links":
          if (url.trim()) {
            try {
              new URL(url);
            } catch {
              toast.error("Por favor, informe uma URL válida");
              return;
            }
          }
          
          const { error: linkError } = await supabase
            .from('useful_links')
            .insert({
              title,
              url: url.trim(),
              content: content,
              image_url: image,
              created_by: user.id
            });

          if (linkError) {
            console.error('Error creating link:', linkError);
            toast.error("Erro ao criar link");
            return;
          }
          
          toast.success("Link adicionado com sucesso!");
          break;
          
        case "calendar":
          if (!date) {
            toast.error("Por favor, selecione uma data para o evento");
            return;
          }
          
          if (!content.trim()) {
            toast.error("Por favor, informe uma descrição para o evento");
            return;
          }
          
          const { error: eventError } = await supabase
            .from('events')
            .insert({
              title,
              content,
              event_date: date.toISOString(),
              image_url: image,
              created_by: user.id
            });

          if (eventError) {
            console.error('Error creating event:', eventError);
            toast.error("Erro ao criar evento");
            return;
          }
          
          toast.success("Evento adicionado com sucesso!");
          break;

        case "feed":
          if (!content.trim()) {
            toast.error("Por favor, informe o conteúdo do post");
            return;
          }
          
          const { error: feedError } = await supabase
            .from('feed_posts')
            .insert({
              title,
              content,
              image_url: image,
              created_by: user.id
            });

          if (feedError) {
            console.error('Error creating feed post:', feedError);
            toast.error("Erro ao criar post");
            return;
          }
          
          toast.success("Post publicado com sucesso!");
          break;
      }
      
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("Erro ao salvar");
    } finally {
      setLoading(false);
    }
  };

  return {
    title,
    setTitle,
    content,
    setContent,
    url,
    setUrl,
    date,
    setDate,
    image,
    setImage,
    handleSubmit,
    loading
  };
};

export default usePostForm;
