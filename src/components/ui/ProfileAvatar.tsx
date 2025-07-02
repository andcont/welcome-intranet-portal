
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ProfileAvatarProps {
  src?: string | null;
  alt: string;
  fallbackText: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const ProfileAvatar = ({ 
  src, 
  alt, 
  fallbackText, 
  className,
  size = "md" 
}: ProfileAvatarProps) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10", 
    lg: "h-12 w-12",
    xl: "h-16 w-16"
  };

  const fallbackSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base", 
    xl: "text-lg"
  };

  console.log('ProfileAvatar - src:', src, 'alt:', alt, 'fallbackText:', fallbackText);

  return (
    <Avatar className={cn(
      sizeClasses[size],
      "border-2 border-white/20 shadow-lg",
      className
    )}>
      {src && (
        <AvatarImage 
          src={src} 
          alt={alt}
          className="object-cover"
          onLoad={() => console.log('Image loaded successfully:', src)}
          onError={(e) => {
            console.log('Image failed to load:', src);
            // Hide the image element if it fails to load
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      )}
      <AvatarFallback className={cn(
        "bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold",
        fallbackSizeClasses[size]
      )}>
        {fallbackText.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};

export default ProfileAvatar;
