
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FormHeaderProps {
  activeCategory: string;
  onClose: () => void;
}

const FormHeader = ({ activeCategory, onClose }: FormHeaderProps) => {
  const getTitle = () => {
    switch (activeCategory) {
      case 'announcements': return 'Novo Comunicado';
      case 'links': return 'Novo Link';
      case 'calendar': return 'Novo Evento';
      case 'feed': return 'Novo Post';
      default: return 'Novo Item';
    }
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-xl font-bold text-white">
        {getTitle()}
      </h3>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onClose}
        className="text-white/70 hover:text-white hover:bg-white/10"
      >
        <X size={18} />
      </Button>
    </div>
  );
};

export default FormHeader;
