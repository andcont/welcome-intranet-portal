
import { useState } from "react";
import { X, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageViewerProps {
  src: string;
  alt: string;
  onClose: () => void;
}

const ImageViewer = ({ src, alt, onClose }: ImageViewerProps) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };
  
  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="relative max-w-screen-lg max-h-screen overflow-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-white/20 hover:bg-white/40 text-white h-9 w-9"
            onClick={handleZoomOut}
          >
            <ZoomOut size={18} />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-white/20 hover:bg-white/40 text-white h-9 w-9"
            onClick={handleZoomIn}
          >
            <ZoomIn size={18} />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-white/20 hover:bg-white/40 text-white h-9 w-9"
            onClick={onClose}
          >
            <X size={18} />
          </Button>
        </div>
        
        <img 
          src={src} 
          alt={alt} 
          className="max-w-full max-h-screen object-contain transition-transform duration-200"
          style={{ transform: `scale(${zoomLevel})` }}
        />
      </div>
    </div>
  );
};

export default ImageViewer;
