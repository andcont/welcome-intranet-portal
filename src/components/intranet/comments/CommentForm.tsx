
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Image, Smile } from "lucide-react";
import { toast } from "sonner";
import GifPicker from "./GifPicker";
import MediaPreview from "./MediaPreview";

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

interface CommentFormProps {
  postId: string;
  postType: string;
  currentUser: User | null;
  onCommentAdded: () => void;
}

const CommentForm = ({ postId, postType, currentUser, onCommentAdded }: CommentFormProps) => {
  const [newComment, setNewComment] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedGif, setSelectedGif] = useState<string | null>(null);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

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
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectGif = (gifUrl: string) => {
    setSelectedGif(gifUrl);
    setShowGifPicker(false);
    clearImage();
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
    onCommentAdded();
    toast.success("Comentário adicionado com sucesso!");
  };

  return (
    <div className="mb-4">
      <Textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Escreva seu comentário..."
        className="bg-black/30 text-white border-white/20 resize-none h-24"
      />
      
      <MediaPreview 
        previewImage={previewImage}
        selectedGif={selectedGif}
        onClearMedia={clearAllMedia}
      />
      
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
            type="button"
          >
            <Image size={16} />
            <span className="hidden sm:inline">Foto</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            className="bg-black/30 hover:bg-black/40 text-white border-white/20 flex items-center gap-2"
            onClick={() => setShowGifPicker(!showGifPicker)}
            type="button"
          >
            <Smile size={16} />
            <span className="hidden sm:inline">GIF</span>
          </Button>
        </div>
        
        <Button 
          onClick={handleAddComment} 
          className="bg-gradient-to-r from-[#7B68EE] to-[#D946EF] hover:from-[#7B68EE]/90 hover:to-[#D946EF]/90 text-white"
          type="button"
        >
          Comentar
        </Button>
      </div>
      
      <GifPicker 
        onSelectGif={handleSelectGif}
        isVisible={showGifPicker}
      />
    </div>
  );
};

export default CommentForm;
