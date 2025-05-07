
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash, AlertCircle, ExternalLink, MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface Link {
  id: string;
  title: string;
  url: string;
  description?: string;
  image?: string | null;
  createdAt: string;
  createdBy: string;
}

interface LinksListProps {
  isAdmin: boolean;
  onSelectPost: (id: string, type: 'link') => void;
}

const LinksList = ({ isAdmin, onSelectPost }: LinksListProps) => {
  const [links, setLinks] = useState<Link[]>([]);
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    // Load links from localStorage
    const storedLinks = localStorage.getItem('andcont_links');
    if (storedLinks) {
      setLinks(JSON.parse(storedLinks));
    } else {
      // Initialize with an empty array
      localStorage.setItem('andcont_links', JSON.stringify([]));
    }

    // Load comment counts
    const allComments = JSON.parse(localStorage.getItem('andcont_comments') || '[]');
    const counts: Record<string, number> = {};
    
    allComments.forEach((comment: any) => {
      if (comment.postType === 'link') {
        counts[comment.postId] = (counts[comment.postId] || 0) + 1;
      }
    });
    
    setCommentCounts(counts);
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent click
    const updatedLinks = links.filter(link => link.id !== id);
    setLinks(updatedLinks);
    localStorage.setItem('andcont_links', JSON.stringify(updatedLinks));
    
    // Also remove associated comments
    const allComments = JSON.parse(localStorage.getItem('andcont_comments') || '[]');
    const filteredComments = allComments.filter(
      (comment: any) => !(comment.postId === id && comment.postType === 'link')
    );
    localStorage.setItem('andcont_comments', JSON.stringify(filteredComments));
    
    toast.success("Link removido com sucesso!");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {links.length === 0 ? (
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-white/60 mb-4" />
          <h3 className="text-xl font-medium text-white">Nenhum link disponível</h3>
          <p className="text-white/70 mt-2">
            {isAdmin 
              ? "Clique em 'Adicionar conteúdo' para criar um novo link." 
              : "Não há links para exibir no momento."}
          </p>
        </div>
      ) : (
        links.map(link => (
          <div 
            key={link.id} 
            className="bg-white/40 backdrop-blur-lg rounded-lg p-6 border border-white/30 hover:bg-white/50 transition-all cursor-pointer"
            onClick={() => onSelectPost(link.id, 'link')}
          >
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold text-white">{link.title}</h3>
              
              {isAdmin && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={(e) => handleDelete(link.id, e)}
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  <Trash size={16} />
                </Button>
              )}
            </div>
            
            {link.image && (
              <div className="mt-4 mb-4">
                <img 
                  src={link.image} 
                  alt={link.title} 
                  className="w-full h-auto max-h-64 object-contain rounded-md"
                />
              </div>
            )}
            
            <div className="mt-2 text-white/80">
              {link.description}
            </div>
            
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
              <a 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 rounded-md bg-white/20 hover:bg-white/30 text-white transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink size={16} className="mr-2" /> Acessar
              </a>
              
              <div className="flex items-center space-x-4 text-sm text-white/70">
                <div className="flex items-center">
                  <MessageSquare size={16} className="mr-1" /> 
                  {commentCounts[link.id] || 0}
                </div>
                <span>Por: {link.createdBy}</span>
                <span>{formatDate(link.createdAt)}</span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default LinksList;
