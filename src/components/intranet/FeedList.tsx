
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash, MessageSquare, AlertCircle, Edit, Heart } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface FeedPost {
  id: string;
  title: string;
  content: string;
  image?: string | null;
  createdAt: string;
  createdBy: string;
}

interface FeedListProps {
  isAdmin: boolean;
  onSelectPost: (id: string, type: 'feed') => void;
}

const FeedList = ({ isAdmin, onSelectPost }: FeedListProps) => {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
  const [reactionCounts, setReactionCounts] = useState<Record<string, number>>({});
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Get current user
    const userStr = localStorage.getItem("andcont_user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    // Load feed posts from localStorage
    const storedPosts = localStorage.getItem('andcont_feed');
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts));
    } else {
      // Initialize with an empty array if no posts exist
      localStorage.setItem('andcont_feed', JSON.stringify([]));
    }

    // Load comment counts
    const allComments = JSON.parse(localStorage.getItem('andcont_comments') || '[]');
    const counts: Record<string, number> = {};
    
    allComments.forEach((comment: any) => {
      if (comment.postType === 'feed') {
        counts[comment.postId] = (counts[comment.postId] || 0) + 1;
      }
    });
    
    setCommentCounts(counts);
    
    // Load reaction counts
    const allReactions = JSON.parse(localStorage.getItem('andcont_reactions') || '[]');
    const reactionCounts: Record<string, number> = {};
    
    allReactions.forEach((reaction: any) => {
      if (reaction.postType === 'feed') {
        reactionCounts[reaction.postId] = (reactionCounts[reaction.postId] || 0) + 1;
      }
    });
    
    setReactionCounts(reactionCounts);
  }, []);

  const canEditOrDelete = (post: FeedPost) => {
    if (!currentUser) return false;
    
    // Admin can edit/delete anything
    if (currentUser.role === 'admin') return true;
    
    // Regular users can only edit/delete their own feed posts
    if (post.createdBy === currentUser.name) return true;
    
    return false;
  };

  const handleDelete = (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este post?")) {
      return;
    }
    
    const updatedPosts = posts.filter(post => post.id !== id);
    setPosts(updatedPosts);
    localStorage.setItem('andcont_feed', JSON.stringify(updatedPosts));
    
    // Also remove associated comments
    const allComments = JSON.parse(localStorage.getItem('andcont_comments') || '[]');
    const filteredComments = allComments.filter(
      (comment: any) => !(comment.postId === id && comment.postType === 'feed')
    );
    localStorage.setItem('andcont_comments', JSON.stringify(filteredComments));
    
    // Also remove associated reactions
    const allReactions = JSON.parse(localStorage.getItem('andcont_reactions') || '[]');
    const filteredReactions = allReactions.filter(
      (reaction: any) => !(reaction.postId === id && reaction.postType === 'feed')
    );
    localStorage.setItem('andcont_reactions', JSON.stringify(filteredReactions));
    
    toast.success("Post removido com sucesso!");
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

  return (
    <div className="space-y-6">
      {posts.length === 0 ? (
        <div className="text-center py-12 bg-zinc-800/40 backdrop-blur-lg rounded-lg border border-zinc-700/50">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-white">Nenhum post disponível</h3>
          <p className="text-gray-300 mt-2">
            {isAdmin 
              ? "Clique em 'Adicionar conteúdo' para criar um novo post." 
              : "Não há posts para exibir no momento."}
          </p>
        </div>
      ) : (
        posts.map(post => (
          <Card 
            key={post.id} 
            className="bg-gradient-to-br from-zinc-800/60 to-zinc-900/60 backdrop-blur-xl border border-zinc-700/50 hover:border-zinc-600/50 transition-all hover:shadow-md cursor-pointer"
            onClick={() => onSelectPost(post.id, 'feed')}
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-white">{post.title}</h3>
                
                {canEditOrDelete(post) && (
                  <div className="flex items-center">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectPost(post.id, 'feed');
                        // Wait for the post detail to load, then show edit form
                        setTimeout(() => {
                          const editButton = document.querySelector('.edit-button');
                          if (editButton) {
                            (editButton as HTMLButtonElement).click();
                          }
                        }, 100);
                      }}
                      className="text-gray-400 hover:text-blue-500 hover:bg-zinc-700/50"
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
                      className="text-gray-400 hover:text-red-500 hover:bg-zinc-700/50"
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                )}
              </div>
              
              {post.image && (
                <div className="mt-4 mb-4">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-auto max-h-64 object-contain rounded-md border border-zinc-700/50"
                  />
                </div>
              )}
              
              <div className="mt-2 text-gray-200 whitespace-pre-wrap line-clamp-3 bg-zinc-800/70 p-3 rounded-md">
                {post.content}
              </div>
            </CardContent>
            
            <CardFooter className="px-6 pb-6 pt-0 flex items-center justify-between border-t border-zinc-700/50 mt-4 pt-4 bg-gradient-to-r from-zinc-900/60 to-zinc-800/60">
              <div className="flex items-center gap-4 text-sm text-gray-300">
                <div className="flex items-center">
                  <Heart size={16} className={`mr-1 ${reactionCounts[post.id] ? 'fill-red-500 text-red-500' : ''}`} /> 
                  {reactionCounts[post.id] || 0}
                </div>
                <div className="flex items-center">
                  <MessageSquare size={16} className="mr-1" /> 
                  {commentCounts[post.id] || 0}
                </div>
              </div>
              
              <div className="text-sm text-gray-300 flex items-center">
                <span>Por: {post.createdBy}</span>
                <span className="mx-2">•</span>
                <span>{formatDate(post.createdAt)}</span>
              </div>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
};

export default FeedList;
