
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
  authorName?: string;
  authorProfileImage?: string;
  parentCommentId?: string;
  replies?: Comment[];
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
      <div className="text-center py-16">
        <div className="bg-gradient-to-br from-black/50 to-black/30 backdrop-blur-xl rounded-3xl border border-white/20 p-12 shadow-2xl">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="text-6xl">💭</div>
          </div>
          <p className="text-white/80 text-xl font-semibold mb-3">
            Nenhum comentário ainda
          </p>
          <p className="text-white/60 text-lg">
            Seja o primeiro a compartilhar seus pensamentos!
          </p>
        </div>
      </div>
    );
  }

  // Count total comments including replies
  const getTotalComments = (comments: Comment[]): number => {
    return comments.reduce((total, comment) => {
      return total + 1 + (comment.replies ? getTotalComments(comment.replies) : 0);
    }, 0);
  };

  const totalComments = getTotalComments(comments);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-lg">{totalComments}</span>
        </div>
        <h3 className="text-2xl font-bold text-white">
          {totalComments === 1 ? 'Comentário' : 'Comentários'}
        </h3>
        <div className="flex-1 h-px bg-gradient-to-r from-purple-500/50 via-pink-500/30 to-transparent"></div>
      </div>
      
      {comments.map((comment, index) => (
        <div key={comment.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
          <CommentItem
            comment={comment}
            currentUser={currentUser}
            users={users}
            onCommentDeleted={onCommentDeleted}
            level={0}
          />
        </div>
      ))}
    </div>
  );
};

export default CommentsList;
