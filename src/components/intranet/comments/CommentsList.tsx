
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
      <p className="text-center text-white/60 py-8">
        Nenhum comentário ainda. Seja o primeiro a comentar!
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          currentUser={currentUser}
          users={users}
          onCommentDeleted={onCommentDeleted}
        />
      ))}
    </div>
  );
};

export default CommentsList;
