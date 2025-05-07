
import { usePostForm } from "./form/usePostForm";
import FormHeader from "./form/FormHeader";
import TitleField from "./form/TitleField";
import UrlField from "./form/UrlField";
import EventDateField from "./form/EventDateField";
import ContentField from "./form/ContentField";
import ImageUploadField from "./form/ImageUploadField";
import FormActions from "./form/FormActions";

interface AdminPostFormProps {
  onClose: () => void;
  activeCategory: string;
}

const AdminPostForm = ({ onClose, activeCategory }: AdminPostFormProps) => {
  const {
    title,
    setTitle,
    content,
    setContent,
    url,
    setUrl,
    date,
    setDate,
    image,
    setImage,
    handleSubmit
  } = usePostForm({ activeCategory, onClose });
  
  return (
    <div className="bg-white/25 backdrop-blur-xl rounded-lg p-6 border border-white/30">
      <FormHeader activeCategory={activeCategory} onClose={onClose} />
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <TitleField title={title} onChange={setTitle} />
        
        {activeCategory === 'links' && (
          <UrlField url={url} onChange={setUrl} />
        )}
        
        {activeCategory === 'calendar' && (
          <EventDateField date={date} onChange={setDate} />
        )}
        
        <ContentField 
          content={content} 
          onChange={setContent}
          activeCategory={activeCategory} 
        />

        <ImageUploadField image={image} onChange={setImage} />
        
        <FormActions onCancel={onClose} />
      </form>
    </div>
  );
};

export default AdminPostForm;
