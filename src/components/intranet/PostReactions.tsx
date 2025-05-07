
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface Reaction {
  postId: string;
  postType: string;
  userId: string;
  type: "like";
  timestamp: string;
}

interface PostReactionsProps {
  postId: string;
  postType: 'announcement' | 'link' | 'event' | 'feed';
}

const PostReactions = ({ postId, postType }: PostReactionsProps) => {
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [hasReacted, setHasReacted] = useState(false);
  
  const getCurrentUser = (): string => {
    const userStr = localStorage.getItem("andcont_user");
    if (!userStr) return "";
    
    try {
      const user = JSON.parse(userStr);
      return user.id || "";
    } catch {
      return "";
    }
  };
  
  useEffect(() => {
    // Load reactions from localStorage
    const storedReactions = JSON.parse(localStorage.getItem('andcont_reactions') || '[]');
    const postReactions = storedReactions.filter(
      (reaction: Reaction) => reaction.postId === postId && reaction.postType === postType
    );
    
    setReactions(postReactions);
    
    const userId = getCurrentUser();
    const userHasReacted = postReactions.some(
      (reaction: Reaction) => reaction.userId === userId
    );
    setHasReacted(userHasReacted);
  }, [postId, postType]);
  
  const toggleReaction = () => {
    const userId = getCurrentUser();
    if (!userId) return;
    
    const allReactions = JSON.parse(localStorage.getItem('andcont_reactions') || '[]');
    
    if (hasReacted) {
      // Remove reaction
      const updatedReactions = allReactions.filter(
        (reaction: Reaction) => !(reaction.postId === postId && reaction.postType === postType && reaction.userId === userId)
      );
      localStorage.setItem('andcont_reactions', JSON.stringify(updatedReactions));
      
      // Update local state
      setReactions(reactions.filter(reaction => reaction.userId !== userId));
      setHasReacted(false);
    } else {
      // Add reaction
      const newReaction: Reaction = {
        postId,
        postType,
        userId,
        type: "like",
        timestamp: new Date().toISOString()
      };
      
      allReactions.push(newReaction);
      localStorage.setItem('andcont_reactions', JSON.stringify(allReactions));
      
      // Update local state
      setReactions([...reactions, newReaction]);
      setHasReacted(true);
    }
  };
  
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        className={`flex items-center gap-1 ${hasReacted ? 'text-red-500' : 'text-white/70'} hover:text-red-500 hover:bg-white/10`}
        onClick={toggleReaction}
      >
        <Heart size={16} className={hasReacted ? "fill-red-500" : ""} />
        <span>{reactions.length}</span>
      </Button>
    </div>
  );
};

export default PostReactions;
