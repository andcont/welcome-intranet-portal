
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash, AlertCircle, MessageSquare } from "lucide-react";
import { toast } from "sonner";

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

  useEffect(() => {
    // Carregar anúncios do localStorage
    const storedAnnouncements = localStorage.getItem('andcont_announcements');
    if (storedAnnouncements) {
      setAnnouncements(JSON.parse(storedAnnouncements));
    } else {
      // Dados iniciais de exemplo
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
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent click
    const updatedAnnouncements = announcements.filter(item => item.id !== id);
    setAnnouncements(updatedAnnouncements);
    localStorage.setItem('andcont_announcements', JSON.stringify(updatedAnnouncements));
    
    // Also remove associated comments
    const allComments = JSON.parse(localStorage.getItem('andcont_comments') || '[]');
    const filteredComments = allComments.filter(
      (comment: any) => !(comment.postId === id && comment.postType === 'announcement')
    );
    localStorage.setItem('andcont_comments', JSON.stringify(filteredComments));
    
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
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-white/60 mb-4" />
          <h3 className="text-xl font-medium text-white">Nenhum comunicado disponível</h3>
          <p className="text-white/70 mt-2">
            {isAdmin 
              ? "Clique em 'Adicionar conteúdo' para criar um novo comunicado." 
              : "Não há comunicados para exibir no momento."}
          </p>
        </div>
      ) : (
        announcements.map(announcement => (
          <div 
            key={announcement.id} 
            className="bg-white/25 backdrop-blur-lg rounded-lg p-6 border border-white/30 hover:bg-white/30 transition-all cursor-pointer"
            onClick={() => onSelectPost(announcement.id)}
          >
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold text-white">{announcement.title}</h3>
              
              {isAdmin && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={(e) => handleDelete(announcement.id, e)}
                  className="text-white/70 hover:text-white hover:bg-white/10"
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
                  className="w-full h-auto max-h-64 object-contain rounded-md border border-white/10"
                />
              </div>
            )}
            
            <div className="mt-2 text-white/80 whitespace-pre-wrap line-clamp-3">
              {announcement.content}
            </div>
            
            <div className="mt-4 flex items-center justify-between text-sm text-white/50">
              <div className="flex items-center">
                <MessageSquare size={16} className="mr-1" /> 
                {commentCounts[announcement.id] || 0} comentários
              </div>
              <div className="flex items-center">
                <span>Por: {announcement.createdBy}</span>
                <span className="mx-2">•</span>
                <span>{formatDate(announcement.createdAt)}</span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AnnouncementsList;
