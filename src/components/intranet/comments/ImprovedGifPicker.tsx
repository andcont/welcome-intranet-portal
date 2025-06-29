
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Search } from "lucide-react";

interface GifPickerProps {
  onSelectGif: (gifUrl: string) => void;
  onClose: () => void;
}

const ImprovedGifPicker = ({ onSelectGif, onClose }: GifPickerProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [gifs, setGifs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const searchGifs = async (query: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=GlVGYHkr3WSBnllca54iNt0yFbjz7L65&q=${encodeURIComponent(query)}&limit=20&rating=g&lang=pt`
      );
      const data = await response.json();
      setGifs(data.data || []);
    } catch (error) {
      console.error('Erro ao buscar GIFs:', error);
      setGifs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      searchGifs(searchTerm.trim());
    }
  };

  const getTrendingGifs = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://api.giphy.com/v1/gifs/trending?api_key=GlVGYHkr3WSBnllca54iNt0yFbjz7L65&limit=20&rating=g'
      );
      const data = await response.json();
      setGifs(data.data || []);
    } catch (error) {
      console.error('Erro ao buscar GIFs em alta:', error);
      setGifs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSearch = (term: string) => {
    setSearchTerm(term);
    searchGifs(term);
  };

  // Load trending GIFs on mount
  useEffect(() => {
    getTrendingGifs();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-black/90 backdrop-blur-xl rounded-lg border border-white/20 w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          <h3 className="text-lg font-semibold text-white">Escolher GIF</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white/70 hover:text-white"
          >
            <X size={20} />
          </Button>
        </div>

        <div className="p-4">
          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar GIFs..."
              className="bg-black/20 border-white/30 text-white placeholder:text-white/50"
            />
            <Button 
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Search size={16} />
            </Button>
          </form>

          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={getTrendingGifs}
              disabled={loading}
              className="bg-black/20 border-white/30 text-white hover:bg-white/10"
            >
              Em Alta
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickSearch('feliz')}
              disabled={loading}
              className="bg-black/20 border-white/30 text-white hover:bg-white/10"
            >
              Feliz
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickSearch('parabéns')}
              disabled={loading}
              className="bg-black/20 border-white/30 text-white hover:bg-white/10"
            >
              Parabéns
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickSearch('trabalho')}
              disabled={loading}
              className="bg-black/20 border-white/30 text-white hover:bg-white/10"
            >
              Trabalho
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickSearch('celebração')}
              disabled={loading}
              className="bg-black/20 border-white/30 text-white hover:bg-white/10"
            >
              Celebração
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickSearch('obrigado')}
              disabled={loading}
              className="bg-black/20 border-white/30 text-white hover:bg-white/10"
            >
              Obrigado
            </Button>
          </div>
        </div>

        <div className="px-4 pb-4 max-h-[50vh] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full"></div>
              <span className="ml-2 text-white/70">Carregando GIFs...</span>
            </div>
          ) : gifs.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {gifs.map((gif) => (
                <button
                  key={gif.id}
                  onClick={() => {
                    onSelectGif(gif.images.fixed_height.url);
                    onClose();
                  }}
                  className="relative overflow-hidden rounded-md hover:opacity-80 transition-opacity border border-white/10 hover:border-white/30"
                >
                  <img
                    src={gif.images.fixed_height_small.url}
                    alt={gif.title}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-2">
                    <span className="text-white text-xs truncate">{gif.title}</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-white/70">
              {searchTerm ? `Nenhum GIF encontrado para "${searchTerm}". Tente outro termo.` : 'Digite algo para buscar GIFs!'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImprovedGifPicker;
