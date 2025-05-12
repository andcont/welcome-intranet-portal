
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface UrlFieldProps {
  url: string;
  onChange: (value: string) => void;
}

const UrlField = ({ url, onChange }: UrlFieldProps) => {
  return (
    <div>
      <Label htmlFor="url" className="text-white">URL (opcional)</Label>
      <Input 
        id="url"
        value={url}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://exemplo.com"
        className="bg-black/15 border-white/30 text-white placeholder:text-white/50"
      />
    </div>
  );
};

export default UrlField;
