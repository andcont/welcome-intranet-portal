
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash, AlertCircle, MessageSquare, Heart } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface Announcement {
  id: string;
  title: string;
  content: string;
  image?: string | null;
  createdAt: string;
  createdBy: string;
}

interface AnnouncementsListProps {
  isAdmin: boolean;
  onSelectPost: (id: string) => void;
}

const AnnouncementsList = ({ isAdmin, onSelectPost }: AnnouncementsListProps) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
  const [reactionCounts, setReactionCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    // Load announcements from localStorage
    const storedAnnouncements = localStorage.getItem('andcont_announcements');
    if (storedAnnouncements) {
      setAnnouncements(JSON.parse(storedAnnouncements));
    } else {
      // Sample initial data
      const initialAnnouncements = [
        {
          id: '1',
          title: 'Bem-vindo à nova Intranet',
          content: 'Esta é a nova plataforma de comunicação interna da AndCont. Aqui você encontrará todas as informações importantes da empresa.',
          createdAt: new Date().toISOString(),
          createdBy: 'Administrador'
        }
      ];
      localStorage.setItem('andcont_announcements', JSON.stringify(initialAnnouncements));
      setAnnouncements(initialAnnouncements);
    }

    // Load comment counts
    const allComments = JSON.parse(localStorage.getItem('andcont_comments') || '[]');
    const counts: Record<string, number> = {};
    
    allComments.forEach((comment: any) => {
      if (comment.postType === 'announcement') {
        counts[comment.postId] = (counts[comment.postId] || 0) + 1;
      }
    });
    
    setCommentCounts(counts);
    
    // Load reaction counts
    const allReactions = JSON.parse(localStorage.getItem('andcont_reactions') || '[]');
    const reactionCounts: Record<string, number> = {};
    
    allReactions.forEach((reaction: any) => {
      if (reaction.postType === 'announcement') {
        reactionCounts[reaction.postId] = (reactionCounts[reaction.postId] || 0) + 1;
      }
    });
    
    setReactionCounts(reactionCounts);
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent click
    
    if (!confirm("Tem certeza que deseja excluir este comunicado?")) {
      return;
    }
    
    const updatedAnnouncements = announcements.filter(item => item.id !== id);
    setAnnouncements(updatedAnnouncements);
    localStorage.setItem('andcont_announcements', JSON.stringify(updatedAnnouncements));
    
    // Also remove associated comments
    const allComments = JSON.parse(localStorage.getItem('andcont_comments') || '[]');
    const filteredComments = allComments.filter(
      (comment: any) => !(comment.postId === id && comment.postType === 'announcement')
    );
    localStorage.setItem('andcont_comments', JSON.stringify(filteredComments));
    
    // Also remove associated reactions
    const allReactions = JSON.parse(localStorage.getItem('andcont_reactions') || '[]');
    const filteredReactions = allReactions.filter(
      (reaction: any) => !(reaction.postId === id && reaction.postType === 'announcement')
    );
    localStorage.setItem('andcont_reactions', JSON.stringify(filteredReactions));
    
    toast.success("Comunicado removido com sucesso!");
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
      {announcements.length === 0 ? (
        <div className="text-center py-12 bg-gradient-to-br from-andcont-purple/30 to-andcont-pink/30 backdrop-blur-lg rounded-lg border border-white/20">
          <AlertCircle className="mx-auto h-12 w-12 text-white/80 mb-4" />
          <h3 className="text-xl font-medium text-white">Nenhum comunicado disponível</h3>
          <p className="text-white/80 mt-2">
            {isAdmin 
              ? "Clique em 'Adicionar conteúdo' para criar um novo comunicado." 
              : "Não há comunicados para exibir no momento."}
          </p>
        </div>
      ) : (
        announcements.map(announcement => (
          <Card 
            key={announcement.id} 
            className="bg-gradient-to-br from-andcont-purple/30 to-andcont-pink/30 backdrop-blur-xl border border-white/30 hover:border-white/50 transition-all hover:shadow-lg cursor-pointer text-white"
            onClick={() => onSelectPost(announcement.id)}
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-white">{announcement.title}</h3>
                
                {isAdmin && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => handleDelete(announcement.id, e)}
                    className="text-white/70 hover:text-red-300 hover:bg-white/10"
                  >
                    <Trash size={16} />
                  </Button>
                )}
              </div>
              
              {announcement.image && (
                <div className="mt-4 mb-4">
                  <img 
                    src={announcement.image} 
                    alt={announcement.title} 
                    className="w-full h-auto max-h-64 object-contain rounded-md border border-white/20"
                  />
                </div>
              )}
              
              <div className="mt-2 text-white/90 whitespace-pre-wrap line-clamp-3">
                {announcement.content}
              </div>
            </CardContent>
            
            <CardFooter className="px-6 pb-6 pt-0 flex items-center justify-between border-t border-white/20 mt-4 pt-4 bg-gradient-to-r from-white/5 to-white/10">
              <div className="flex items-center gap-4 text-sm text-white/90">
                <div className="flex items-center">
                  <Heart size={16} className={`mr-1 ${reactionCounts[announcement.id] ? 'fill-red-300 text-red-300' : ''}`} /> 
                  {reactionCounts[announcement.id] || 0}
                </div>
                <div className="flex items-center">
                  <MessageSquare size={16} className="mr-1" /> 
                  {commentCounts[announcement.id] || 0}
                </div>
              </div>
              
              <div className="text-sm text-white/80 flex items-center">
                <span>Por: {announcement.createdBy}</span>
                <span className="mx-2">•</span>
                <span>{formatDate(announcement.createdAt)}</span>
              </div>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
};

export default AnnouncementsList;
