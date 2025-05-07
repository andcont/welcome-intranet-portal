
import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

interface IntranetHeaderProps {
  currentUser: {
    name: string;
    role: string;
    profilePic?: string;
  };
  onLogout: () => void;
}

const IntranetHeader = ({ currentUser, onLogout }: IntranetHeaderProps) => {
  const navigate = useNavigate();
  
  const goToProfile = () => {
    navigate("/profile");
  };
  
  return (
    <header className="border-b border-white/20 bg-white/30 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/ccec8aba-57c1-4908-af76-9e3f5effa934.png" 
              alt="AndCont Logo" 
              className="h-10 mr-4" 
            />
            <h1 className="text-2xl font-bold text-gray-800 hidden sm:block">Intranet AndCont</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <div onClick={goToProfile} className="flex items-center cursor-pointer hover:bg-white/20 rounded-full py-1 px-3 transition-colors">
              <Avatar className="h-8 w-8 mr-2 border border-white/30">
                {currentUser.profilePic ? (
                  <AvatarImage src={currentUser.profilePic} alt={currentUser.name} />
                ) : (
                  <AvatarFallback className="bg-andcont-purple/50 text-white">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
                  </AvatarFallback>
                )}
              </Avatar>
              <span className="text-gray-800 font-medium hidden sm:block">{currentUser.name}</span>
            </div>
            
            <Button 
              onClick={onLogout} 
              variant="outline" 
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-gray-800 border-white/30"
            >
              <LogOut className="mr-2 h-4 w-4" /> 
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default IntranetHeader;
