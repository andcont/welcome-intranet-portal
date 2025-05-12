import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { X, MessageSquare, User, Send, Edit, Trash, Image, Save } from "lucide-react";
import { toast } from "sonner";
import PostReactions from "./PostReactions";
import ImageViewer from "./ImageViewer";
import EditPostForm from "./EditPostForm";

interface PostDetailProps {
  postId: string;
  postType: 'announcement' | 'link' | 'event' | 'feed';
  onClose: () => void;
}

interface Comment {
  id: string;
  postId: string;
  postType: string;
  content: string;
  createdAt: string;
  createdBy: string;
  createdByRole?: string;
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

const PostDetail = ({ postId, postType, onClose }: PostDetailProps) => {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentContent, setEditCommentContent] = useState("");
  
  const loadPost = () => {
    let storageKey = "";
    switch(postType) {
      case 'announcement':
        storageKey = 'andcont_announcements';
        break;
      case 'link':
        storageKey = 'andcont_links';
        break;
      case 'event':
        storageKey = 'andcont_events';
        break;
      case 'feed':
        storageKey = 'andcont_feed';
        break;
    }
    
    const storedItems = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const foundPost = storedItems.find((item: Post) => item.id === postId);
    
    if (foundPost) {
      setPost(foundPost);
    }
    
    const allComments = JSON.parse(localStorage.getItem('andcont_comments') || '[]');
    const postComments = allComments.filter(
      (comment: Comment) => comment.postId === postId && comment.postType === postType
    );
    setComments(postComments);
    setLoading(false);
  };
  
