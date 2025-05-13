
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
        >
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#7B68EE] to-[#D946EF]"></div>
          <Palette size={16} className="ml-1" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3 bg-black/80 backdrop-blur-xl border border-[#7B68EE]/30">
        <div className="space-y-2">
          <h4 className="font-bold text-sm text-gradient mb-2">Selecionar Tema</h4>
          <div className="grid grid-cols-4 gap-2">
            {gradientOptions.map((gradient) => (
              <button
                key={gradient.id}
                className={`w-12 h-12 rounded-md flex items-center justify-center transition-all ${gradient.value} border ${
                  selectedGradient.id === gradient.id
                    ? "border-[#D946EF] ring-2 ring-[#D946EF]/50"
                    : "border-white/10 hover:border-white/30"
                }`}
                onClick={() => setSelectedGradient(gradient)}
                title={gradient.name}
              >
                {selectedGradient.id === gradient.id && (
                  <Check size={16} className="text-white" />
                )}
              </button>
            ))}
          </div>
          <div className="mt-2 pt-2 border-t border-[#7B68EE]/30">
            <p className="text-xs text-gray-300">Tema selecionado: {selectedGradient.name}</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default GradientSelector;
