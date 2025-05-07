
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X, Image as ImageIcon } from "lucide-react";

interface ImageUploadFieldProps {
  image: string | null;
  onChange: (image: string | null) => void;
}

const ImageUploadField = ({ image, onChange }: ImageUploadFieldProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <Label htmlFor="image" className="text-white block mb-2">Imagem (opcional)</Label>
      
      {image ? (
        <div className="relative mb-4 border border-white/30 rounded-md overflow-hidden">
          <img 
            src={image} 
            alt="Preview" 
            className="w-full h-auto max-h-48 object-contain"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 bg-black/50"
            onClick={removeImage}
          >
            <X size={16} />
          </Button>
        </div>
      ) : (
        <div className="border border-dashed border-white/30 rounded-md p-6 text-center bg-black/10">
          <input 
            ref={fileInputRef}
            type="file" 
            id="image" 
            accept="image/*" 
            onChange={handleImageChange}
            className="hidden" 
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="bg-black/20 border-white/30 hover:bg-black/30 text-white"
          >
            <ImageIcon size={16} className="mr-2" />
            Selecionar Imagem
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageUploadField;
