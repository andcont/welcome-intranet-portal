
import VibrantLayout from "./VibrantLayout";

interface IntranetLayoutProps {
  children: React.ReactNode;
  currentUser: {
    name: string;
    role: string;
    profilePic?: string;
  };
  onLogout: () => void;
  activeSection?: string;
  onTabChange?: (tab: string) => void;
}

const IntranetLayout = ({ children, currentUser, onLogout, activeSection, onTabChange }: IntranetLayoutProps) => {
  // Use the new vibrant layout
  return (
    <VibrantLayout
      currentUser={currentUser}
      onLogout={onLogout}
      activeSection={activeSection}
      onTabChange={onTabChange}
    >
      {children}
    </VibrantLayout>
  );
};

export default IntranetLayout;
