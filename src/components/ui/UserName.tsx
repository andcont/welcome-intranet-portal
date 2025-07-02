
import { Button } from "@/components/ui/button";

interface UserNameProps {
  name: string;
  userId: string;
  onUserClick: (userId: string) => void;
  className?: string;
}

const UserName = ({ name, userId, onUserClick, className = "" }: UserNameProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('UserName clicked, userId:', userId);
    onUserClick(userId);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className={`text-left p-0 h-auto font-normal hover:underline text-white/80 hover:text-white transition-colors cursor-pointer ${className}`}
    >
      {name}
    </Button>
  );
};

export default UserName;
