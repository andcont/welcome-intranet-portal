
import { useState } from "react";
import { X, ZoomIn, ZoomOut, Download, Maximize, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageViewerProps {
  src: string;
  alt: string;
  onClose: () => void;
}

const ImageViewer = ({ src, alt, onClose }: ImageViewerProps) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };
  
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };
  
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = src;
    link.download = alt || 'image';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div 
      className="fixed inset-0 z-50 bg-gradient-to-br from-black/90 to-indigo-900/90 backdrop-blur-sm flex items-center justify-center p-4"
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
            className="bg-white/20 hover:bg-white/40 text-white h-9 w-9 rounded-full"
            onClick={handleZoomOut}
          >
            <ZoomOut size={18} />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-white/20 hover:bg-white/40 text-white h-9 w-9 rounded-full"
            onClick={handleZoomIn}
          >
            <ZoomIn size={18} />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-white/20 hover:bg-white/40 text-white h-9 w-9 rounded-full"
            onClick={toggleFullScreen}
          >
            {isFullScreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-white/20 hover:bg-white/40 text-white h-9 w-9 rounded-full"
            onClick={handleDownload}
          >
            <Download size={18} />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-white/20 hover:bg-white/40 text-white h-9 w-9 rounded-full"
            onClick={onClose}
          >
            <X size={18} />
          </Button>
        </div>
        
        <div className="rounded-lg overflow-hidden border border-white/20 shadow-2xl">
          <img 
            src={src} 
            alt={alt} 
            className="max-w-full max-h-screen object-contain transition-transform duration-200"
            style={{ transform: `scale(${zoomLevel})` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ImageViewer;
