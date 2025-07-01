
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserCheck, Edit, Trash2, Calendar, User } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface HRPost {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  image_url?: string;
  profiles?: {
    name: string;
  };
}

interface HRListProps {
  isAdmin: boolean;
  onSelectPost: (id: string) => void;
}

const HRList = ({ isAdmin, onSelectPost }: HRListProps) => {
  const [hrPosts, setHrPosts] = useState<HRPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchHRPosts = async () => {
    try {
      // First get HR posts
      const { data: hrPostsData, error: hrPostsError } = await supabase
        .from('hr_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (hrPostsError) {
        console.error('Error fetching HR posts:', hrPostsError);
        toast.error("Erro ao carregar publicações de RH");
        return;
      }

      // Then get profiles for the creators
      const creatorIds = hrPostsData?.map(post => post.created_by) || [];
      let profilesData: any[] = [];
      
      if (creatorIds.length > 0) {
        const { data, error: profilesError } = await supabase
          .from('profiles')
          .select('id, name')
          .in('id', creatorIds);
        
        if (!profilesError) {
          profilesData = data || [];
        }
      }

      // Combine the data
      const combinedData = hrPostsData?.map(post => ({
        ...post,
        profiles: profilesData.find(profile => profile.id === post.created_by) || null
      })) || [];

      setHrPosts(combinedData);
    } catch (error) {
      console.error('Error fetching HR posts:', error);
      toast.error("Erro ao carregar publicações de RH");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHRPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta publicação de RH?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('hr_posts')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting HR post:', error);
        toast.error("Erro ao excluir publicação");
        return;
      }

      toast.success("Publicação excluída com sucesso!");
      fetchHRPosts();
    } catch (error) {
      console.error('Error deleting HR post:', error);
      toast.error("Erro ao excluir publicação");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full"></div>
        <span className="ml-3 text-white">Carregando publicações de RH...</span>
      </div>
    );
  }

  if (hrPosts.length === 0) {
    return (
      <div className="text-center py-12">
        <UserCheck className="mx-auto h-16 w-16 text-white/40 mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Nenhuma publicação de RH</h3>
        <p className="text-white/70">
          {isAdmin 
            ? "Clique em 'Nova Publicação RH' para adicionar a primeira publicação."
            : "Não há publicações de RH disponíveis no momento."
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {hrPosts.map((post) => (
        <Card key={post.id} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle 
                  className="text-white text-lg mb-2 cursor-pointer hover:text-purple-300 transition-colors"
                  onClick={() => onSelectPost(post.id)}
                >
                  {post.title}
                </CardTitle>
                <div className="flex items-center gap-4 text-sm text-white/70">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{post.profiles?.name || 'Admin'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {format(new Date(post.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </span>
                  </div>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
                <UserCheck className="h-3 w-3 mr-1" />
                RH
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <p 
              className="text-white/90 mb-4 line-clamp-3 cursor-pointer hover:text-white transition-colors"
              onClick={() => onSelectPost(post.id)}
            >
              {post.content}
            </p>
            
            {post.image_url && (
              <div className="mb-4">
                <img 
                  src={post.image_url} 
                  alt="Imagem da publicação" 
                  className="rounded-lg max-h-48 w-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => onSelectPost(post.id)}
                />
              </div>
            )}
            
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onSelectPost(post.id)}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                Ver detalhes
              </Button>
              
              {isAdmin && user?.id === post.created_by && (
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onSelectPost(post.id)}
                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDelete(post.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default HRList;
