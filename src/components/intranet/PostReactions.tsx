
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, ThumbsUp, Star, Circle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Reaction {
  id: string;
  post_id: string;
  post_type: string;
  created_by: string;
  reaction_type: string;
  created_at: string;
}

interface PostReactionsProps {
  postId: string;
  postType: 'announcement' | 'link' | 'event' | 'feed';
}

const REACTION_TYPES = [
  { type: "like", emoji: "👍", label: "Curtir", icon: ThumbsUp },
  { type: "love", emoji: "❤️", label: "Amei", icon: Heart },
  { type: "star", emoji: "⭐", label: "Incrível", icon: Star },
  { type: "wow", emoji: "😮", label: "Uau", icon: Circle },
  { type: "sad", emoji: "😢", label: "Triste", icon: Circle }
];

const PostReactions = ({ postId, postType }: PostReactionsProps) => {
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [reactionCounts, setReactionCounts] = useState<Record<string, number>>({});
  const { user } = useAuth();
  
  const loadReactions = async () => {
    try {
      const { data, error } = await supabase
        .from('reactions')
        .select('*')
        .eq('post_id', postId)
        .eq('post_type', postType);

      if (error) {
        console.error('Error loading reactions:', error);
        return;
      }

      setReactions(data || []);
      
      // Calculate counts for each reaction type
      const counts: Record<string, number> = {};
      (data || []).forEach((reaction) => {
        counts[reaction.reaction_type] = (counts[reaction.reaction_type] || 0) + 1;
      });
      setReactionCounts(counts);
      
      // Check if current user has already reacted
      if (user) {
        const userReaction = (data || []).find(
          (reaction) => reaction.created_by === user.id
        );
        
        if (userReaction) {
          setUserReaction(userReaction.reaction_type);
        } else {
          setUserReaction(null);
        }
      }
    } catch (error) {
      console.error('Error loading reactions:', error);
    }
  };

  useEffect(() => {
    loadReactions();
  }, [postId, postType, user]);
  
  const addReaction = async (reactionType: string) => {
    if (!user) return;
    
    try {
      // Remove existing reaction by this user for this post if any
      await supabase
        .from('reactions')
        .delete()
        .eq('post_id', postId)
        .eq('post_type', postType)
        .eq('created_by', user.id);
      
      // Add new reaction
      const { error } = await supabase
        .from('reactions')
        .insert({
          post_id: postId,
          post_type: postType,
          created_by: user.id,
          reaction_type: reactionType
        });

      if (error) {
        console.error('Error adding reaction:', error);
        return;
      }

      // Reload reactions
      loadReactions();
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };
  
  const removeReaction = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('reactions')
        .delete()
        .eq('post_id', postId)
        .eq('post_type', postType)
        .eq('created_by', user.id);

      if (error) {
        console.error('Error removing reaction:', error);
        return;
      }

      // Reload reactions
      loadReactions();
    } catch (error) {
      console.error('Error removing reaction:', error);
    }
  };
  
  const handleReaction = (reactionType: string) => {
    if (userReaction === reactionType) {
      removeReaction();
    } else {
      addReaction(reactionType);
    }
  };
  
  // Get total reaction count
  const totalReactions = Object.values(reactionCounts).reduce((sum, count) => sum + count, 0);
  
  // Find most common reaction to display
  const mostCommonReaction = Object.entries(reactionCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "like";
  const reactionEmoji = REACTION_TYPES.find(r => r.type === mostCommonReaction)?.emoji || "👍";
  
  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center gap-1 ${userReaction ? 'text-blue-500' : 'text-gray-500'} hover:bg-blue-50`}
          >
            <span className="text-lg">{reactionEmoji}</span>
            <span>{totalReactions}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <div className="flex p-1 bg-gradient-to-r from-blue-50 to-purple-50 rounded-md">
            {REACTION_TYPES.map((reaction) => (
              <TooltipProvider key={reaction.type}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`text-lg p-2 mx-1 hover:bg-blue-100 rounded-full ${
                        userReaction === reaction.type ? 'bg-blue-100' : ''
                      }`}
                      onClick={() => handleReaction(reaction.type)}
                    >
                      <span className="text-xl">{reaction.emoji}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{reaction.label}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      
      {Object.entries(reactionCounts).map(([type, count]) => {
        if (count > 0) {
          const reactionInfo = REACTION_TYPES.find(r => r.type === type);
          return (
            <TooltipProvider key={type}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center px-2 py-1 bg-gray-100 rounded-full text-xs">
                    <span className="mr-1">{reactionInfo?.emoji}</span>
                    <span>{count}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{reactionInfo?.label || type}: {count}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        }
        return null;
      })}
    </div>
  );
};

export default PostReactions;
