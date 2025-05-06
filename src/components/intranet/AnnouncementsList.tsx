
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  createdBy: string;
}

interface AnnouncementsListProps {
  isAdmin: boolean;
}

const AnnouncementsList = ({ isAdmin }: AnnouncementsListProps) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

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
  }, []);

  const handleDelete = (id: string) => {
    const updatedAnnouncements = announcements.filter(item => item.id !== id);
    setAnnouncements(updatedAnnouncements);
    localStorage.setItem('andcont_announcements', JSON.stringify(updatedAnnouncements));
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
            className="bg-white/5 rounded-lg p-6 border border-white/10 hover:border-white/20 transition-all"
          >
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold text-white">{announcement.title}</h3>
              
              {isAdmin && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleDelete(announcement.id)}
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  <Trash size={16} />
                </Button>
              )}
            </div>
            
            <div className="mt-2 text-white/80 whitespace-pre-wrap">
              {announcement.content}
            </div>
            
            <div className="mt-4 text-sm text-white/50 flex items-center justify-between">
              <span>Por: {announcement.createdBy}</span>
              <span>{formatDate(announcement.createdAt)}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AnnouncementsList;
