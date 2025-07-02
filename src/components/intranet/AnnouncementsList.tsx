
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash, AlertCircle, MessageSquare, Heart } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import UserName from "@/components/ui/UserName";

interface Announcement {
  id: string;
  title: string;
  content: string;
  image_url?: string | null;
  created_at: string;
  created_by: string;
  author_name?: string;
}

interface AnnouncementsListProps {
  isAdmin: boolean;
  onSelectPost: (id: string) => void;
  onUserClick?: (userId: string) => void;
}

const AnnouncementsList = ({ isAdmin, onSelectPost, onUserClick }: AnnouncementsListProps) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
  const [reactionCounts, setReactionCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const loadAnnouncements = async () => {
    try {
      console.log('Loading announcements...');
      const { data: announcementsData, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading announcements:', error);
        toast.error("Erro ao carregar comunicados");
        return;
      }

      console.log('Announcements loaded:', announcementsData);

      if (!announcementsData || announcementsData.length === 0) {
        setAnnouncements([]);
        setLoading(false);
        return;
      }

      // Load profiles for authors
      const authorIds = [...new Set(announcementsData.map(a => a.created_by))];
      console.log('Loading profiles for authors:', authorIds);
      
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name')
        .in('id', authorIds);

      if (profilesError) {
        console.error('Error loading profiles:', profilesError);
        // Continue without profile names
      }

      console.log('Profiles loaded:', profilesData);

      const profilesMap = new Map(profilesData?.map(p => [p.id, p.name]) || []);

      const enrichedAnnouncements = announcementsData.map(announcement => ({
        ...announcement,
        author_name: profilesMap.get(announcement.created_by) || 'Usuário'
      }));

      setAnnouncements(enrichedAnnouncements);
    } catch (error) {
      console.error('Error loading announcements:', error);
      toast.error("Erro ao carregar comunicados");
    } finally {
      setLoading(false);
    }
  };

  const loadCommentCounts = async () => {
    try {
      console.log('Loading comment counts...');
      const { data, error } = await supabase
        .from('comments')
        .select('post_id')
        .eq('post_type', 'announcement');

      if (!error && data) {
        const counts: Record<string, number> = {};
        data.forEach((comment) => {
          counts[comment.post_id] = (counts[comment.post_id] || 0) + 1;
        });
        setCommentCounts(counts);
        console.log('Comment counts loaded:', counts);
      }
    } catch (error) {
      console.error('Error loading comment counts:', error);
    }
  };

  const loadReactionCounts = async () => {
    try {
      console.log('Loading reaction counts...');
      const { data, error } = await supabase
        .from('reactions')
        .select('post_id')
        .eq('post_type', 'announcement');

      if (!error && data) {
        const counts: Record<string, number> = {};
        data.forEach((reaction) => {
          counts[reaction.post_id] = (counts[reaction.post_id] || 0) + 1;
        });
        setReactionCounts(counts);
        console.log('Reaction counts loaded:', counts);
      }
    } catch (error) {
      console.error('Error loading reaction counts:', error);
    }
  };

  useEffect(() => {
    loadAnnouncements();
    loadCommentCounts();
    loadReactionCounts();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm("Tem certeza que deseja excluir este comunicado?")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting announcement:', error);
        toast.error("Erro ao excluir comunicado");
        return;
      }

      toast.success("Comunicado removido com sucesso!");
      loadAnnouncements();
    } catch (error) {
      console.error('Error deleting announcement:', error);
      toast.error("Erro ao excluir comunicado");
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
      {announcements.length === 0 ? (
        <div className="text-center py-12 glass-card">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-white">Nenhum comunicado disponível</h3>
          <p className="text-gray-300 mt-2">
            {isAdmin 
              ? "Clique em 'Adicionar' para criar um novo comunicado." 
              : "Não há comunicados para exibir no momento."}
          </p>
        </div>
      ) : (
        announcements.map(announcement => (
          <Card 
            key={announcement.id} 
            className="bg-black/40 backdrop-blur-xl border border-[#7B68EE]/30 hover:border-[#D946EF]/40 transition-all hover:shadow-lg cursor-pointer"
            onClick={() => {
              console.log('Clicking on announcement:', announcement.id);
              onSelectPost(announcement.id);
            }}
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-gradient">{announcement.title}</h3>
                
                {isAdmin && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => handleDelete(announcement.id, e)}
                    className="text-gray-300 hover:text-red-500 hover:bg-black/60"
                  >
                    <Trash size={16} />
                  </Button>
                )}
              </div>
              
              {announcement.image_url && (
                <div className="mt-4 mb-4">
                  <img 
                    src={announcement.image_url} 
                    alt={announcement.title} 
                    className="w-full h-auto max-h-64 object-contain rounded-md border border-[#7B68EE]/30"
                  />
                </div>
              )}
              
              <div className="mt-2 text-white whitespace-pre-wrap line-clamp-3 bg-black/60 p-3 rounded-md">
                {announcement.content}
              </div>
            </CardContent>
            
            <CardFooter className="px-6 pb-6 pt-0 flex items-center justify-between border-t border-[#7B68EE]/30 mt-4 pt-4 bg-gradient-to-r from-black/50 to-black/40">
              <div className="flex items-center gap-4 text-sm text-gray-300">
                <div className="flex items-center">
                  <Heart size={16} className={`mr-1 ${reactionCounts[announcement.id] ? 'fill-[#D946EF] text-[#D946EF]' : ''}`} /> 
                  {reactionCounts[announcement.id] || 0}
                </div>
                <div className="flex items-center">
                  <MessageSquare size={16} className="mr-1" /> 
                  {commentCounts[announcement.id] || 0}
                </div>
              </div>
              
              <div className="text-sm text-gray-300 flex items-center">
                <span>Por: </span>
                {onUserClick ? (
                  <UserName 
                    name={announcement.author_name || 'Usuário'} 
                    userId={announcement.created_by} 
                    onUserClick={onUserClick}
                  />
                ) : (
                  <span>{announcement.author_name || 'Usuário'}</span>
                )}
                <span className="mx-2">•</span>
                <span>{formatDate(announcement.created_at)}</span>
              </div>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
};

export default AnnouncementsList;
