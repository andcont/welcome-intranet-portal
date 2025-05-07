
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface TitleFieldProps {
  title: string;
  onChange: (value: string) => void;
}

const TitleField = ({ title, onChange }: TitleFieldProps) => {
  return (
    <div>
      <Label htmlFor="title" className="text-white">Título</Label>
      <Input 
        id="title"
        value={title}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Informe o título"
        className="bg-black/20 border-white/30 text-white placeholder:text-white/50"
      />
    </div>
  );
};

export default TitleField;
