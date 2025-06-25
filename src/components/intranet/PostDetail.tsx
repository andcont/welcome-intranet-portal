
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Edit, Trash, ExternalLink, Calendar, MapPin, Clock } from "lucide-react";
import { toast } from "sonner";
import EditPostForm from "./EditPostForm";
import PostReactions from "./PostReactions";
import PostComments from "./PostComments";

interface PostDetailProps {
  postId: string;
  postType: 'announcement' | 'link' | 'event' | 'feed';
  onClose: () => void;
}

const PostDetail = ({ postId, postType, onClose }: PostDetailProps) => {
  const [post, setPost] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

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

    // Load the specific post
    loadPost();
  }, [postId, postType]);

  const loadPost = () => {
    let storageKey = "";
    switch (postType) {
      case 'announcement':
        storageKey = "andcont_announcements";
        break;
      case 'link':
        storageKey = "andcont_links";
        break;
      case 'event':
        storageKey = "andcont_events";
        break;
      case 'feed':
        storageKey = "andcont_feed";
        break;
    }

    const posts = JSON.parse(localStorage.getItem(storageKey) || "[]");
    const foundPost = posts.find((p: any) => p.id === postId);
    setPost(foundPost);
  };

  const handleDelete = () => {
    if (!currentUser || currentUser.role !== 'admin') {
      toast.error("Apenas administradores podem excluir conteúdo");
      return;
    }

    if (window.confirm("Tem certeza que deseja excluir este item?")) {
      let storageKey = "";
      switch (postType) {
        case 'announcement':
          storageKey = "andcont_announcements";
          break;
        case 'link':
          storageKey = "andcont_links";
          break;
        case 'event':
          storageKey = "andcont_events";
          break;
        case 'feed':
          storageKey = "andcont_feed";
          break;
      }

      const posts = JSON.parse(localStorage.getItem(storageKey) || "[]");
      const updatedPosts = posts.filter((p: any) => p.id !== postId);
      localStorage.setItem(storageKey, JSON.stringify(updatedPosts));
      
      toast.success("Item excluído com sucesso!");
      onClose();
    }
  };

  const handleEditSave = () => {
    setIsEditing(false);
    loadPost(); // Reload the post to reflect changes
  };

  if (!post) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white/70">Carregando...</p>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <EditPostForm
        post={post}
        postType={postType}
        onSave={handleEditSave}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white">{post.title}</h1>
          {postType === 'event' && <Calendar className="h-5 w-5 text-purple-400" />}
          {postType === 'link' && <ExternalLink className="h-5 w-5 text-blue-400" />}
        </div>
        <div className="flex items-center gap-2">
          {currentUser?.role === 'admin' && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="text-white/70 hover:text-red-400 hover:bg-red-500/20"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-white/20">
        {/* Meta Information */}
        <div className="flex items-center gap-4 mb-4 text-sm text-white/60">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {new Date(post.createdAt).toLocaleDateString('pt-BR')}
          </span>
          {post.author && (
            <span>Por: {post.author}</span>
          )}
        </div>

        {/* Event specific fields */}
        {postType === 'event' && (
          <div className="flex flex-wrap gap-4 mb-4 text-sm">
            {post.date && (
              <span className="flex items-center gap-1 text-purple-400">
                <Calendar className="h-4 w-4" />
                {new Date(post.date).toLocaleDateString('pt-BR')}
              </span>
            )}
            {post.location && (
              <span className="flex items-center gap-1 text-blue-400">
                <MapPin className="h-4 w-4" />
                {post.location}
              </span>
            )}
          </div>
        )}

        {/* Link specific fields */}
        {postType === 'link' && post.url && (
          <div className="mb-4">
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              Acessar Link
            </a>
          </div>
        )}

        {/* Image */}
        {post.imageUrl && (
          <div className="mb-6">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full max-h-96 object-cover rounded-lg border border-white/20"
            />
          </div>
        )}

        {/* Content */}
        {post.content && (
          <div className="prose prose-invert max-w-none">
            <p className="text-white/90 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>
          </div>
        )}
      </div>

      {/* Reactions */}
      <PostReactions postId={postId} postType={postType} />

      {/* Comments */}
      <PostComments postId={postId} postType={postType} />
    </div>
  );
};

export default PostDetail;
