
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
      >
        Cancelar
      </Button>
      <Button 
        type="submit"
        variant="default"
      >
        Publicar
      </Button>
    </div>
  );
};

export default FormActions;
