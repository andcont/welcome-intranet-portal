import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Edit, Trash, ExternalLink, Calendar, MapPin, Clock } from "lucide-react";
@@ -18,8 +19,6 @@
  const [post, setPost] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);
  const { user, profile } = useAuth();

  useEffect(() => {
@@ -60,6 +59,7 @@

      console.log('Post loaded:', postData);

      // Load author profile if the post has created_by field
      let authorProfile = null;
      if (postData && 'created_by' in postData && postData.created_by) {
        const { data: authorData } = await supabase
@@ -74,6 +74,7 @@
      const enrichedPost = {
        ...postData,
        author: authorProfile?.name || 'Usuário',
        // Map database fields to expected format
        createdAt: postData.created_at,
        imageUrl: 'image_url' in postData ? postData.image_url : null,
        url: 'url' in postData ? postData.url : null,
@@ -141,16 +142,6 @@
    loadPost(); // Reload the post to reflect changes
  };

  const handleImageClick = (imageUrl: string) => {
    setModalImageUrl(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalImageUrl(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
@@ -276,8 +267,7 @@
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full max-h-96 object-cover rounded-lg border border-white/20 cursor-pointer"
              onClick={() => handleImageClick(post.imageUrl)}  // Adicionando o click
              className="w-full max-h-96 object-cover rounded-lg border border-white/20"
            />
          </div>
        )}
@@ -293,12 +283,12 @@
      </div>

      {/* Reactions */}
      <PostReactions postId={postId} />
      <PostReactions postId={postId} postType={postType} />

      {/* Comments */}
      <PostComments postId={postId} />
      <PostComments postId={postId} postType={postType} />
    </div>
  );
};

export default PostDetail;
