
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
        className="bg-black/15 hover:bg-black/25 text-white border-white/30"
      >
        Cancelar
      </Button>
      <Button 
        type="submit"
        className="bg-gradient-to-r from-andcont-blue to-andcont-purple hover:opacity-90 text-white"
      >
        Publicar
      </Button>
    </div>
  );
};

export default FormActions;
