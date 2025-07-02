import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Edit, Trash, ExternalLink, Calendar, MapPin, Clock } from "lucide-react";
import { toast } from "sonner";
import EditPostForm from "./EditPostForm";
import PostReactions from "./PostReactions";
import PostComments from "./PostComments";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface PostDetailProps {
  postId: string;
  postType: 'announcement' | 'link' | 'event' | 'feed';
  onClose: () => void;
}

const PostDetail = ({ postId, postType, onClose }: PostDetailProps) => {
  const [post, setPost] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const { user, profile } = useAuth();

  useEffect(() => {
    loadPost();
  }, [postId, postType]);

  const loadPost = async () => {
    try {
      console.log('Loading post:', postId, postType);
      setLoading(true);
      
      let query;
      switch (postType) {
        case 'announcement':
          query = supabase.from('announcements').select('*').eq('id', postId).single();
          break;
        case 'link':
          query = supabase.from('useful_links').select('*').eq('id', postId).single();
          break;
        case 'event':
          query = supabase.from('events').select('*').eq('id', postId).single();
          break;
        case 'feed':
          query = supabase.from('feed_posts').select('*').eq('id', postId).single();
          break;
        default:
          console.error('Unknown post type:', postType);
          return;
      }

      const { data: postData, error } = await query;

      if (error) {
        console.error('Error loading post:', error);
        toast.error("Erro ao carregar post");
        return;
      }

      console.log('Post loaded:', postData);

      // Load author profile if the post has created_by field
      let authorProfile = null;
      if (postData && 'created_by' in postData && postData.created_by) {
        const { data: authorData } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', postData.created_by)
          .single();
        
        authorProfile = authorData;
      }

      const enrichedPost = {
        ...postData,
        author: authorProfile?.name || 'Usuário',
        // Map database fields to expected format
        createdAt: postData.created_at,
        imageUrl: 'image_url' in postData ? postData.image_url : null,
        url: 'url' in postData ? postData.url : null,
        location: 'location' in postData ? postData.location : null,
        date: 'event_date' in postData ? postData.event_date : null
      };

      setPost(enrichedPost);
    } catch (error) {
      console.error('Error loading post:', error);
      toast.error("Erro ao carregar post");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!user || profile?.role !== 'admin') {
      toast.error("Apenas administradores podem excluir conteúdo");
      return;
    }

    if (!confirm("Tem certeza que deseja excluir este item?")) {
      return;
    }

    try {
      let deleteQuery;
      switch (postType) {
        case 'announcement':
          deleteQuery = supabase.from('announcements').delete().eq('id', postId);
          break;
        case 'link':
          deleteQuery = supabase.from('useful_links').delete().eq('id', postId);
          break;
        case 'event':
          deleteQuery = supabase.from('events').delete().eq('id', postId);
          break;
        case 'feed':
          deleteQuery = supabase.from('feed_posts').delete().eq('id', postId);
          break;
        default:
          console.error('Unknown post type:', postType);
          return;
      }

      const { error } = await deleteQuery;

      if (error) {
        console.error('Error deleting post:', error);
        toast.error("Erro ao excluir item");
        return;
      }
      
      toast.success("Item excluído com sucesso!");
      onClose();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error("Erro ao excluir item");
    }
  };

  const handleEditSave = () => {
    setIsEditing(false);
    loadPost(); // Reload the post to reflect changes
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white/70">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <p className="text-white/70">Post não encontrado</p>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <EditPostForm
        postId={postId}
        postType={postType}
        onUpdate={handleEditSave}
        onClose={() => setIsEditing(false)}
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
          {profile?.role === 'admin' && (
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
              className="w-full max-h-96 object-cover rounded-lg border border-white/20 cursor-pointer transition-transform duration-300 hover:scale-105"
              onClick={() => setShowImagePreview(true)}
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

      {/* Image Preview Modal */}
{showImagePreview && post.imageUrl && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-8"
          onClick={() => setShowImagePreview(false)}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowImagePreview(false)}
            className="absolute top-4 right-4 text-white hover:text-white hover:bg-white/20 z-10 bg-black/50 rounded-full p-3"
          >
            <X className="h-6 w-6" />
          </Button>
          <img
            src={post.imageUrl}
            alt={post.title}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
)}
              <X className="h-6 w-6" />
            </Button>
            <img
              src={post.imageUrl}
              alt={post.title}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* Reactions */}
      <PostReactions postId={postId} postType={postType} />

      {/* Comments */}
      <PostComments postId={postId} postType={postType} />
    </div>
  );
};

export default PostDetail;
