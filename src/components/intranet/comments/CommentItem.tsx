
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash, Heart, Reply, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { formatDate, getUserInitials, getUserProfileImage } from "@/utils/commentUtils";

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
}

const CommentItem = ({ comment, currentUser, users, onCommentDeleted }: CommentItemProps) => {
  const handleDeleteComment = (commentId: string) => {
    if (!currentUser) return;

    const allComments = JSON.parse(localStorage.getItem("andcont_comments") || "[]");
    const commentToDelete = allComments.find((c: Comment) => c.id === commentId);

    if (!commentToDelete) return;

    if (currentUser.role !== "admin" && commentToDelete.userEmail !== currentUser.email) {
      toast.error("Você não tem permissão para excluir este comentário");
      return;
    }

    const updatedComments = allComments.filter((c: Comment) => c.id !== commentId);
    localStorage.setItem("andcont_comments", JSON.stringify(updatedComments));
    onCommentDeleted();
    toast.success("Comentário removido com sucesso!");
  };

  return (
    <div className="group relative mb-6">
      <div className="bg-gradient-to-r from-black/60 to-black/40 backdrop-blur-xl rounded-3xl border border-white/20 p-8 hover:border-white/30 transition-all duration-300 hover:shadow-2xl hover:transform hover:scale-[1.02]">
        <div className="flex items-start gap-6">
          <div className="relative flex-shrink-0">
            <Avatar className="h-16 w-16 border-4 border-gradient-to-r from-purple-500/50 to-pink-500/50 ring-4 ring-white/10 shadow-lg">
              <AvatarImage 
                src={getUserProfileImage(comment.userEmail, users)} 
                alt={comment.createdBy}
                className="object-cover"
              />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold text-xl">
                {getUserInitials(comment.createdBy)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-black/60 shadow-lg"></div>
          </div>
          
          <div className="flex-1 min-w-0 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h4 className="font-bold text-white text-xl">{comment.createdBy}</h4>
                <span className="text-sm text-white/70 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/60 hover:text-pink-400 hover:bg-pink-500/20 rounded-full w-10 h-10 p-0 transition-all duration-200"
                >
                  <Heart size={16} />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/60 hover:text-blue-400 hover:bg-blue-500/20 rounded-full w-10 h-10 p-0 transition-all duration-200"
                >
                  <Reply size={16} />
                </Button>
                
                {(currentUser?.role === "admin" || currentUser?.email === comment.userEmail) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-white/60 hover:text-red-400 hover:bg-red-500/20 rounded-full w-10 h-10 p-0 transition-all duration-200"
                  >
                    <Trash size={16} />
                  </Button>
                )}
              </div>
            </div>
            
            {comment.content && (
              <div className="bg-black/30 rounded-2xl p-6 border border-white/10 backdrop-blur-sm shadow-inner">
                <p className="text-white/90 leading-relaxed whitespace-pre-wrap text-lg">
                  {comment.content}
                </p>
              </div>
            )}
            
            {(comment.imageUrl || comment.gifUrl) && (
              <div className="rounded-2xl overflow-hidden border border-white/30 shadow-xl">
                <img 
                  src={comment.gifUrl || comment.imageUrl} 
                  alt="Mídia do comentário" 
                  className="w-full max-h-96 object-cover cursor-pointer hover:scale-105 transition-transform duration-500" 
                />
              </div>
            )}

            <div className="flex items-center gap-6 pt-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white/60 hover:text-white hover:bg-white/10 rounded-full px-4 py-2 transition-all duration-200"
              >
                <MessageCircle size={16} className="mr-2" />
                Responder
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white/60 hover:text-pink-400 hover:bg-pink-500/10 rounded-full px-4 py-2 transition-all duration-200"
              >
                <Heart size={16} className="mr-2" />
                Curtir
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
