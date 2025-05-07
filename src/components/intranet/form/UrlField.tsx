
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface UrlFieldProps {
  url: string;
  onChange: (value: string) => void;
}

const UrlField = ({ url, onChange }: UrlFieldProps) => {
  return (
    <div>
      <Label htmlFor="url" className="text-gray-800">URL (opcional)</Label>
      <Input 
        id="url"
        value={url}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://exemplo.com"
        className="bg-white/50 border-white/30 text-gray-800 placeholder:text-gray-500"
      />
    </div>
  );
};

export default UrlField;
