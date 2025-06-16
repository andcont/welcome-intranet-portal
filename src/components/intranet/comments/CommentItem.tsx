
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash } from "lucide-react";
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
    <div className="p-4 bg-black/20 backdrop-blur-xl rounded-lg border border-white/20">
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10 border border-white/30 flex-shrink-0">
          <AvatarImage 
            src={getUserProfileImage(comment.userEmail, users)} 
            alt={comment.createdBy} 
          />
          <AvatarFallback className="bg-gradient-to-r from-[#7B68EE] to-[#D946EF] text-white">
            {getUserInitials(comment.createdBy)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-white truncate">{comment.createdBy}</h4>
            
            {(currentUser?.role === "admin" || currentUser?.email === comment.userEmail) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteComment(comment.id)}
                className="text-white/60 hover:text-red-400 hover:bg-black/30 flex-shrink-0"
              >
                <Trash size={14} />
              </Button>
            )}
          </div>
          
          {comment.content && (
            <p className="text-white/90 whitespace-pre-wrap mb-2">{comment.content}</p>
          )}
          
          {(comment.imageUrl || comment.gifUrl) && (
            <div className="mb-2">
              <img 
                src={comment.gifUrl || comment.imageUrl} 
                alt="Mídia do comentário" 
                className="max-h-64 max-w-full rounded-md border border-white/20 object-contain cursor-pointer hover:opacity-90 transition-opacity" 
              />
            </div>
          )}
          
          <div className="text-xs text-white/60">
            {formatDate(comment.createdAt)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
