
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface UserPostFormProps {
  onClose: () => void;
}

const UserPostForm = ({ onClose }: UserPostFormProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Por favor, informe um título");
      return;
    }
    
    if (!content.trim()) {
      toast.error("Por favor, informe o conteúdo da publicação");
      return;
    }
    
    const user = JSON.parse(localStorage.getItem('andcont_user') || '{}');
    const now = new Date();
    const id = Date.now().toString();
    
    // Salvar post no feed
    const feed = JSON.parse(localStorage.getItem('andcont_feed') || '[]');
    feed.push({
      id,
      title,
      content,
      image,
      createdAt: now.toISOString(),
      createdBy: user.name || "Usuário"
    });
    localStorage.setItem('andcont_feed', JSON.stringify(feed));
    
    // Registrar atividade
    const activities = JSON.parse(localStorage.getItem('andcont_activities') || '[]');
    activities.push({
      id: Date.now().toString(),
      userId: user.id || 'unknown',
      userName: user.name || 'Usuário',
      userEmail: user.email || '',
      type: 'create_post',
      itemId: id,
      itemTitle: title,
      hasImage: !!image,
      timestamp: now.toISOString()
    });
    localStorage.setItem('andcont_activities', JSON.stringify(activities));
    
    toast.success("Publicação realizada com sucesso!");
    onClose();
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
  
  const removeImage = () => {
    setImage(null);
  };
  
  return (
    <div className="bg-white/40 backdrop-blur-xl rounded-lg p-6 border border-white/30">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Nova Publicação</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClose}
          className="text-gray-600 hover:text-gray-800 hover:bg-white/30"
        >
          <X size={18} />
        </Button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title" className="text-gray-800">Título</Label>
          <Input 
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Informe o título"
            className="bg-white/50 border-white/30 text-gray-800 placeholder:text-gray-500"
          />
        </div>
        
        <div>
          <Label htmlFor="content" className="text-gray-800">Conteúdo</Label>
          <Textarea 
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="O que você está pensando?"
            rows={5}
            className="bg-white/50 border-white/30 text-gray-800 placeholder:text-gray-500 resize-none"
          />
        </div>
        
        <div>
          <Label className="text-gray-800 block mb-2">Imagem (opcional)</Label>
          
          {image ? (
            <div className="relative mb-4 border border-white/30 rounded-md overflow-hidden">
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
            <div className="border border-dashed border-white/30 rounded-md p-6 text-center bg-white/30">
              <input 
                type="file" 
                id="image" 
                accept="image/*" 
                onChange={handleImageChange}
                className="hidden" 
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('image')?.click()}
                className="bg-white/30 border-white/30 hover:bg-white/50 text-gray-800"
              >
                <ImageIcon size={16} className="mr-2" />
                Selecionar Imagem
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-3 pt-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            className="border-gray-300 text-gray-800"
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            className="bg-gradient-to-r from-andcont-blue to-andcont-purple hover:opacity-90 text-white"
          >
            Publicar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserPostForm;
