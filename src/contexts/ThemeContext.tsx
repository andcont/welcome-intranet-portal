
import React, { createContext, useState, useContext, useEffect } from 'react';

type GradientOption = {
  id: string;
  name: string;
  value: string;
  textColor: string;
  calendarColor: string;
  buttonGradient: string;
  accentColor: string;
  borderColor: string;
  hoverColor: string;
  primaryColor: string;
  secondaryColor: string;
};

export const gradientOptions: GradientOption[] = [
  { 
    id: 'default', 
    name: 'Roxo-Rosa', 
    value: 'bg-gradient-to-br from-[#7B68EE] via-[#9B5DE5] to-[#D946EF]',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#7B68EE]/30 to-[#D946EF]/30',
    buttonGradient: 'bg-gradient-to-r from-[#7B68EE] to-[#D946EF]',
    accentColor: '#D946EF',
    borderColor: 'border-[#7B68EE]/30',
    hoverColor: 'hover:from-[#7B68EE]/90 hover:to-[#D946EF]/90',
    primaryColor: '#7B68EE',
    secondaryColor: '#D946EF'
  },
  { 
    id: 'blue', 
    name: 'Azul Oceano', 
    value: 'bg-gradient-to-br from-[#0EA5E9] via-[#0284C7] to-[#3B82F6]',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#0EA5E9]/30 to-[#3B82F6]/30',
    buttonGradient: 'bg-gradient-to-r from-[#0EA5E9] to-[#3B82F6]',
    accentColor: '#3B82F6',
    borderColor: 'border-[#0EA5E9]/30',
    hoverColor: 'hover:from-[#0EA5E9]/90 hover:to-[#3B82F6]/90',
    primaryColor: '#0EA5E9',
    secondaryColor: '#3B82F6'
  },
  { 
    id: 'green', 
    name: 'Verde Esmeralda', 
    value: 'bg-gradient-to-br from-[#10B981] via-[#059669] to-[#34D399]',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#10B981]/30 to-[#34D399]/30',
    buttonGradient: 'bg-gradient-to-r from-[#10B981] to-[#34D399]',
    accentColor: '#34D399',
    borderColor: 'border-[#10B981]/30',
    hoverColor: 'hover:from-[#10B981]/90 hover:to-[#34D399]/90',
    primaryColor: '#10B981',
    secondaryColor: '#34D399'
  },
  { 
    id: 'orange', 
    name: 'Laranja Sunset', 
    value: 'bg-gradient-to-br from-[#F97316] via-[#EA580C] to-[#FB923C]',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#F97316]/30 to-[#FB923C]/30',
    buttonGradient: 'bg-gradient-to-r from-[#F97316] to-[#FB923C]',
    accentColor: '#FB923C',
    borderColor: 'border-[#F97316]/30',
    hoverColor: 'hover:from-[#F97316]/90 hover:to-[#FB923C]/90',
    primaryColor: '#F97316',
    secondaryColor: '#FB923C'
  },
  { 
    id: 'teal', 
    name: 'Turquesa', 
    value: 'bg-gradient-to-br from-[#14B8A6] via-[#0D9488] to-[#2DD4BF]',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#14B8A6]/30 to-[#2DD4BF]/30',
    buttonGradient: 'bg-gradient-to-r from-[#14B8A6] to-[#2DD4BF]',
    accentColor: '#2DD4BF',
    borderColor: 'border-[#14B8A6]/30',
    hoverColor: 'hover:from-[#14B8A6]/90 hover:to-[#2DD4BF]/90',
    primaryColor: '#14B8A6',
    secondaryColor: '#2DD4BF'
  },
  { 
    id: 'purple', 
    name: 'Roxo Profundo', 
    value: 'bg-gradient-to-br from-[#8B5CF6] via-[#7C3AED] to-[#A78BFA]',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#8B5CF6]/30 to-[#A78BFA]/30',
    buttonGradient: 'bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA]',
    accentColor: '#A78BFA',
    borderColor: 'border-[#8B5CF6]/30',
    hoverColor: 'hover:from-[#8B5CF6]/90 hover:to-[#A78BFA]/90',
    primaryColor: '#8B5CF6',
    secondaryColor: '#A78BFA'
  },
];

type ThemeContextType = {
  selectedGradient: GradientOption;
  setSelectedGradient: (gradient: GradientOption) => void;
  gradientOptions: GradientOption[];
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedGradient, setSelectedGradient] = useState<GradientOption>(gradientOptions[0]);

  useEffect(() => {
    const savedGradient = localStorage.getItem('andcont_gradient');
    if (savedGradient) {
      try {
        const parsedGradient = JSON.parse(savedGradient);
        const foundGradient = gradientOptions.find(g => g.id === parsedGradient.id);
        if (foundGradient) {
          setSelectedGradient(foundGradient);
        }
      } catch (error) {
        console.error("Error loading saved gradient:", error);
      }
    }
  }, []);

  useEffect(() => {
    const bodyElement = document.body;
    const root = document.documentElement;
    
    // Apply background gradient to body
    bodyElement.className = `${selectedGradient.value} min-h-screen w-full`;
    bodyElement.style.minHeight = '100vh';
    bodyElement.style.width = '100%';
    bodyElement.style.margin = '0';
    bodyElement.style.padding = '0';
    
    // Set CSS custom properties for dynamic theming
    root.style.setProperty('--theme-primary', selectedGradient.primaryColor);
    root.style.setProperty('--theme-secondary', selectedGradient.secondaryColor);
    root.style.setProperty('--theme-accent', selectedGradient.accentColor);
    root.style.setProperty('--theme-border', `${selectedGradient.primaryColor}50`);
    root.style.setProperty('--theme-gradient-from', selectedGradient.primaryColor);
    root.style.setProperty('--theme-gradient-to', selectedGradient.secondaryColor);
    
    console.log('Theme applied:', selectedGradient.name, {
      primary: selectedGradient.primaryColor,
      secondary: selectedGradient.secondaryColor,
      accent: selectedGradient.accentColor
    });
  }, [selectedGradient]);

  const handleSetGradient = (gradient: GradientOption) => {
    setSelectedGradient(gradient);
    localStorage.setItem('andcont_gradient', JSON.stringify(gradient));
  };

  return (
    <ThemeContext.Provider value={{ 
      selectedGradient, 
      setSelectedGradient: handleSetGradient,
      gradientOptions 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
