
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash } from "lucide-react";

interface Comment {
  id: string;
  postId: string;
  postType: string;
  content: string;
  createdAt: string;
  createdBy: string;
  userEmail?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  profileImage?: string;
}

interface PostCommentsProps {
  postId: string;
  postType: string;
}

const PostComments = ({ postId, postType }: PostCommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<Record<string, User>>({});

  useEffect(() => {
    // Load current user
    const userStr = localStorage.getItem("andcont_user");
    if (userStr) {
      try {
        const parsedUser = JSON.parse(userStr);
        setCurrentUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    // Load all users to get profile images
    const usersStr = localStorage.getItem("andcont_users");
    if (usersStr) {
      try {
        const allUsers = JSON.parse(usersStr);
        const usersMap: Record<string, User> = {};
        allUsers.forEach((user: User) => {
          usersMap[user.email] = user;
        });
        setUsers(usersMap);
      } catch (error) {
        console.error("Error parsing users data:", error);
      }
    }

    // Load comments for this post
    loadComments();
  }, [postId, postType]);

  const loadComments = () => {
    const allComments = JSON.parse(localStorage.getItem("andcont_comments") || "[]");
    const filteredComments = allComments.filter(
      (comment: Comment) => comment.postId === postId && comment.postType === postType
    );
    setComments(filteredComments);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) {
      toast.error("O comentário não pode estar vazio");
      return;
    }

    if (!currentUser) {
      toast.error("Você precisa estar logado para comentar");
      return;
    }

    const comment: Comment = {
      id: Date.now().toString(),
      postId,
      postType,
      content: newComment,
      createdAt: new Date().toISOString(),
      createdBy: currentUser.name,
      userEmail: currentUser.email
    };

    const allComments = JSON.parse(localStorage.getItem("andcont_comments") || "[]");
    const updatedComments = [comment, ...allComments];
    localStorage.setItem("andcont_comments", JSON.stringify(updatedComments));

    setNewComment("");
    loadComments();
    toast.success("Comentário adicionado com sucesso!");
  };

  const handleDeleteComment = (commentId: string) => {
    if (!currentUser) return;

    const allComments = JSON.parse(localStorage.getItem("andcont_comments") || "[]");
    const comment = allComments.find((c: Comment) => c.id === commentId);

    if (!comment) return;

    // Only allow deletion if user is admin or the comment author
    if (currentUser.role !== "admin" && comment.createdBy !== currentUser.name) {
      toast.error("Você não tem permissão para excluir este comentário");
      return;
    }

    const updatedComments = allComments.filter((c: Comment) => c.id !== commentId);
    localStorage.setItem("andcont_comments", JSON.stringify(updatedComments));
    loadComments();
    toast.success("Comentário removido com sucesso!");
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
  
  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };
  
  const getUserProfileImage = (userEmail?: string) => {
    if (!userEmail) return null;
    return users[userEmail]?.profileImage || null;
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4 text-white">Comentários</h3>

      <div className="mb-4">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Escreva seu comentário..."
          className="bg-black/30 text-white border-white/20 resize-none h-24"
        />
        <Button onClick={handleAddComment} className="mt-2 btn-primary">
          Comentar
        </Button>
      </div>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="p-4 bg-black/20 backdrop-blur-xl rounded-lg border border-white/20"
          >
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10 border border-white/30">
                <AvatarImage 
                  src={getUserProfileImage(comment.userEmail)} 
                  alt={comment.createdBy} 
                />
                <AvatarFallback className="bg-primary/30 text-white">
                  {getUserInitials(comment.createdBy)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-white">{comment.createdBy}</h4>
                  
                  {(currentUser?.role === "admin" || currentUser?.name === comment.createdBy) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-white/60 hover:text-red-400 hover:bg-black/30"
                    >
                      <Trash size={14} />
                    </Button>
                  )}
                </div>
                
                <p className="text-white/90 whitespace-pre-wrap">{comment.content}</p>
                
                <div className="mt-2 text-xs text-white/60">
                  {formatDate(comment.createdAt)}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {comments.length === 0 && (
          <p className="text-center text-white/60 py-4">
            Nenhum comentário ainda. Seja o primeiro a comentar!
          </p>
        )}
      </div>
    </div>
  );
};

export default PostComments;
