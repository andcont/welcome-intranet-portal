import { Button } from "@/components/ui/button";

interface UserNameProps {
  name: string;
  userId: string;
  onUserClick: (userId: string) => void;
  className?: string;
}

const UserName = ({ name, userId, onUserClick, className = "" }: UserNameProps) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onUserClick(userId)}
      className={`text-left p-0 h-auto font-normal hover:underline text-white/80 hover:text-white transition-colors ${className}`}
    >
      {name}
    </Button>
  );
};

export default UserName;