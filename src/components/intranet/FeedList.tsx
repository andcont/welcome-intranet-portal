
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash, MessageSquare, AlertCircle, Edit } from "lucide-react";
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

  useEffect(() => {
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
  }, []);

  const handleDelete = (id: string) => {
    const updatedPosts = posts.filter(post => post.id !== id);
    setPosts(updatedPosts);
    localStorage.setItem('andcont_feed', JSON.stringify(updatedPosts));
    
    // Also remove associated comments
    const allComments = JSON.parse(localStorage.getItem('andcont_comments') || '[]');
    const filteredComments = allComments.filter(
      (comment: any) => !(comment.postId === id && comment.postType === 'feed')
    );
    localStorage.setItem('andcont_comments', JSON.stringify(filteredComments));
    
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
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-white/60 mb-4" />
          <h3 className="text-xl font-medium text-white">Nenhum post disponível</h3>
          <p className="text-white/70 mt-2">
            {isAdmin 
              ? "Clique em 'Adicionar conteúdo' para criar um novo post." 
              : "Não há posts para exibir no momento."}
          </p>
        </div>
      ) : (
        posts.map(post => (
          <Card 
            key={post.id} 
            className="bg-white/25 backdrop-blur-lg border-white/30 text-white hover:bg-white/30 transition-all cursor-pointer"
            onClick={() => onSelectPost(post.id, 'feed')}
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-white">{post.title}</h3>
                
                {isAdmin && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(post.id);
                    }}
                    className="text-white/70 hover:text-white hover:bg-white/10"
                  >
                    <Trash size={16} />
                  </Button>
                )}
              </div>
              
              {post.image && (
                <div className="mt-4 mb-4">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-auto max-h-64 object-contain rounded-md border border-white/10"
                  />
                </div>
              )}
              
              <div className="mt-2 text-white/80 whitespace-pre-wrap line-clamp-3">
                {post.content}
              </div>
            </CardContent>
            
            <CardFooter className="px-6 pb-6 pt-0 flex items-center justify-between">
              <div className="flex items-center text-sm text-white/50">
                <MessageSquare size={16} className="mr-1" /> 
                {commentCounts[post.id] || 0} comentários
              </div>
              
              <div className="text-sm text-white/50 flex items-center">
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
