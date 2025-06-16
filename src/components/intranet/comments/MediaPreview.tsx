
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface MediaPreviewProps {
  previewImage?: string | null;
  selectedGif?: string | null;
  onClearMedia: () => void;
}

const MediaPreview = ({ previewImage, selectedGif, onClearMedia }: MediaPreviewProps) => {
  if (!previewImage && !selectedGif) return null;

  return (
    <div className="mt-3 relative">
      <img 
        src={selectedGif || previewImage || ''} 
        alt="Prévia" 
        className="max-h-64 max-w-full rounded-md border border-white/20 object-contain" 
      />
      <Button 
        variant="ghost" 
        size="sm" 
        className="absolute top-2 right-2 bg-black/80 hover:bg-black/90 text-white rounded-full p-1 h-8 w-8"
        onClick={onClearMedia}
      >
        <X size={16} />
      </Button>
    </div>
  );
};

export default MediaPreview;
