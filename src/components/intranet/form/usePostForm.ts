
import { useState } from "react";
import { toast } from "sonner";

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
  
  const getCurrentUser = () => {
    const userStr = localStorage.getItem("andcont_user");
    if (!userStr) return "Administrador";
    
    try {
      const user = JSON.parse(userStr);
      return user.name || "Administrador";
    } catch {
      return "Administrador";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Por favor, informe um título");
      return;
    }
    
    const currentUser = getCurrentUser();
    const now = new Date();
    const id = Date.now().toString();
    
    switch (activeCategory) {
      case "announcements":
        if (!content.trim()) {
          toast.error("Por favor, informe o conteúdo do comunicado");
          return;
        }
        
        // Salvar comunicado
        const announcements = JSON.parse(localStorage.getItem('andcont_announcements') || '[]');
        announcements.push({
          id,
          title,
          content,
          image: image,
          createdAt: now.toISOString(),
          createdBy: currentUser
        });
        localStorage.setItem('andcont_announcements', JSON.stringify(announcements));
        toast.success("Comunicado publicado com sucesso!");
        break;
        
      case "links":
        // Validar URL apenas se for fornecida
        if (url.trim()) {
          try {
            new URL(url);
          } catch {
            toast.error("Por favor, informe uma URL válida");
            return;
          }
        }
        
        // Salvar link
        const links = JSON.parse(localStorage.getItem('andcont_links') || '[]');
        links.push({
          id,
          title,
          url: url.trim(),
          description: content,
          image: image,
          createdAt: now.toISOString(),
          createdBy: currentUser
        });
        localStorage.setItem('andcont_links', JSON.stringify(links));
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
        
        // Salvar evento
        const events = JSON.parse(localStorage.getItem('andcont_events') || '[]');
        events.push({
          id,
          title,
          description: content,
          image: image,
          date: date.toISOString().split('T')[0],
          createdAt: now.toISOString(),
          createdBy: currentUser
        });
        localStorage.setItem('andcont_events', JSON.stringify(events));
        toast.success("Evento adicionado com sucesso!");
        break;

      case "feed":
        if (!content.trim()) {
          toast.error("Por favor, informe o conteúdo do post");
          return;
        }
        
        // Salvar post no feed
        const feed = JSON.parse(localStorage.getItem('andcont_feed') || '[]');
        feed.push({
          id,
          title,
          content,
          image: image,
          createdAt: now.toISOString(),
          createdBy: currentUser
        });
        localStorage.setItem('andcont_feed', JSON.stringify(feed));
        toast.success("Post publicado com sucesso!");
        break;
    }
    
    // Registrar atividade
    const user = JSON.parse(localStorage.getItem('andcont_user') || '{}');
    const activities = JSON.parse(localStorage.getItem('andcont_activities') || '[]');
    activities.push({
      id: Date.now().toString(),
      userId: user.id || 'unknown',
      userName: user.name || 'Administrador',
      userEmail: user.email || 'admin',
      type: `create_${activeCategory === 'feed' ? 'post' : activeCategory.slice(0, -1)}`,
      itemId: id,
      itemTitle: title,
      hasImage: !!image,
      timestamp: now.toISOString()
    });
    localStorage.setItem('andcont_activities', JSON.stringify(activities));
    
    // Fechar formulário
    onClose();
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
    handleSubmit
  };
};

export default usePostForm;