  useEffect(() => {
    loadPost();
    
    const userStr = localStorage.getItem("andcont_user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, [postId, postType]);
  
  const getCurrentUser = () => {
    const userStr = localStorage.getItem("andcont_user");
    if (!userStr) return { name: "Usuário", role: "user" };
    
    try {
      const user = JSON.parse(userStr);
      return { name: user.name || "Usuário", role: user.role || "user" };
    } catch {
      return { name: "Usuário", role: "user" };
    }
  };
  
  const handleSubmitComment = () => {
    if (!newComment.trim()) {
      toast.error("Por favor, informe um comentário");
      return;
    }
    
    const user = getCurrentUser();
    const now = new Date();
    const commentId = Date.now().toString();
    
    const comment = {
      id: commentId,
      postId,
      postType,
      content: newComment,
      createdAt: now.toISOString(),
      createdBy: user.name,
      createdByRole: user.role
    };
    
    const allComments = JSON.parse(localStorage.getItem('andcont_comments') || '[]');
    allComments.push(comment);
    localStorage.setItem('andcont_comments', JSON.stringify(allComments));
    
    setComments([...comments, comment]);
    setNewComment("");
    
    toast.success("Comentário adicionado com sucesso!");
  };
  
  const handleDeletePost = () => {
    if (!confirm("Tem certeza que deseja excluir esta publicação?")) {
      return;
    }
    
    let storageKey = "";
    switch(postType) {
      case 'announcement':
        storageKey = 'andcont_announcements';
        break;
      case 'link':
        storageKey = 'andcont_links';
        break;
      case 'event':
        storageKey = 'andcont_events';
        break;
      case 'feed':
        storageKey = 'andcont_feed';
        break;
    }
    
    const items = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const updatedItems = items.filter((item: Post) => item.id !== postId);
    localStorage.setItem(storageKey, JSON.stringify(updatedItems));
    
    const allComments = JSON.parse(localStorage.getItem('andcont_comments') || '[]');
    const updatedComments = allComments.filter(
      (comment: Comment) => !(comment.postId === postId && comment.postType === postType)
    );
    localStorage.setItem('andcont_comments', JSON.stringify(updatedComments));
    
    const allReactions = JSON.parse(localStorage.getItem('andcont_reactions') || '[]');
    const updatedReactions = allReactions.filter(
      (reaction: any) => !(reaction.postId === postId && reaction.postType === postType)
    );
    localStorage.setItem('andcont_reactions', JSON.stringify(updatedReactions));
    
    const user = JSON.parse(localStorage.getItem('andcont_user') || '{}');
    const activities = JSON.parse(localStorage.getItem('andcont_activities') || '[]');
    activities.push({
      id: Date.now().toString(),
      userId: user.id || 'unknown',
      userName: user.name || 'Usuário',
      userEmail: user.email || '',
      type: `delete_${postType}`,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('andcont_activities', JSON.stringify(activities));
    
    toast.success("Publicação excluída com sucesso!");
    onClose();
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canEditOrDelete = () => {
    if (!currentUser || !post) return false;
    
    if (currentUser.role === 'admin') return true;
    
    if (postType === 'feed' && post.createdBy === currentUser.name) return true;
    
    return false;
  };
  
  const handleEditComment = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditCommentContent(comment.content);
  };
  
  const handleCancelEditComment = () => {
    setEditingCommentId(null);
    setEditCommentContent("");
  };
  
  const handleSaveComment = (commentId: string) => {
    if (!editCommentContent.trim()) {
      toast.error("O comentário não pode estar vazio");
      return;
    }
    
    const allComments = JSON.parse(localStorage.getItem('andcont_comments') || '[]');
    const updatedComments = allComments.map((comment: Comment) => {
      if (comment.id === commentId) {
        return { ...comment, content: editCommentContent };
      }
      return comment;
    });
    
    localStorage.setItem('andcont_comments', JSON.stringify(updatedComments));
    
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return { ...comment, content: editCommentContent };
      }
      return comment;
    }));
    
    setEditingCommentId(null);
    setEditCommentContent("");
    toast.success("Comentário atualizado com sucesso!");
  };
  
  const handleDeleteComment = (commentId: string) => {
    if (!confirm("Tem certeza que deseja excluir este comentário?")) {
      return;
    }
    
    const allComments = JSON.parse(localStorage.getItem('andcont_comments') || '[]');
    const updatedComments = allComments.filter(
      (comment: Comment) => comment.id !== commentId
    );
    
    localStorage.setItem('andcont_comments', JSON.stringify(updatedComments));
    
    setComments(comments.filter(comment => comment.id !== commentId));
    toast.success("Comentário excluído com sucesso!");
  };
  
  const isCommentOwner = (comment: Comment) => {
    if (!currentUser) return false;
    return comment.createdBy === currentUser.name || currentUser.role === 'admin';
  };
  
  if (loading || !post) {
    return (
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-lg p-6 border border-gray-200 shadow-lg">
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

  if (showEditForm) {
    return (
      <EditPostForm 
        postId={postId} 
        postType={postType} 
        onClose={() => setShowEditForm(false)}
        onUpdate={loadPost}
      />
    );
  }
  
  return (
    <div className="bg-gradient-to-br from-white/80 to-blue-50/80 rounded-lg p-6 border border-gray-200 shadow-lg">
      {showImageViewer && post.image && (
        <ImageViewer 
          src={post.image} 
          alt={post.title} 
          onClose={() => setShowImageViewer(false)}
        />
      )}
      
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">{post.title}</h3>
        <div className="flex items-center gap-2">
          {canEditOrDelete() && (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowEditForm(true)}
                className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 edit-button"
              >
                <Edit size={16} />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleDeletePost}
                className="text-gray-500 hover:text-red-600 hover:bg-red-50"
              >
                <Trash size={16} />
              </Button>
            </>
          )}
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
      
      {/* Post content with improved visibility */}
      <div className="mb-8">
        {post.image && (
          <div className="mb-4">
            <div 
              className="relative cursor-zoom-in group"
              onClick={() => setShowImageViewer(true)}
            >
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-auto max-h-80 object-contain rounded-md border border-gray-200"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 rounded-md transition-opacity">
                <div className="bg-white/80 p-2 rounded-full">
                  <Image size={24} className="text-gray-800" />
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="text-gray-700 whitespace-pre-wrap bg-white/50 p-4 rounded-lg border border-gray-100">
          {post.content || post.description}
        </div>
        
        {post.url && (
          <div className="mt-4">
            <a 
              href={post.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline flex items-center"
            >
              Acessar link
            </a>
          </div>
        )}
        
        {post.date && (
          <div className="mt-2 text-gray-600">
            <span>Data: {new Date(post.date).toLocaleDateString('pt-BR')}</span>
          </div>
        )}
        
        <div className="mt-4 text-sm text-gray-500 flex items-center justify-between">
          <span>Por: {post.createdBy}</span>
          <span>{formatDate(post.createdAt)}</span>
        </div>
        
        <div className="mt-4 flex items-center gap-4">
          <PostReactions postId={postId} postType={postType} />
        </div>
      </div>
      
      {/* Comments section with improved visibility */}
      <div className="pt-6 border-t border-gray-200">
        <h4 className="flex items-center text-lg font-bold text-gray-800 mb-4">
          <MessageSquare className="mr-2 h-5 w-5" /> 
          Comentários ({comments.length})
        </h4>
        
        {comments.length > 0 ? (
          <div className="space-y-4 mb-6">
            {comments.map(comment => (
              <div key={comment.id} className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4 border border-gray-100 shadow-sm">
                <div className="flex items-start">
                  <Avatar className="h-8 w-8 mr-3 bg-blue-100 text-blue-600">
                    <User className="h-4 w-4" />
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-800">{comment.createdBy}</span>
                        {comment.createdByRole === 'admin' && (
                          <span className="ml-2 bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                            Admin
                          </span>
                        )}
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500 mr-2">{formatDate(comment.createdAt)}</span>
                        {isCommentOwner(comment) && (
                          <div className="flex space-x-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleEditComment(comment)}
                              className="h-6 w-6 p-0 text-gray-400 hover:text-blue-500"
                            >
                              <Edit size={14} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDeleteComment(comment.id)}
                              className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                            >
                              <Trash size={14} />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {editingCommentId === comment.id ? (
                      <div>
                        <Textarea 
                          value={editCommentContent}
                          onChange={(e) => setEditCommentContent(e.target.value)}
                          rows={3}
                          className="border-gray-300 bg-white text-gray-700 placeholder:text-gray-400 mb-2 resize-none"
                        />
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={handleCancelEditComment}
                            className="text-gray-700"
                          >
                            Cancelar
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={() => handleSaveComment(comment.id)}
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                          >
                            <Save className="mr-1 h-4 w-4" /> Salvar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-700 bg-white/50 p-2 rounded">{comment.content}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Seja o primeiro a comentar!</p>
          </div>
        )}
        
        {/* Add comment form with improved visibility */}
        <div className="flex space-x-3 mt-4">
          <Avatar className="h-8 w-8 bg-blue-100 text-blue-600">
            <User className="h-4 w-4" />
          </Avatar>
          <div className="flex-1">
            <Textarea 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Adicione um comentário..."
              rows={3}
              className="border-gray-300 bg-white text-gray-700 placeholder:text-gray-500 mb-2 resize-none"
            />
            <div className="flex justify-end">
              <Button 
                onClick={handleSubmitComment}
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
              >
                <Send className="mr-2 h-4 w-4" /> Comentar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
