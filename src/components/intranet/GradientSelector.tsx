
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { Check, X, Sparkles, Palette } from "lucide-react";

interface GradientSelectorProps {
  onClose: () => void;
}

const GradientSelector = ({ onClose }: GradientSelectorProps) => {
  const { selectedGradient, setSelectedGradient, gradientOptions } = useTheme();

  const handleGradientSelect = (gradient: any) => {
    setSelectedGradient(gradient);
    onClose();
  };

  return (
    <div className="w-96 max-h-[32rem] overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Palette className="h-6 w-6 text-white" />
            <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-yellow-400 animate-pulse" />
          </div>
          <h3 className="text-xl font-bold text-white">Temas AndCont</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-white hover:bg-white/20 rounded-full w-10 h-10 p-0 transition-all duration-300"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="space-y-4">
        {gradientOptions.map((gradient) => (
          <div
            key={gradient.id}
            className={`relative cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-500 transform hover:scale-105 hover:rotate-1 ${
              selectedGradient.id === gradient.id 
                ? 'border-white shadow-2xl scale-105 ring-4 ring-white/30' 
                : 'border-white/30 hover:border-white/60 hover:shadow-xl'
            }`}
            onClick={() => handleGradientSelect(gradient)}
          >
            <div className={`h-20 ${gradient.value} relative`}>
              <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-between px-6">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-white/60 rounded-full animate-pulse"></div>
                  <span className="text-white font-bold text-base drop-shadow-lg">{gradient.name}</span>
                </div>
                {selectedGradient.id === gradient.id && (
                  <div className="bg-white/30 backdrop-blur-md rounded-full p-2 animate-in zoom-in-50">
                    <Check className="h-5 w-5 text-white drop-shadow" />
                  </div>
                )}
              </div>
              {/* Animated sparkles for selected gradient */}
              {selectedGradient.id === gradient.id && (
                <>
                  <Sparkles className="absolute top-2 right-2 h-4 w-4 text-yellow-300 animate-ping" />
                  <Sparkles className="absolute bottom-2 left-2 h-3 w-3 text-white animate-pulse" />
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-white/20">
        <div className="flex items-center justify-center space-x-2">
          <Sparkles className="h-4 w-4 text-yellow-400 animate-pulse" />
          <p className="text-sm text-white/80 text-center font-medium">
            Mudanças aplicadas instantaneamente
          </p>
          <Sparkles className="h-4 w-4 text-yellow-400 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default GradientSelector;
