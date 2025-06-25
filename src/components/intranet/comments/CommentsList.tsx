
import CommentItem from "./CommentItem";

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

interface CommentsListProps {
  comments: Comment[];
  currentUser: User | null;
  users: Record<string, User>;
  onCommentDeleted: () => void;
}

const CommentsList = ({ comments, currentUser, users, onCommentDeleted }: CommentsListProps) => {
  if (comments.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gradient-to-r from-black/40 to-black/30 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
          <div className="text-6xl mb-4">💬</div>
          <p className="text-white/70 text-lg font-medium mb-2">
            Nenhum comentário ainda
          </p>
          <p className="text-white/50 text-sm">
            Seja o primeiro a compartilhar seus pensamentos!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <h3 className="text-xl font-bold text-white">
          Comentários ({comments.length})
        </h3>
        <div className="flex-1 h-px bg-gradient-to-r from-purple-500/50 to-transparent"></div>
      </div>
      
      {comments.map((comment, index) => (
        <div key={comment.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
          <CommentItem
            comment={comment}
            currentUser={currentUser}
            users={users}
            onCommentDeleted={onCommentDeleted}
          />
        </div>
      ))}
    </div>
  );
};

export default CommentsList;
