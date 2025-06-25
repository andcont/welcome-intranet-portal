
import { useState, useEffect } from "react";
import CommentForm from "./comments/CommentForm";
import CommentsList from "./comments/CommentsList";

interface Comment {
  id: string;
  postId: string;
  postType: string;
  content: string;
  createdAt: string;
  createdBy: string;
  userEmail?: string;
  imageUrl?: string;
  gifUrl?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  profileImage?: string;
}

interface PostCommentsProps {
  postId: string;
  postType: string;
}

const PostComments = ({ postId, postType }: PostCommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<Record<string, User>>({});

  useEffect(() => {
    // Load current user
    const userStr = localStorage.getItem("andcont_user");
    if (userStr) {
      try {
        const parsedUser = JSON.parse(userStr);
        setCurrentUser(parsedUser);
      } catch (error) {
        console.error("Erro ao analisar dados do usuário:", error);
      }
    }

    // Load all users to get profile images
    const usersStr = localStorage.getItem("andcont_users");
    if (usersStr) {
      try {
        const allUsers = JSON.parse(usersStr);
        const usersMap: Record<string, User> = {};
        allUsers.forEach((user: User) => {
          usersMap[user.email] = user;
        });
        setUsers(usersMap);
      } catch (error) {
        console.error("Erro ao analisar dados de usuários:", error);
      }
    }

    loadComments();
  }, [postId, postType]);

  const loadComments = () => {
    const allComments = JSON.parse(localStorage.getItem("andcont_comments") || "[]");
    const filteredComments = allComments.filter(
      (comment: Comment) => comment.postId === postId && comment.postType === postType
    );
    setComments(filteredComments);
  };

  return (
    <div className="mt-12 space-y-8">
      <div className="bg-gradient-to-r from-black/60 to-black/40 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-3xl shadow-lg">
            💬
          </div>
          <div>
            <h3 className="text-3xl font-bold text-white mb-2">Comentários</h3>
            <p className="text-white/70 text-lg">Compartilhe seus pensamentos e participe da conversa</p>
          </div>
        </div>

        <CommentForm
          postId={postId}
          postType={postType}
          currentUser={currentUser}
          onCommentAdded={loadComments}
        />
      </div>

      <CommentsList
        comments={comments}
        currentUser={currentUser}
        users={users}
        onCommentDeleted={loadComments}
      />
    </div>
  );
};

export default PostComments;
