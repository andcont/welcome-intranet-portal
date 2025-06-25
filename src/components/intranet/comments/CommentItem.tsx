
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash, Heart, Reply } from "lucide-react";
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
    <div className="group relative">
      <div className="bg-gradient-to-r from-black/40 to-black/30 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300 hover:shadow-xl">
        <div className="flex items-start gap-4">
          <div className="relative">
            <Avatar className="h-12 w-12 border-2 border-gradient-to-r from-purple-500/50 to-pink-500/50 ring-2 ring-white/10">
              <AvatarImage 
                src={getUserProfileImage(comment.userEmail, users)} 
                alt={comment.createdBy}
                className="object-cover"
              />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold text-lg">
                {getUserInitials(comment.createdBy)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black/40"></div>
          </div>
          
          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h4 className="font-semibold text-white text-lg">{comment.createdBy}</h4>
                <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded-full">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/60 hover:text-pink-400 hover:bg-pink-500/20 rounded-full w-8 h-8 p-0"
                >
                  <Heart size={14} />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/60 hover:text-blue-400 hover:bg-blue-500/20 rounded-full w-8 h-8 p-0"
                >
                  <Reply size={14} />
                </Button>
                
                {(currentUser?.role === "admin" || currentUser?.email === comment.userEmail) && (
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
              <div className="bg-black/20 rounded-xl p-4 border border-white/10">
                <p className="text-white/90 leading-relaxed whitespace-pre-wrap text-sm">
                  {comment.content}
                </p>
              </div>
            )}
            
            {(comment.imageUrl || comment.gifUrl) && (
              <div className="rounded-xl overflow-hidden border border-white/20 shadow-lg">
                <img 
                  src={comment.gifUrl || comment.imageUrl} 
                  alt="Mídia do comentário" 
                  className="w-full max-h-80 object-cover cursor-pointer hover:scale-105 transition-transform duration-300" 
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
