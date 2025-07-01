
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash, Heart, Reply, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { formatDate, getUserInitials } from "@/utils/commentUtils";
import { supabase } from "@/integrations/supabase/client";
import CommentReply from "./CommentReply";

interface Comment {
  id: string;
  postId: string;
  postType: string;
  content: string;
  createdAt: string;
  createdBy: string;
  userEmail?: string;
  imageUrl?: string;
  gifUrl?: string;
  authorName?: string;
  authorProfileImage?: string;
  parentCommentId?: string;
  replies?: Comment[];
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  profileImage?: string;
}

interface CommentItemProps {
  comment: Comment;
  currentUser: User | null;
  users: Record<string, User>;
  onCommentDeleted: () => void;
  level?: number;
}

const CommentItem = ({ comment, currentUser, users, onCommentDeleted, level = 0 }: CommentItemProps) => {
  const [showReply, setShowReply] = useState(false);

  const handleDeleteComment = async (commentId: string) => {
    if (!currentUser) return;

    const canDelete = currentUser.role === "admin" || currentUser.id === comment.createdBy;
    
    if (!canDelete) {
      toast.error("Você não tem permissão para excluir este comentário");
      return;
    }

    if (!confirm("Tem certeza que deseja excluir este comentário?")) {
      return;
    }

    try {
      console.log('Deleting comment:', commentId);
      
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) {
        console.error('Error deleting comment:', error);
        toast.error("Erro ao excluir comentário");
        return;
      }

      console.log('Comment deleted successfully');
      onCommentDeleted();
      toast.success("Comentário removido com sucesso!");
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error("Erro ao excluir comentário");
    }
  };

  // Get user information with fallback
  const getUserInfo = () => {
    const user = users[comment.createdBy];
    return {
      name: comment.authorName || user?.name || 'Usuário',
      profileImage: comment.authorProfileImage || user?.profileImage || null
    };
  };

  const userInfo = getUserInfo();
  const isReply = level > 0;

  return (
    <div className={`group relative mb-6 ${isReply ? 'ml-8' : ''}`}>
      <div className={`${
        isReply 
          ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl border border-purple-300/30 p-4 shadow-lg'
          : 'bg-gradient-to-r from-black/60 to-black/40 backdrop-blur-xl rounded-3xl border border-white/20 p-6 hover:border-white/30 transition-all duration-300 hover:shadow-2xl'
      }`}>
        {isReply && (
          <div className="absolute -top-3 left-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
            Resposta
          </div>
        )}
        
        <div className="flex items-start gap-4">
          <div className="relative flex-shrink-0">
            <Avatar className={`${isReply ? 'h-10 w-10' : 'h-12 w-12'} border-2 ${isReply ? 'border-purple-300/50' : 'border-white/20'} shadow-lg`}>
              <AvatarImage 
                src={userInfo.profileImage || undefined} 
                alt={userInfo.name}
                className="object-cover"
              />
              <AvatarFallback className={`${
                isReply 
                  ? 'bg-gradient-to-br from-purple-400 to-pink-400 text-white font-bold text-sm'
                  : 'bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold'
              }`}>
                {getUserInitials(userInfo.name)}
              </AvatarFallback>
            </Avatar>
            {!isReply && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black/60 shadow-sm"></div>
            )}
          </div>
          
          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h4 className={`font-bold text-white ${isReply ? 'text-base' : 'text-lg'}`}>
                  {userInfo.name}
                </h4>
                <span className={`text-xs text-white/60 bg-white/10 px-2 py-1 rounded-full ${isReply ? 'text-xs' : ''}`}>
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/60 hover:text-pink-400 hover:bg-pink-500/20 rounded-full w-8 h-8 p-0"
                >
                  <Heart size={14} />
                </Button>
                
                {!isReply && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowReply(!showReply)}
                    className="text-white/60 hover:text-blue-400 hover:bg-blue-500/20 rounded-full w-8 h-8 p-0"
                  >
                    <Reply size={14} />
                  </Button>
                )}
                
                {(currentUser?.role === "admin" || currentUser?.id === comment.createdBy) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-white/60 hover:text-red-400 hover:bg-red-500/20 rounded-full w-8 h-8 p-0"
                  >
                    <Trash size={14} />
                  </Button>
                )}
              </div>
            </div>
            
            {comment.content && (
              <div className={`${
                isReply 
                  ? 'bg-black/20 rounded-lg p-3 border border-purple-200/20'
                  : 'bg-black/30 rounded-xl p-4 border border-white/10'
              }`}>
                <p className="text-white/90 leading-relaxed whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
            )}
            
            {(comment.imageUrl || comment.gifUrl) && (
              <div className={`rounded-xl overflow-hidden border ${isReply ? 'border-purple-200/30' : 'border-white/20'} shadow-lg`}>
                <img 
                  src={comment.gifUrl || comment.imageUrl} 
                  alt="Mídia do comentário" 
                  className="w-full max-h-64 object-cover cursor-pointer hover:scale-105 transition-transform duration-500" 
                />
              </div>
            )}

            {!isReply && (
              <div className="flex items-center gap-4 pt-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReply(!showReply)}
                  className="text-white/60 hover:text-white hover:bg-white/10 rounded-full px-3 py-1 text-sm"
                >
                  <MessageCircle size={14} className="mr-1" />
                  Responder
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/60 hover:text-pink-400 hover:bg-pink-500/10 rounded-full px-3 py-1 text-sm"
                >
                  <Heart size={14} className="mr-1" />
                  Curtir
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {showReply && currentUser && (
        <div className="mt-4">
          <CommentReply
            parentCommentId={comment.id}
            postId={comment.postId}
            postType={comment.postType}
            currentUser={currentUser}
            onReplyAdded={() => {
              onCommentDeleted();
              setShowReply(false);
            }}
            onCancel={() => setShowReply(false)}
          />
        </div>
      )}
      
      {/* Render replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              currentUser={currentUser}
              users={users}
              onCommentDeleted={onCommentDeleted}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
