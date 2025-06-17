
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

interface FormActionsProps {
  onCancel: () => void;
}

const FormActions = ({ onCancel }: FormActionsProps) => {
  const { selectedGradient } = useTheme();
  
  return (
    <div className="flex justify-end gap-4 pt-2">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        className="bg-white/50 hover:bg-white/60 text-gray-700 border-gray-200/50"
      >
        Cancelar
      </Button>
      <Button 
        type="submit"
        className={`${selectedGradient.buttonGradient} ${selectedGradient.hoverColor} text-white shadow-sm transition-all duration-200`}
      >
        Publicar
      </Button>
    </div>
  );
};

export default FormActions;
