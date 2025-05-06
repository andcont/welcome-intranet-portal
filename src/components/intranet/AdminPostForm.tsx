
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { X } from "lucide-react";
import { toast } from "sonner";

interface AdminPostFormProps {
  onClose: () => void;
  activeCategory: string;
}

const AdminPostForm = ({ onClose, activeCategory }: AdminPostFormProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  
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
          createdAt: now.toISOString(),
          createdBy: currentUser
        });
        localStorage.setItem('andcont_announcements', JSON.stringify(announcements));
        toast.success("Comunicado publicado com sucesso!");
        break;
        
      case "links":
        if (!url.trim()) {
          toast.error("Por favor, informe a URL do link");
          return;
        }
        
        // Validar URL
        try {
          new URL(url);
        } catch {
          toast.error("Por favor, informe uma URL válida");
          return;
        }
        
        // Salvar link
        const links = JSON.parse(localStorage.getItem('andcont_links') || '[]');
        links.push({
          id,
          title,
          url,
          description: content,
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
          date: date.toISOString().split('T')[0],
          createdAt: now.toISOString(),
          createdBy: currentUser
        });
        localStorage.setItem('andcont_events', JSON.stringify(events));
        toast.success("Evento adicionado com sucesso!");
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
      type: `create_${activeCategory.slice(0, -1)}`,
      itemId: id,
      itemTitle: title,
      timestamp: now.toISOString()
    });
    localStorage.setItem('andcont_activities', JSON.stringify(activities));
    
    // Fechar formulário
    onClose();
  };

  return (
    <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-white/20">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">
          {activeCategory === 'announcements' && 'Novo Comunicado'}
          {activeCategory === 'links' && 'Novo Link'}
          {activeCategory === 'calendar' && 'Novo Evento'}
        </h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClose}
          className="text-white/70 hover:text-white hover:bg-white/10"
        >
          <X size={18} />
        </Button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title" className="text-white">Título</Label>
          <Input 
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Informe o título"
            className="bg-black/20 border-white/20 text-white placeholder:text-white/50"
          />
        </div>
        
        {activeCategory === 'links' && (
          <div>
            <Label htmlFor="url" className="text-white">URL</Label>
            <Input 
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://exemplo.com"
              className="bg-black/20 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
        )}
        
        {activeCategory === 'calendar' && (
          <div>
            <Label htmlFor="date" className="text-white block mb-2">Data</Label>
            <div className="bg-black/20 rounded-md p-3 border border-white/20">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="bg-transparent text-white mx-auto"
              />
            </div>
          </div>
        )}
        
        <div>
          <Label htmlFor="content" className="text-white">
            {activeCategory === 'announcements' ? 'Conteúdo' : 
             activeCategory === 'links' ? 'Descrição' : 'Descrição do evento'}
          </Label>
          <Textarea 
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Informe o conteúdo"
            rows={5}
            className="bg-black/20 border-white/20 text-white placeholder:text-white/50"
          />
        </div>
        
        <div className="flex justify-end gap-4 pt-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            className="bg-white/10 hover:bg-white/20 text-white border-white/30"
          >
            Cancelar
          </Button>
          <Button 
            type="submit"
            className="bg-gradient-andcont hover:opacity-90 transition-opacity"
          >
            Publicar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminPostForm;
