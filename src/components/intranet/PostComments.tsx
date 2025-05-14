
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash, Image, Smile } from "lucide-react";

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

interface PostCommentsProps {
  postId: string;
  postType: string;
}

const PostComments = ({ postId, postType }: PostCommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedGif, setSelectedGif] = useState<string | null>(null);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [searchGif, setSearchGif] = useState("");
  const [gifs, setGifs] = useState<any[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load current user
    const userStr = localStorage.getItem("andcont_user");
    if (userStr) {
      try {
        const parsedUser = JSON.parse(userStr);
        setCurrentUser(parsedUser);
      } catch (error) {
        console.error("Erro ao analisar dados do usuário:", error);
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
        console.error("Erro ao analisar dados de usuários:", error);
      }
    }

    // Load comments for this post
    loadComments();

    // Load sample gifs
    loadSampleGifs();
  }, [postId, postType]);

  const loadComments = () => {
    const allComments = JSON.parse(localStorage.getItem("andcont_comments") || "[]");
    const filteredComments = allComments.filter(
      (comment: Comment) => comment.postId === postId && comment.postType === postType
    );
    setComments(filteredComments);
  };

  const loadSampleGifs = () => {
    // Sample GIFs data - could be replaced with a real API in production
    const sampleGifs = [
      "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExajRlaXpyNmxobW02OWl6ZTJ4aHRneWc0MWtmcmQxN2Y0b21obGoyNiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ZqlvCTNHpqrio/giphy.gif",
      "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ3Rsb2pwcXI0c2wxbW13dWw1ZGg3ZnF0dXNld2RyenZjYmpkMDQyZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xUPGcEghH2dZdXvVSM/giphy.gif",
      "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ3c3eGgzbjVuZ3F0MXM1aW9xdHdnazY1ZzU1aHVtZm9kcXA5NGhiZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/QMHoU66sBXqqLqYvGO/giphy.gif",
      "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeW9kcngxaWxwdjZ3ZGg5bGFpbDFyaGhucWg4dXFjcG50ZWoxNHI5ZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o6Zt6KHxJTbX20tdC/giphy.gif",
      "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExa3o3ZHdsb2lnZGUzNWY4bjZnM2hxM3k5cGdzejZ0c2V0bHYzaDYwcCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3og0IMHaMAAg8OYj1S/giphy.gif",
      "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcWU5aHRxb2NtMmdvdzk1dXUzd2ZlZ2J0azBpNjFjNXU0OWpmaWE3dSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/7SF5scGB2AFrgsXP63/giphy.gif",
    ];
    setGifs(sampleGifs);
  };

  const handleSearchGifs = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchGif(e.target.value);
    // In a real app, you would call a GIF API with the search term
    // For this demo, we'll just filter our sample GIFs
    // No filter applied in this sample implementation
  };

  const handleSelectGif = (gifUrl: string) => {
    setSelectedGif(gifUrl);
    setShowGifPicker(false);
    setSelectedImage(null);
    setPreviewImage(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setSelectedGif(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageButtonClick = () => {
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim() && !selectedImage && !selectedGif) {
      toast.error("O comentário não pode estar vazio");
      return;
    }

    if (!currentUser) {
      toast.error("Você precisa estar logado para comentar");
      return;
    }

    let imageUrl: string | undefined;
    
    if (selectedImage) {
      // In a real app, you would upload the image to a server and get a URL
      // For this demo, we'll use the data URL as the image URL
      imageUrl = previewImage || undefined;
    }

    const comment: Comment = {
      id: Date.now().toString(),
      postId,
      postType,
      content: newComment,
      createdAt: new Date().toISOString(),
      createdBy: currentUser.name,
      userEmail: currentUser.email,
      imageUrl: imageUrl,
      gifUrl: selectedGif || undefined
    };

    const allComments = JSON.parse(localStorage.getItem("andcont_comments") || "[]");
    const updatedComments = [comment, ...allComments];
    localStorage.setItem("andcont_comments", JSON.stringify(updatedComments));

    setNewComment("");
    setSelectedImage(null);
    setPreviewImage(null);
    setSelectedGif(null);
    loadComments();
    toast.success("Comentário adicionado com sucesso!");
  };

  const handleDeleteComment = (commentId: string) => {
    if (!currentUser) return;

    const allComments = JSON.parse(localStorage.getItem("andcont_comments") || "[]");
    const comment = allComments.find((c: Comment) => c.id === commentId);

    if (!comment) return;

    // Only allow deletion if user is admin or the comment author
    if (currentUser.role !== "admin" && comment.userEmail !== currentUser.email) {
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
        
        {(previewImage || selectedGif) && (
          <div className="mt-2 relative">
            <img 
              src={selectedGif || previewImage || ''} 
              alt="Prévia da imagem" 
              className="max-h-64 max-w-full rounded-md border border-white/20" 
            />
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full p-1"
              onClick={() => {
                setSelectedImage(null);
                setPreviewImage(null);
                setSelectedGif(null);
              }}
            >
              <Trash size={16} />
            </Button>
          </div>
        )}
        
        <div className="flex items-center mt-2 gap-2">
          <Button onClick={handleAddComment} className="btn-primary">
            Comentar
          </Button>
          
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={imageInputRef}
            onChange={handleImageUpload}
          />
          
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-black/30 hover:bg-black/40 text-white border-white/20"
            onClick={handleImageButtonClick}
          >
            <Image size={18} />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-black/30 hover:bg-black/40 text-white border-white/20"
            onClick={() => setShowGifPicker(!showGifPicker)}
          >
            <Smile size={18} />
          </Button>
        </div>
        
        {showGifPicker && (
          <div className="mt-2 p-3 bg-black/40 backdrop-blur-xl rounded-lg border border-white/20">
            <div className="mb-2">
              <input
                type="text"
                placeholder="Pesquisar GIFs..."
                value={searchGif}
                onChange={handleSearchGifs}
                className="w-full p-2 bg-black/60 text-white border border-white/20 rounded"
              />
            </div>
            <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
              {gifs.map((gif, index) => (
                <img
                  key={index}
                  src={gif}
                  alt={`GIF ${index + 1}`}
                  className="cursor-pointer hover:opacity-80 rounded-md"
                  onClick={() => handleSelectGif(gif)}
                />
              ))}
            </div>
          </div>
        )}
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
                  
                  {(currentUser?.role === "admin" || currentUser?.email === comment.userEmail) && (
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
                
                {(comment.imageUrl || comment.gifUrl) && (
                  <div className="mt-2 mb-2">
                    <img 
                      src={comment.gifUrl || comment.imageUrl} 
                      alt="Imagem do comentário" 
                      className="max-h-64 max-w-full rounded-md border border-white/20 object-contain" 
                    />
                  </div>
                )}
                
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
