
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { X, Upload, Image as ImageIcon } from "lucide-react";
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
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      
      reader.readAsDataURL(file);
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
          image: image, // Adicionamos o campo de imagem aqui
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
          url: url.trim(), // URL é agora opcional
          description: content,
          image: image, // Adicionamos o campo de imagem aqui
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
          image: image, // Adicionamos o campo de imagem aqui
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
      hasImage: !!image,
      timestamp: now.toISOString()
    });
    localStorage.setItem('andcont_activities', JSON.stringify(activities));
    
    // Fechar formulário
    onClose();
  };

  const removeImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-black/40 backdrop-blur-xl rounded-lg p-6 border border-white/20">
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
            className="bg-black/30 border-white/20 text-white placeholder:text-white/50"
          />
        </div>
        
        {activeCategory === 'links' && (
          <div>
            <Label htmlFor="url" className="text-white">URL (opcional)</Label>
            <Input 
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://exemplo.com"
              className="bg-black/30 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
        )}
        
        {activeCategory === 'calendar' && (
          <div>
            <Label htmlFor="date" className="text-white block mb-2">Data</Label>
            <div className="bg-black/30 rounded-md p-3 border border-white/20">
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
            className="bg-black/30 border-white/20 text-white placeholder:text-white/50"
          />
        </div>

        {/* Campo para upload de imagem */}
        <div>
          <Label htmlFor="image" className="text-white block mb-2">Imagem (opcional)</Label>
          
          {image ? (
            <div className="relative mb-4 border border-white/20 rounded-md overflow-hidden">
              <img 
                src={image} 
                alt="Preview" 
                className="w-full h-auto max-h-48 object-contain"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 bg-black/50"
                onClick={removeImage}
              >
                <X size={16} />
              </Button>
            </div>
          ) : (
            <div className="border border-dashed border-white/30 rounded-md p-6 text-center bg-black/10">
              <input 
                ref={fileInputRef}
                type="file" 
                id="image" 
                accept="image/*" 
                onChange={handleImageChange}
                className="hidden" 
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="bg-black/20 border-white/20 hover:bg-black/30 text-white"
              >
                <ImageIcon size={16} className="mr-2" />
                Selecionar Imagem
              </Button>
            </div>
          )}
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
