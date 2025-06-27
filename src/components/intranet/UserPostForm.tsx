
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface UserPostFormProps {
  onClose: () => void;
}

const UserPostForm = ({ onClose }: UserPostFormProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
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
    
    if (!content.trim()) {
      toast.error("Por favor, informe o conteúdo da publicação");
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('feed_posts')
        .insert({
          title,
          content,
          image_url: image,
          created_by: user.id
        });

      if (error) {
        console.error('Error creating feed post:', error);
        toast.error("Erro ao criar publicação");
        return;
      }
      
      toast.success("Publicação realizada com sucesso!");
      onClose();
    } catch (error) {
      console.error('Error creating feed post:', error);
      toast.error("Erro ao criar publicação");
    } finally {
      setLoading(false);
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
  
  const removeImage = () => {
    setImage(null);
  };
  
  return (
    <div className="bg-black/40 backdrop-blur-xl rounded-lg p-6 border border-white/20 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">Nova Publicação</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClose}
          className="text-white/70 hover:text-white hover:bg-white/10"
          disabled={loading}
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
            className="bg-black/20 border-white/30 text-white placeholder:text-white/50"
            disabled={loading}
          />
        </div>
        
        <div>
          <Label htmlFor="content" className="text-white">Conteúdo</Label>
          <Textarea 
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="O que você está pensando?"
            rows={5}
            className="bg-black/20 border-white/30 text-white placeholder:text-white/50 resize-none"
            disabled={loading}
          />
        </div>
        
        <div>
          <Label className="text-white block mb-2">Imagem (opcional)</Label>
          
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
                disabled={loading}
              >
                <X size={16} />
              </Button>
            </div>
          ) : (
            <div className="border border-dashed border-white/20 rounded-md p-6 text-center bg-black/10">
              <input 
                type="file" 
                id="image" 
                accept="image/*" 
                onChange={handleImageChange}
                className="hidden" 
                disabled={loading}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('image')?.click()}
                className="bg-black/20 border-white/30 hover:bg-black/30 text-white"
                disabled={loading}
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
            className="bg-black/20 border-white/30 hover:bg-black/30 text-white"
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            className="bg-gradient-to-r from-andcont-blue to-andcont-purple hover:opacity-90 text-white"
            disabled={loading}
          >
            {loading ? "Publicando..." : "Publicar"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserPostForm;
