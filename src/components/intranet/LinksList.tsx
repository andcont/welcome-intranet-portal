
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash, Link, AlertCircle, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface LinkItem {
  id: string;
  title: string;
  url: string;
  description: string;
  image?: string | null;
  createdAt: string;
  createdBy: string;
}

interface LinksListProps {
  isAdmin: boolean;
  onSelectPost: (id: string) => void;
}

const LinksList = ({ isAdmin, onSelectPost }: LinksListProps) => {
  const [links, setLinks] = useState<LinkItem[]>([]);
  
  useEffect(() => {
    // Load links from localStorage
    const storedLinks = localStorage.getItem('andcont_links');
    if (storedLinks) {
      setLinks(JSON.parse(storedLinks));
    } else {
      // Sample initial data
      const initialLinks = [
        {
          id: '1',
          title: 'Portal AndCont',
          url: 'https://www.andcont.com.br',
          description: 'Link oficial para o site da AndCont.',
          createdAt: new Date().toISOString(),
          createdBy: 'Administrador'
        }
      ];
      localStorage.setItem('andcont_links', JSON.stringify(initialLinks));
      setLinks(initialLinks);
    }
  }, []);

  const handleDelete = (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este link?")) {
      return;
    }
    
    const updatedLinks = links.filter(item => item.id !== id);
    setLinks(updatedLinks);
    localStorage.setItem('andcont_links', JSON.stringify(updatedLinks));
    toast.success("Link removido com sucesso!");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  const openExternalLink = (e: React.MouseEvent<HTMLButtonElement>, url: string) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {links.length === 0 ? (
        <div className="col-span-full text-center py-12 bg-black/40 backdrop-blur-xl rounded-lg border border-white/20 shadow-lg">
          <AlertCircle className="mx-auto h-12 w-12 text-white/80 mb-4" />
          <h3 className="text-xl font-medium text-white">Nenhum link disponível</h3>
          <p className="text-white/80">
            {isAdmin 
              ? "Clique em 'Adicionar conteúdo' para criar um novo link." 
              : "Não há links para exibir no momento."}
          </p>
        </div>
      ) : (
        links.map(link => (
          <div 
            key={link.id} 
            className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-lg overflow-hidden hover:shadow-lg transition-all hover:border-white/40 flex flex-col h-full"
          >
            {link.image && (
              <div className="w-full h-32 relative">
                <img 
                  src={link.image} 
                  alt={link.title} 
                  className="w-full h-full object-cover border-b border-white/20" 
                />
              </div>
            )}
            
            <div 
              className="p-5 flex-grow cursor-pointer hover:bg-white/5 transition-colors"
              onClick={() => onSelectPost(link.id)}
            >
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-white flex items-center">
                  <Link size={16} className="mr-2 inline-flex text-white/80" />
                  {link.title}
                </h3>
                
                {isAdmin && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(link.id);
                    }}
                    className="text-white/70 hover:text-red-300 hover:bg-white/10"
                  >
                    <Trash size={16} />
                  </Button>
                )}
              </div>
              
              <p className="mt-2 text-white/90 text-sm">
                {link.description}
              </p>
              
              <div className="mt-4 flex justify-between items-center text-xs text-white/80">
                <span>Por: {link.createdBy}</span>
                <span>{formatDate(link.createdAt)}</span>
              </div>
            </div>
            
            <div className="p-4 border-t border-white/20 bg-black/30">
              <button 
                onClick={(e) => openExternalLink(e, link.url)}
                className="inline-flex items-center justify-center w-full py-2 px-3 rounded-md bg-white/15 hover:bg-white/25 text-white transition-colors"
              >
                <span>Acessar link</span>
                <ExternalLink size={14} className="ml-2" />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default LinksList;
