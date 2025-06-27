
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import CommentForm from "./comments/CommentForm";
import CommentsList from "./comments/CommentsList";

interface Comment {
  id: string;
  post_id: string;
  post_type: string;
  content: string;
  created_at: string;
  created_by: string;
  image_url?: string;
  gif_url?: string;
  profiles?: {
    name: string;
    profile_image?: string;
  };
}

interface PostCommentsProps {
  postId: string;
  postType: string;
}

const PostComments = ({ postId, postType }: PostCommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();

  const loadComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles:created_by (name, profile_image)
        `)
        .eq('post_id', postId)
        .eq('post_type', postType)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading comments:', error);
        return;
      }

      setComments(data || []);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [postId, postType]);

  const currentUser = user && profile ? {
    id: user.id,
    name: profile.name,
    email: profile.email,
    role: profile.role,
    profileImage: profile.profile_image
  } : null;

  return (
    <div className="mt-12 space-y-8">
      <div className="bg-gradient-to-r from-black/60 to-black/40 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-3xl shadow-lg">
            💬
          </div>
          <div>
            <h3 className="text-3xl font-bold text-white mb-2">Comentários</h3>
            <p className="text-white/70 text-lg">Compartilhe seus pensamentos e participe da conversa</p>
          </div>
        </div>

        <CommentForm
          postId={postId}
          postType={postType}
          currentUser={currentUser}
          onCommentAdded={loadComments}
        />
      </div>

      <CommentsList
        comments={comments}
        currentUser={currentUser}
        users={{}}
        onCommentDeleted={loadComments}
        loading={loading}
      />
    </div>
  );
};

export default PostComments;
