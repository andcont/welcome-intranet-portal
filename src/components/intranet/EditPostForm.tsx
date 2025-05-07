
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { X, Calendar, Edit, Trash } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import UrlField from "./form/UrlField";

interface EditPostFormProps {
  postId: string;
  postType: "announcement" | "link" | "event" | "feed";
  onClose: () => void;
  onUpdate: () => void;
}

interface Post {
  id: string;
  title: string;
  content?: string;
  description?: string;
  image?: string | null;
  url?: string;
  date?: string;
  createdAt: string;
  createdBy: string;
}

const EditPostForm = ({ postId, postType, onClose, onUpdate }: EditPostFormProps) => {
  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    // Load post data
    let storageKey = "";
    switch (postType) {
      case "announcement":
        storageKey = "andcont_announcements";
        break;
      case "link":
        storageKey = "andcont_links";
        break;
      case "event":
        storageKey = "andcont_events";
        break;
      case "feed":
        storageKey = "andcont_feed";
        break;
    }

    const storedItems = JSON.parse(localStorage.getItem(storageKey) || "[]");
    const foundPost = storedItems.find((item: Post) => item.id === postId);

    if (foundPost) {
      setPost(foundPost);
      setTitle(foundPost.title);
      setContent(foundPost.content || foundPost.description || "");
      setUrl(foundPost.url || "");
      setImage(foundPost.image || null);
      
      if (foundPost.date) {
        setDate(new Date(foundPost.date));
      }
    }
  }, [postId, postType]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Por favor, informe um título");
      return;
    }

    // Get storage key based on post type
    let storageKey = "";
    switch (postType) {
      case "announcement":
        storageKey = "andcont_announcements";
        break;
      case "link":
        storageKey = "andcont_links";
        break;
      case "event":
        storageKey = "andcont_events";
        break;
      case "feed":
        storageKey = "andcont_feed";
        break;
    }

    // Get items from storage
    const items = JSON.parse(localStorage.getItem(storageKey) || "[]");
    
    // Find the post index
    const postIndex = items.findIndex((item: Post) => item.id === postId);
    if (postIndex === -1) {
      toast.error("Post não encontrado");
      return;
    }

    // Update the post based on type
    switch (postType) {
      case "announcement":
        items[postIndex] = {
          ...items[postIndex],
          title,
          content,
          image,
        };
        break;
      case "link":
        items[postIndex] = {
          ...items[postIndex],
          title,
          description: content,
          url,
          image,
        };
        break;
      case "event":
        if (!date) {
          toast.error("Por favor, selecione uma data para o evento");
          return;
        }
        items[postIndex] = {
          ...items[postIndex],
          title,
          description: content,
          date: date.toISOString().split("T")[0],
          image,
        };
        break;
      case "feed":
        items[postIndex] = {
          ...items[postIndex],
          title,
          content,
          image,
        };
        break;
    }

    // Save updated items back to storage
    localStorage.setItem(storageKey, JSON.stringify(items));
    
    // Log activity
    const user = JSON.parse(localStorage.getItem("andcont_user") || "{}");
    const activities = JSON.parse(localStorage.getItem("andcont_activities") || "[]");
    activities.push({
      id: Date.now().toString(),
      userId: user.id || "unknown",
      userName: user.name || "Usuário",
      userEmail: user.email || "",
      type: `edit_${postType}`,
      itemId: postId,
      itemTitle: title,
      hasImage: !!image,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem("andcont_activities", JSON.stringify(activities));

    toast.success("Post atualizado com sucesso!");
    onUpdate();
    onClose();
  };

  const removeImage = () => {
    setImage(null);
  };

  if (!post) {
    return (
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Carregando...</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-500"
          >
            <X size={18} />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Edit size={20} /> Editar {postType === "announcement" ? "Comunicado" : postType === "link" ? "Link" : postType === "event" ? "Evento" : "Post"}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-gray-500"
        >
          <X size={18} />
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Title field */}
          <div>
            <Label htmlFor="title" className="text-gray-800">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-gray-300"
            />
          </div>

          {/* Content field */}
          <div>
            <Label htmlFor="content" className="text-gray-800">
              {postType === "link" ? "Descrição" : postType === "event" ? "Descrição" : "Conteúdo"}
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              className="border border-gray-300"
            />
          </div>

          {/* URL field for links */}
          {postType === "link" && (
            <UrlField url={url} onChange={setUrl} />
          )}

          {/* Date field for events */}
          {postType === "event" && (
            <div>
              <Label htmlFor="date" className="text-gray-800 block mb-2">Data</Label>
              <div className="bg-gray-50 rounded-md p-3 border border-gray-200">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="mx-auto"
                />
              </div>
            </div>
          )}

          {/* Image upload field */}
          <div>
            <Label htmlFor="image" className="text-gray-800 block mb-2">Imagem</Label>
            {image ? (
              <div className="relative mb-4">
                <img
                  src={image}
                  alt="Preview"
                  className="max-h-40 rounded border border-gray-200"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 rounded-full"
                  onClick={removeImage}
                >
                  <Trash size={14} />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Label
                  htmlFor="image"
                  className="cursor-pointer text-blue-500 hover:text-blue-600"
                >
                  Clique para fazer upload de uma imagem
                </Label>
              </div>
            )}
          </div>

          {/* Form actions */}
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="text-gray-700 border-gray-300"
            >
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Atualizar
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditPostForm;
