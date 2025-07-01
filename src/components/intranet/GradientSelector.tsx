
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { Check, X } from "lucide-react";

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
    <div className="w-80 max-h-96 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Personalizar Tema</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-white hover:bg-white/10 rounded-full w-8 h-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-3">
        {gradientOptions.map((gradient) => (
          <div
            key={gradient.id}
            className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-300 transform hover:scale-105 ${
              selectedGradient.id === gradient.id 
                ? 'border-white/60 shadow-lg scale-105' 
                : 'border-white/20 hover:border-white/40'
            }`}
            onClick={() => handleGradientSelect(gradient)}
          >
            <div className={`h-16 ${gradient.value} relative`}>
              <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-between px-4">
                <span className="text-white font-medium text-sm">{gradient.name}</span>
                {selectedGradient.id === gradient.id && (
                  <div className="bg-white/20 backdrop-blur-md rounded-full p-1">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-white/20">
        <p className="text-xs text-white/60 text-center">
          As alterações são aplicadas imediatamente
        </p>
      </div>
    </div>
  );
};

export default GradientSelector;
