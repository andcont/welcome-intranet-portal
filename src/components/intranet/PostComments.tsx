
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import CommentForm from "./comments/CommentForm";
import CommentsList from "./comments/CommentsList";

interface PostComment {
  id: string;
  post_id: string;
  post_type: string;
  content: string;
  created_at: string;
  created_by: string;
  image_url?: string;
  gif_url?: string;
  author_name?: string;
  author_profile_image?: string;
  parent_comment_id?: string;
  replies?: PostComment[];
}

interface PostCommentsProps {
  postId: string;
  postType: string;
}

const PostComments = ({ postId, postType }: PostCommentsProps) => {
  const [comments, setComments] = useState<PostComment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();

  const loadComments = async () => {
    try {
      const { data: commentsData, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .eq('post_type', postType)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading comments:', error);
        return;
      }

      // Load profiles for comment authors
      const authorIds = [...new Set(commentsData?.map(c => c.created_by) || [])];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, name, profile_image')
        .in('id', authorIds);

      const profilesMap = new Map(profilesData?.map(p => [p.id, { name: p.name, profile_image: p.profile_image }]) || []);

      // Organize comments hierarchically
      const rootComments: PostComment[] = [];
      const commentsMap = new Map<string, PostComment>();

      // First pass: create all comments with author info
      const enrichedComments = commentsData?.map(comment => ({
        ...comment,
        author_name: profilesMap.get(comment.created_by)?.name || 'Usuário',
        author_profile_image: profilesMap.get(comment.created_by)?.profile_image,
        replies: []
      })) || [];

      // Build the comments map
      enrichedComments.forEach(comment => {
        commentsMap.set(comment.id, comment);
      });

      // Second pass: organize hierarchy
      enrichedComments.forEach(comment => {
        if (comment.parent_comment_id) {
          // This is a reply
          const parentComment = commentsMap.get(comment.parent_comment_id);
          if (parentComment) {
            if (!parentComment.replies) parentComment.replies = [];
            parentComment.replies.push(comment);
          }
        } else {
          // This is a root comment
          rootComments.push(comment);
        }
      });

      setComments(rootComments);
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

  // Transform comments to match CommentsList expected format
  const transformComments = (comments: PostComment[]) => {
    return comments.map(comment => ({
      id: comment.id,
      postId: comment.post_id,
      postType: comment.post_type,
      content: comment.content,
      createdAt: comment.created_at,
      createdBy: comment.created_by,
      imageUrl: comment.image_url,
      gifUrl: comment.gif_url,
      userEmail: comment.author_name || 'Usuário',
      authorName: comment.author_name,
      authorProfileImage: comment.author_profile_image,
      parentCommentId: comment.parent_comment_id,
      replies: comment.replies ? transformComments(comment.replies) : []
    }));
  };

  if (loading) {
    return (
      <div className="mt-12 space-y-8">
        <div className="bg-gradient-to-r from-black/60 to-black/40 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl">
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

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
        comments={transformComments(comments)}
        currentUser={currentUser}
        users={{}}
        onCommentDeleted={loadComments}
      />
    </div>
  );
};

export default PostComments;
