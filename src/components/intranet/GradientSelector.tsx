
import { useTheme, gradientOptions } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Check, Palette } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const GradientSelector = () => {
  const { selectedGradient, setSelectedGradient } = useTheme();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 bg-black/40 border border-[#7B68EE]/30 hover:bg-black/60"
          title="Alterar tema do site"
        >
          <div className={`w-4 h-4 rounded-full ${selectedGradient.value.replace('/30', '')}`}></div>
          <Palette size={16} className="ml-1" />
          <span className="ml-1 hidden sm:inline">Tema</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4 bg-black/80 backdrop-blur-xl border border-[#7B68EE]/30 max-h-96 overflow-y-auto">
        <div className="space-y-3">
          <h4 className="font-bold text-sm text-gradient mb-3">Selecionar Tema do Site</h4>
          <div className="grid grid-cols-4 gap-3">
            {gradientOptions.map((gradient) => (
              <button
                key={gradient.id}
                className={`w-16 h-16 rounded-lg flex items-center justify-center transition-all ${gradient.value} border ${
                  selectedGradient.id === gradient.id
                    ? "border-[#D946EF] ring-2 ring-[#D946EF]/50"
                    : "border-white/10 hover:border-white/30"
                }`}
                onClick={() => setSelectedGradient(gradient)}
                title={gradient.name}
              >
                {selectedGradient.id === gradient.id && (
                  <Check size={20} className="text-white drop-shadow-lg" />
                )}
              </button>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-[#7B68EE]/30">
            <p className="text-xs text-gray-300">Tema atual: {selectedGradient.name}</p>
            <p className="text-xs text-gray-400 mt-1">O tema será aplicado em todo o site</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default GradientSelector;
