
import VibrantLayout from "./VibrantLayout";

interface IntranetLayoutProps {
  children: React.ReactNode;
  currentUser: {
    name: string;
    role: string;
    profilePic?: string;
    id?: string;
  };
  onLogout: () => void;
  activeSection?: string;
  onTabChange?: (tab: string) => void;
  onUserClick?: (userId: string) => void;
}

const IntranetLayout = ({ children, currentUser, onLogout, activeSection, onTabChange, onUserClick }: IntranetLayoutProps) => {
  // Use the new vibrant layout
  return (
    <VibrantLayout
      currentUser={currentUser}
      onLogout={onLogout}
      activeSection={activeSection}
      onTabChange={onTabChange}
      onUserClick={onUserClick}
    >
      {children}
    </VibrantLayout>
  );
};

export default IntranetLayout;
