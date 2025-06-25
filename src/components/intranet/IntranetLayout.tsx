
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  Bell, 
  Search, 
  Menu, 
  X, 
  Home, 
  Users, 
  Calendar, 
  FileText, 
  Link as LinkIcon,
  MessageSquare,
  Settings,
  LogOut,
  ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface IntranetLayoutProps {
  children: React.ReactNode;
  currentUser: {
    name: string;
    role: string;
    profilePic?: string;
  };
  onLogout: () => void;
  activeSection?: string;
}

const IntranetLayout = ({ children, currentUser, onLogout, activeSection }: IntranetLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { icon: Home, label: "Dashboard", id: "dashboard", path: "/intranet" },
    { icon: Bell, label: "Comunicados", id: "announcements", path: "/intranet" },
    { icon: LinkIcon, label: "Links Úteis", id: "links", path: "/intranet" },
    { icon: Calendar, label: "Calendário", id: "calendar", path: "/intranet" },
    { icon: MessageSquare, label: "Feed", id: "feed", path: "/intranet" },
    { icon: Users, label: "Equipe", id: "team", path: "/intranet" },
  ];

  const adminItems = [
    { icon: Settings, label: "Administração", id: "admin", path: "/admin" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white hover:bg-white/10"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/07664a7b-d471-41cd-848e-88de04532275.png" 
                alt="AndCont Logo" 
                className="h-8 w-8" 
              />
              <div>
                <h1 className="text-lg font-bold text-white">AndCont Intranet</h1>
                <p className="text-xs text-gray-300">Portal Corporativo</p>
              </div>
            </div>
          </div>

          {/* Center - Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar..."
                className="w-full pl-10 pr-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
              <Bell className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center space-x-2 cursor-pointer hover:bg-white/10 rounded-full px-3 py-2 transition-colors">
              <Avatar className="h-8 w-8">
                {currentUser.profilePic ? (
                  <AvatarImage src={currentUser.profilePic} alt={currentUser.name} />
                ) : (
                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-white">{currentUser.name}</p>
                <p className="text-xs text-gray-300">{currentUser.role === 'admin' ? 'Administrador' : 'Usuário'}</p>
              </div>
            </div>

            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onLogout}
              className="text-white hover:bg-white/10"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-black/30 backdrop-blur-xl border-r border-white/10 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0`}>
          <div className="flex flex-col h-full pt-16 lg:pt-0">
            {/* Close button for mobile */}
            <div className="flex justify-end p-4 lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="text-white hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 pb-4 space-y-2">
              <div className="mb-6">
                <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Navegação
                </h3>
                {menuItems.map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className={`w-full justify-start text-left text-white hover:bg-white/10 ${
                      activeSection === item.id ? 'bg-white/10 border-r-2 border-purple-500' : ''
                    }`}
                    onClick={() => {
                      navigate(item.path);
                      setSidebarOpen(false);
                    }}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.label}
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </Button>
                ))}
              </div>

              {currentUser.role === 'admin' && (
                <div>
                  <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Administração
                  </h3>
                  {adminItems.map((item) => (
                    <Button
                      key={item.id}
                      variant="ghost"
                      className="w-full justify-start text-left text-white hover:bg-white/10"
                      onClick={() => {
                        navigate(item.path);
                        setSidebarOpen(false);
                      }}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      {item.label}
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </Button>
                  ))}
                </div>
              )}
            </nav>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 lg:ml-0 min-h-screen">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default IntranetLayout;
