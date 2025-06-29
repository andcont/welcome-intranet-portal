
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  profileImage?: string;
}

interface CommentReplyProps {
  parentCommentId: string;
  postId: string;
  postType: string;
  currentUser: User | null;
  onReplyAdded: () => void;
  onCancel: () => void;
}

const CommentReply = ({ 
  parentCommentId, 
  postId, 
  postType, 
  currentUser, 
  onReplyAdded, 
  onCancel 
}: CommentReplyProps) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !content.trim()) return;

    setLoading(true);
    try {
      console.log('Inserting reply:', {
        content: content.trim(),
        post_id: postId,
        post_type: postType,
        created_by: currentUser.id,
        parent_comment_id: parentCommentId
      });

      const { error } = await supabase
        .from('comments')
        .insert({
          content: content.trim(),
          post_id: postId,
          post_type: postType,
          created_by: currentUser.id,
          parent_comment_id: parentCommentId
        });

      if (error) {
        console.error('Error adding reply:', error);
        toast.error("Erro ao adicionar resposta");
        return;
      }

      setContent("");
      onReplyAdded();
      toast.success("Resposta adicionada com sucesso!");
    } catch (error) {
      console.error('Error adding reply:', error);
      toast.error("Erro ao adicionar resposta");
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="ml-8 bg-gradient-to-r from-purple-500/30 to-pink-500/20 backdrop-blur-xl rounded-2xl p-4 border border-purple-300/40 shadow-xl">
      <div className="flex items-start gap-3 mb-3">
        <Avatar className="h-8 w-8 border-2 border-purple-300/50 shadow-md">
          <AvatarImage 
            src={currentUser.profileImage} 
            alt={currentUser.name}
            className="object-cover"
          />
          <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white text-sm font-bold">
            {currentUser.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="text-white/90 text-sm mb-2 font-medium">
            Respondendo como <span className="text-purple-200">{currentUser.name}</span>
          </p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Digite sua resposta..."
          className="bg-black/40 border-purple-300/30 text-white placeholder:text-white/60 resize-none focus:border-purple-400/50"
          rows={3}
        />
        
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-white/70 hover:text-white hover:bg-white/10 border border-white/20"
          >
            <X size={16} className="mr-1" />
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading || !content.trim()}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg"
            size="sm"
          >
            <Send size={16} className="mr-1" />
            {loading ? "Enviando..." : "Responder"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CommentReply;
