
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
      default: return 'Descrição do evento';
    }
  };

  const getPlaceholder = () => {
    return activeCategory === 'feed' ? "O que está acontecendo?" : "Informe o conteúdo";
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
