
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
        className="bg-white/50 hover:bg-white/60 text-gray-700 border-gray-200/50"
      >
        Cancelar
      </Button>
      <Button 
        type="submit"
        className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-90 text-white shadow-sm"
      >
        Publicar
      </Button>
    </div>
  );
};

export default FormActions;
