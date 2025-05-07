
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onCancel: () => void;
}

const FormActions = ({ onCancel }: FormActionsProps) => {
  return (
    <div className="flex justify-end gap-4 pt-2">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        className="bg-white/10 hover:bg-white/20 text-white border-white/30"
      >
        Cancelar
      </Button>
      <Button 
        type="submit"
        className="bg-gradient-andcont hover:opacity-90 transition-opacity"
      >
        Publicar
      </Button>
    </div>
  );
};

export default FormActions;
