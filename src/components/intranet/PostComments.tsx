
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash, Image, Smile, X } from "lucide-react";

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

// GIFs populares para demonstração
const POPULAR_GIFS = [
  "https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif",
  "https://media.giphy.com/media/l0MYC0LajbaPoEADu/giphy.gif",
  "https://media.giphy.com/media/26u4cqiYI30juCOGY/giphy.gif",
  "https://media.giphy.com/media/3o6Zt6KHxJTbXCnSvu/giphy.gif",
  "https://media.giphy.com/media/3og0IMHaMAAg8OYj1S/giphy.gif",
  "https://media.giphy.com/media/26BRBKqUiq586bRVm/giphy.gif",
  "https://media.giphy.com/media/26AHPxxnSw1L9T1rW/giphy.gif",
  "https://media.giphy.com/media/26FLgGTPUDH6UGAbm/giphy.gif",
  "https://media.giphy.com/media/3o6ZtaO9BZHcOjmErm/giphy.gif",
  "https://media.giphy.com/media/26u4lOMA8JKSnL9Uk/giphy.gif",
];

const PostComments = ({ postId, postType }: PostCommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedGif, setSelectedGif] = useState<string | null>(null);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [gifs, setGifs] = useState<string[]>(POPULAR_GIFS);
  const [isLoadingGifs, setIsLoadingGifs] = useState(false);
  const [gifSearchQuery, setGifSearchQuery] = useState("");
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

    loadComments();
  }, [postId, postType]);

  const loadComments = () => {
    const allComments = JSON.parse(localStorage.getItem("andcont_comments") || "[]");
    const filteredComments = allComments.filter(
      (comment: Comment) => comment.postId === postId && comment.postType === postType
    );
    setComments(filteredComments);
  };

  const searchGifs = async (query: string) => {
    if (!query.trim()) {
      setGifs(POPULAR_GIFS);
      return;
    }

    setIsLoadingGifs(true);
    
    // Simulação de busca de GIFs com query específica
    setTimeout(() => {
      const searchResults = POPULAR_GIFS.map(gif => 
        gif.replace('giphy.gif', `giphy.gif?search=${encodeURIComponent(query)}`)
      );
      setGifs(searchResults);
      setIsLoadingGifs(false);
    }, 500);
  };

  const handleSelectGif = (gifUrl: string) => {
    setSelectedGif(gifUrl);
    setShowGifPicker(false);
    clearImage();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("A imagem deve ter no máximo 5MB");
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error("Por favor, selecione apenas arquivos de imagem");
        return;
      }
      
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

  const clearImage = () => {
    setSelectedImage(null);
    setPreviewImage(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const clearGif = () => {
    setSelectedGif(null);
  };

  const clearAllMedia = () => {
    clearImage();
    clearGif();
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

    const comment: Comment = {
      id: Date.now().toString(),
      postId,
      postType,
      content: newComment,
      createdAt: new Date().toISOString(),
      createdBy: currentUser.name,
      userEmail: currentUser.email,
      imageUrl: previewImage || undefined,
      gifUrl: selectedGif || undefined
    };

    const allComments = JSON.parse(localStorage.getItem("andcont_comments") || "[]");
    const updatedComments = [comment, ...allComments];
    localStorage.setItem("andcont_comments", JSON.stringify(updatedComments));

    setNewComment("");
    clearAllMedia();
    setShowGifPicker(false);
    loadComments();
    toast.success("Comentário adicionado com sucesso!");
  };

  const handleDeleteComment = (commentId: string) => {
    if (!currentUser) return;

    const allComments = JSON.parse(localStorage.getItem("andcont_comments") || "[]");
    const comment = allComments.find((c: Comment) => c.id === commentId);

    if (!comment) return;

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
        
        {/* Preview da mídia selecionada */}
        {(previewImage || selectedGif) && (
          <div className="mt-3 relative">
            <img 
              src={selectedGif || previewImage || ''} 
              alt="Prévia" 
              className="max-h-64 max-w-full rounded-md border border-white/20 object-contain" 
            />
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute top-2 right-2 bg-black/80 hover:bg-black/90 text-white rounded-full p-1 h-8 w-8"
              onClick={clearAllMedia}
            >
              <X size={16} />
            </Button>
          </div>
        )}
        
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={imageInputRef}
              onChange={handleImageUpload}
            />
            
            <Button 
              variant="outline" 
              size="sm"
              className="bg-black/30 hover:bg-black/40 text-white border-white/20 flex items-center gap-2"
              onClick={() => imageInputRef.current?.click()}
            >
              <Image size={16} />
              <span className="hidden sm:inline">Foto</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              className="bg-black/30 hover:bg-black/40 text-white border-white/20 flex items-center gap-2"
              onClick={() => setShowGifPicker(!showGifPicker)}
            >
              <Smile size={16} />
              <span className="hidden sm:inline">GIF</span>
            </Button>
          </div>
          
          <Button 
            onClick={handleAddComment} 
            className="bg-gradient-to-r from-[#7B68EE] to-[#D946EF] hover:from-[#7B68EE]/90 hover:to-[#D946EF]/90 text-white"
          >
            Comentar
          </Button>
        </div>
        
        {/* Seletor de GIF */}
        {showGifPicker && (
          <div className="mt-4 p-4 bg-black/40 backdrop-blur-xl rounded-lg border border-white/20">
            <div className="mb-3">
              <input
                type="text"
                placeholder="Pesquisar GIFs..."
                value={gifSearchQuery}
                onChange={(e) => {
                  setGifSearchQuery(e.target.value);
                  searchGifs(e.target.value);
                }}
                className="w-full p-2 bg-black/60 text-white border border-white/20 rounded-md placeholder:text-white/60"
              />
            </div>
            
            {isLoadingGifs ? (
              <div className="text-center py-4 text-white/60">
                Carregando GIFs...
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-60 overflow-y-auto">
                {gifs.map((gif, index) => (
                  <img
                    key={index}
                    src={gif}
                    alt={`GIF ${index + 1}`}
                    className="cursor-pointer hover:opacity-80 rounded-md h-20 w-full object-cover border border-white/10 hover:border-white/30 transition-all"
                    onClick={() => handleSelectGif(gif)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lista de comentários */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="p-4 bg-black/20 backdrop-blur-xl rounded-lg border border-white/20"
          >
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10 border border-white/30 flex-shrink-0">
                <AvatarImage 
                  src={getUserProfileImage(comment.userEmail)} 
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
        ))}
        
        {comments.length === 0 && (
          <p className="text-center text-white/60 py-8">
            Nenhum comentário ainda. Seja o primeiro a comentar!
          </p>
        )}
      </div>
    </div>
  );
};

export default PostComments;
