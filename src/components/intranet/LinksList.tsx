
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash, AlertCircle, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface LinkItem {
  id: string;
  title: string;
  url: string;
  description: string;
  createdAt: string;
  createdBy: string;
}

interface LinksListProps {
  isAdmin: boolean;
}

const LinksList = ({ isAdmin }: LinksListProps) => {
  const [links, setLinks] = useState<LinkItem[]>([]);

  useEffect(() => {
    // Carregar links do localStorage
    const storedLinks = localStorage.getItem('andcont_links');
    if (storedLinks) {
      setLinks(JSON.parse(storedLinks));
    } else {
      // Dados iniciais de exemplo
      const initialLinks = [
        {
          id: '1',
          title: 'Site AndCont',
          url: 'https://www.andcont.com.br',
          description: 'Site institucional da AndCont',
          createdAt: new Date().toISOString(),
          createdBy: 'Administrador'
        }
      ];
      localStorage.setItem('andcont_links', JSON.stringify(initialLinks));
      setLinks(initialLinks);
    }
  }, []);

  const handleDelete = (id: string) => {
    const updatedLinks = links.filter(item => item.id !== id);
    setLinks(updatedLinks);
    localStorage.setItem('andcont_links', JSON.stringify(updatedLinks));
    toast.success("Link removido com sucesso!");
  };

  return (
    <div className="space-y-6">
      {links.length === 0 ? (
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-white/60 mb-4" />
          <h3 className="text-xl font-medium text-white">Nenhum link disponível</h3>
          <p className="text-white/70 mt-2">
            {isAdmin 
              ? "Clique em 'Adicionar conteúdo' para adicionar um novo link." 
              : "Não há links para exibir no momento."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {links.map(link => (
            <div 
              key={link.id} 
              className="bg-white/5 rounded-lg p-6 border border-white/10 hover:border-white/20 transition-all flex flex-col h-full"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-white">{link.title}</h3>
                
                {isAdmin && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDelete(link.id)}
                    className="text-white/70 hover:text-white hover:bg-white/10"
                  >
                    <Trash size={16} />
                  </Button>
                )}
              </div>
              
              <div className="mt-2 text-white/80 flex-grow">
                {link.description}
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-white/50">Por: {link.createdBy}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => window.open(link.url, '_blank')}
                  className="bg-white/10 hover:bg-white/20 text-white border-white/30"
                >
                  <ExternalLink size={14} className="mr-2" /> Acessar
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LinksList;
