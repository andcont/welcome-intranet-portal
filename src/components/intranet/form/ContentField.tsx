
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ContentFieldProps {
  content: string;
  onChange: (value: string) => void;
  activeCategory: string;
}

const ContentField = ({ content, onChange, activeCategory }: ContentFieldProps) => {
  const getLabel = () => {
    switch (activeCategory) {
      case 'announcements': return 'Conteúdo';
      case 'links': return 'Descrição';
      case 'feed': return 'Conteúdo do post';
      case 'hr': return 'Conteúdo da publicação';
      default: return 'Descrição do evento';
    }
  };

  const getPlaceholder = () => {
    switch (activeCategory) {
      case 'feed': return "O que está acontecendo?";
      case 'hr': return "Descreva as ações e políticas de RH...";
      default: return "Informe o conteúdo";
    }
  };

  return (
    <div>
      <Label htmlFor="content" className="text-white">
        {getLabel()}
      </Label>
      <Textarea 
        id="content"
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder={getPlaceholder()}
        rows={5}
        className="bg-black/20 border-white/30 text-white placeholder:text-white/50"
      />
    </div>
  );
};

export default ContentField;
