
import { LogOut, User, LayoutDashboard } from "lucide-react";
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
  
  const goToAdmin = () => {
    navigate("/admin");
  };
  
  return (
    <header className="border-b border-[#7B68EE]/30 bg-black/40 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/ccec8aba-57c1-4908-af76-9e3f5effa934.png" 
              alt="AndCont Logo" 
              className="h-10 mr-4" 
            />
            <h1 className="text-2xl font-bold text-gradient hidden sm:block">Intranet AndCont</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            {currentUser.role === 'admin' && (
              <Button 
                onClick={goToAdmin} 
                variant="outline" 
                size="sm"
                className="bg-gradient-to-r from-[#7B68EE] to-[#D946EF] text-white border-transparent hover:opacity-90"
              >
                <LayoutDashboard className="mr-2 h-4 w-4" /> 
                <span className="hidden sm:inline">Área Admin</span>
              </Button>
            )}
            
            <div onClick={goToProfile} className="flex items-center cursor-pointer hover:bg-black/50 rounded-full py-1 px-3 transition-colors">
              <Avatar className="h-8 w-8 mr-2 border border-[#7B68EE]/50">
                {currentUser.profilePic ? (
                  <AvatarImage src={currentUser.profilePic} alt={currentUser.name} />
                ) : (
                  <AvatarFallback className="bg-gradient-to-r from-[#7B68EE] to-[#D946EF] text-white">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
                  </AvatarFallback>
                )}
              </Avatar>
              <span className="text-white font-medium hidden sm:block">{currentUser.name}</span>
            </div>
            
            <Button 
              onClick={onLogout} 
              variant="outline" 
              size="sm"
              className="bg-black/30 hover:bg-black/50 text-white border-[#7B68EE]/30"
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
