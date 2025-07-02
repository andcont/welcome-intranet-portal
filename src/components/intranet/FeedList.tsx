
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash, MessageSquare, AlertCircle, Edit, Heart } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface FeedPost {
  id: string;
  title: string;
  content: string;
  image_url?: string | null;
  created_at: string;
  created_by: string;
  author_name?: string;
}

interface FeedListProps {
  isAdmin: boolean;
  onSelectPost: (id: string, type: 'feed') => void;
}

const FeedList = ({ isAdmin, onSelectPost }: FeedListProps) => {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
  const [reactionCounts, setReactionCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();

  const loadPosts = async () => {
    try {
      const { data: postsData, error } = await supabase
        .from('feed_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading feed posts:', error);
        toast.error("Erro ao carregar posts");
        return;
      }

      // Load profiles for authors
      const authorIds = [...new Set(postsData?.map(p => p.created_by) || [])];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, name')
        .in('id', authorIds);

      const profilesMap = new Map(profilesData?.map(p => [p.id, p.name]) || []);

      const enrichedPosts = postsData?.map(post => ({
        ...post,
        author_name: profilesMap.get(post.created_by) || 'Usuário'
      })) || [];

      setPosts(enrichedPosts);
    } catch (error) {
      console.error('Error loading feed posts:', error);
      toast.error("Erro ao carregar posts");
    } finally {
      setLoading(false);
    }
  };

  const loadCommentCounts = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('post_id')
        .eq('post_type', 'feed');

      if (!error && data) {
        const counts: Record<string, number> = {};
        data.forEach((comment) => {
          counts[comment.post_id] = (counts[comment.post_id] || 0) + 1;
        });
        setCommentCounts(counts);
      }
    } catch (error) {
      console.error('Error loading comment counts:', error);
    }
  };

  const loadReactionCounts = async () => {
    try {
      const { data, error } = await supabase
        .from('reactions')
        .select('post_id')
        .eq('post_type', 'feed');

      if (!error && data) {
        const counts: Record<string, number> = {};
        data.forEach((reaction) => {
          counts[reaction.post_id] = (counts[reaction.post_id] || 0) + 1;
        });
        setReactionCounts(counts);
      }
    } catch (error) {
      console.error('Error loading reaction counts:', error);
    }
  };

  useEffect(() => {
    loadPosts();
    loadCommentCounts();
    loadReactionCounts();
  }, []);

  const canEditOrDelete = (post: FeedPost) => {
    if (!user) return false;
    
    // Admin can edit/delete anything
    if (profile?.role === 'admin') return true;
    
    // Regular users can only edit/delete their own feed posts
    if (post.created_by === user.id) return true;
    
    return false;
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este post?")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('feed_posts')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting feed post:', error);
        toast.error("Erro ao excluir post");
        return;
      }

      toast.success("Post removido com sucesso!");
      loadPosts();
    } catch (error) {
      console.error('Error deleting feed post:', error);
      toast.error("Erro ao excluir post");
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in">
      {posts.length === 0 ? (
        <div className="text-center py-12 glass-card">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-white">Nenhum post disponível</h3>
          <p className="text-gray-300 mt-2">
            Clique em 'Nova Publicação' para criar seu primeiro post.
          </p>
        </div>
      ) : (
        posts.map(post => (
          <Card 
            key={post.id} 
            className="bg-black/40 backdrop-blur-xl border border-[#7B68EE]/30 hover:border-[#D946EF]/40 transition-all hover:shadow-lg cursor-pointer hover-grow"
            onClick={() => onSelectPost(post.id, 'feed')}
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-gradient">{post.title}</h3>
                
                {canEditOrDelete(post) && (
                  <div className="flex items-center">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectPost(post.id, 'feed');
                      }}
                      className="text-gray-300 hover:text-[#7B68EE] hover:bg-black/60"
                    >
                      <Edit size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(post.id);
                      }}
                      className="text-gray-300 hover:text-red-500 hover:bg-black/60"
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                )}
              </div>
              
              {post.image_url && (
                <div className="mt-4 mb-4">
                  <img 
                    src={post.image_url} 
                    alt={post.title} 
                    className="w-full h-auto max-h-64 object-contain rounded-md border border-[#7B68EE]/30"
                  />
                </div>
              )}
              
              <div className="mt-2 text-white whitespace-pre-wrap line-clamp-3 bg-black/60 p-3 rounded-md">
                {post.content}
              </div>
            </CardContent>
            
            <CardFooter className="px-6 pb-6 pt-0 flex items-center justify-between border-t border-[#7B68EE]/30 mt-4 pt-4 bg-gradient-to-r from-black/50 to-black/40">
              <div className="flex items-center gap-4 text-sm text-gray-300">
                <div className="flex items-center">
                  <Heart size={16} className={`mr-1 ${reactionCounts[post.id] ? 'fill-[#D946EF] text-[#D946EF]' : ''}`} /> 
                  {reactionCounts[post.id] || 0}
                </div>
                <div className="flex items-center">
                  <MessageSquare size={16} className="mr-1" /> 
                  {commentCounts[post.id] || 0}
                </div>
              </div>
              
              <div className="text-sm text-gray-300 flex items-center">
                <span>Por: {post.author_name || 'Usuário'}</span>
                <span className="mx-2">•</span>
                <span>{formatDate(post.created_at)}</span>
              </div>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
};

export default FeedList;
