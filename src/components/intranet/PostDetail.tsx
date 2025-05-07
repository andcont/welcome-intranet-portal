
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { X, MessageSquare, User, Send } from "lucide-react";
import { toast } from "sonner";

interface PostDetailProps {
  postId: string;
  postType: 'announcement' | 'link' | 'event' | 'feed';
  onClose: () => void;
}

interface Comment {
  id: string;
  postId: string;
  postType: string;
  content: string;
  createdAt: string;
  createdBy: string;
  createdByRole?: string;
}

interface Post {
  id: string;
  title: string;
  content?: string;
  description?: string;
  image?: string | null;
  url?: string;
  date?: string;
  createdAt: string;
  createdBy: string;
}

const PostDetail = ({ postId, postType, onClose }: PostDetailProps) => {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Load post data
    let storageKey = "";
    switch(postType) {
      case 'announcement':
        storageKey = 'andcont_announcements';
        break;
      case 'link':
        storageKey = 'andcont_links';
        break;
      case 'event':
        storageKey = 'andcont_events';
        break;
      case 'feed':
        storageKey = 'andcont_feed';
        break;
    }
    
    const storedItems = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const foundPost = storedItems.find((item: Post) => item.id === postId);
    
    if (foundPost) {
      setPost(foundPost);
    }
    
    // Load comments
    const allComments = JSON.parse(localStorage.getItem('andcont_comments') || '[]');
    const postComments = allComments.filter(
      (comment: Comment) => comment.postId === postId && comment.postType === postType
    );
    setComments(postComments);
    setLoading(false);
  }, [postId, postType]);
  
  const getCurrentUser = () => {
    const userStr = localStorage.getItem("andcont_user");
    if (!userStr) return { name: "Usuário", role: "user" };
    
    try {
      const user = JSON.parse(userStr);
      return { name: user.name || "Usuário", role: user.role || "user" };
    } catch {
      return { name: "Usuário", role: "user" };
    }
  };
  
  const handleSubmitComment = () => {
    if (!newComment.trim()) {
      toast.error("Por favor, informe um comentário");
      return;
    }
    
    const user = getCurrentUser();
    const now = new Date();
    const commentId = Date.now().toString();
    
    const comment = {
      id: commentId,
      postId,
      postType,
      content: newComment,
      createdAt: now.toISOString(),
      createdBy: user.name,
      createdByRole: user.role
    };
    
    const allComments = JSON.parse(localStorage.getItem('andcont_comments') || '[]');
    allComments.push(comment);
    localStorage.setItem('andcont_comments', JSON.stringify(allComments));
    
    setComments([...comments, comment]);
    setNewComment("");
    
    toast.success("Comentário adicionado com sucesso!");
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  if (loading || !post) {
    return (
      <div className="bg-white/25 backdrop-blur-xl rounded-lg p-6 border border-white/30">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Carregando...</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <X size={18} />
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white/25 backdrop-blur-xl rounded-lg p-6 border border-white/30">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">{post.title}</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClose}
          className="text-white/70 hover:text-white hover:bg-white/10"
        >
          <X size={18} />
        </Button>
      </div>
      
      {/* Post content */}
      <div className="mb-8">
        {post.image && (
          <div className="mb-4">
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-auto max-h-80 object-contain rounded-md border border-white/20"
            />
          </div>
        )}
        
        <div className="text-white/90 whitespace-pre-wrap">
          {post.content || post.description}
        </div>
        
        {post.url && (
          <div className="mt-4">
            <a 
              href={post.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-300 hover:underline flex items-center"
            >
              Acessar link
            </a>
          </div>
        )}
        
        {post.date && (
          <div className="mt-2 text-white/80">
            <span>Data: {new Date(post.date).toLocaleDateString('pt-BR')}</span>
          </div>
        )}
        
        <div className="mt-4 text-sm text-white/60 flex items-center justify-between">
          <span>Por: {post.createdBy}</span>
          <span>{formatDate(post.createdAt)}</span>
        </div>
      </div>
      
      {/* Comments section */}
      <div className="pt-6 border-t border-white/20">
        <h4 className="flex items-center text-lg font-bold text-white mb-4">
          <MessageSquare className="mr-2 h-5 w-5" /> 
          Comentários ({comments.length})
        </h4>
        
        {comments.length > 0 ? (
          <div className="space-y-4 mb-6">
            {comments.map(comment => (
              <div key={comment.id} className="bg-black/10 rounded-lg p-4 border border-white/10">
                <div className="flex items-start">
                  <Avatar className="h-8 w-8 mr-3 bg-white/20 text-white border border-white/30">
                    <User className="h-4 w-4" />
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <span className="font-medium text-white">{comment.createdBy}</span>
                        {comment.createdByRole === 'admin' && (
                          <span className="ml-2 bg-white/30 text-white text-xs px-2 py-0.5 rounded-full">
                            Admin
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-white/60">{formatDate(comment.createdAt)}</span>
                    </div>
                    <p className="text-white/90">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-white/70">Seja o primeiro a comentar!</p>
          </div>
        )}
        
        {/* Add comment */}
        <div className="flex space-x-3 mt-4">
          <Avatar className="h-8 w-8 bg-white/20 text-white border border-white/30">
            <User className="h-4 w-4" />
          </Avatar>
          <div className="flex-1">
            <Textarea 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Adicione um comentário..."
              rows={3}
              className="bg-black/20 border-white/20 text-white placeholder:text-white/50 mb-2 resize-none"
            />
            <div className="flex justify-end">
              <Button 
                onClick={handleSubmitComment}
                size="sm"
                className="bg-gradient-andcont hover:opacity-90 transition-opacity"
              >
                <Send className="mr-2 h-4 w-4" /> Comentar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
