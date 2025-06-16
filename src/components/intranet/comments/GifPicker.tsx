
import { useState } from "react";

interface GifPickerProps {
  onSelectGif: (gifUrl: string) => void;
  isVisible: boolean;
}

const POPULAR_GIFS = [
  "https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif",
  "https://media.giphy.com/media/l0MYC0LajbaPoEADu/giphy.gif",
  "https://media.giphy.com/media/26u4cqiYI30juCOGY/giphy.gif",
  "https://media.giphy.com/media/3o6Zt6KHxJTbXCnSvu/giphy.gif",
  "https://media.giphy.com/media/3og0IMHaMAAg8OYj1S/giphy.gif",
  "https://media.giphy.com/media/26BRBKqUiq586bRVm/giphy.gif",
  "https://media.giphy.com/media/26AHPxxnSw1L9T1rW/giphy.gif",
  "https://media.giphy.com/media/26FLgGTPUDH6UGAbm/giphy.gif",
  "https://media.giphy.com/media/3o6ZtaO9BZHcOjmErm/giphy.gif",
  "https://media.giphy.com/media/26u4lOMA8JKSnL9Uk/giphy.gif",
];

const GifPicker = ({ onSelectGif, isVisible }: GifPickerProps) => {
  const [gifs, setGifs] = useState<string[]>(POPULAR_GIFS);
  const [isLoadingGifs, setIsLoadingGifs] = useState(false);
  const [gifSearchQuery, setGifSearchQuery] = useState("");

  const searchGifs = async (query: string) => {
    if (!query.trim()) {
      setGifs(POPULAR_GIFS);
      return;
    }

    setIsLoadingGifs(true);
    
    setTimeout(() => {
      const searchResults = POPULAR_GIFS.map(gif => 
        gif.replace('giphy.gif', `giphy.gif?search=${encodeURIComponent(query)}`)
      );
      setGifs(searchResults);
      setIsLoadingGifs(false);
    }, 500);
  };

  if (!isVisible) return null;

  return (
    <div className="mt-4 p-4 bg-black/40 backdrop-blur-xl rounded-lg border border-white/20">
      <div className="mb-3">
        <input
          type="text"
          placeholder="Pesquisar GIFs..."
          value={gifSearchQuery}
          onChange={(e) => {
            setGifSearchQuery(e.target.value);
            searchGifs(e.target.value);
          }}
          className="w-full p-2 bg-black/60 text-white border border-white/20 rounded-md placeholder:text-white/60"
        />
      </div>
      
      {isLoadingGifs ? (
        <div className="text-center py-4 text-white/60">
          Carregando GIFs...
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-60 overflow-y-auto">
          {gifs.map((gif, index) => (
            <img
              key={index}
              src={gif}
              alt={`GIF ${index + 1}`}
              className="cursor-pointer hover:opacity-80 rounded-md h-20 w-full object-cover border border-white/10 hover:border-white/30 transition-all"
              onClick={() => onSelectGif(gif)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default GifPicker;
