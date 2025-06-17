
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
    hoverColor: 'hover:from-[#7B68EE]/90 hover:to-[#D946EF]/90'
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
    hoverColor: 'hover:from-[#0EA5E9]/90 hover:to-[#3B82F6]/90'
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
    hoverColor: 'hover:from-[#10B981]/90 hover:to-[#34D399]/90'
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
    hoverColor: 'hover:from-[#F97316]/90 hover:to-[#FB923C]/90'
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
    hoverColor: 'hover:from-[#14B8A6]/90 hover:to-[#2DD4BF]/90'
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
    hoverColor: 'hover:from-[#8B5CF6]/90 hover:to-[#A78BFA]/90'
  },
  { 
    id: 'pink', 
    name: 'Rosa Neon', 
    value: 'bg-gradient-to-br from-[#EC4899] via-[#DB2777] to-[#F472B6]',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#EC4899]/30 to-[#F472B6]/30',
    buttonGradient: 'bg-gradient-to-r from-[#EC4899] to-[#F472B6]',
    accentColor: '#F472B6',
    borderColor: 'border-[#EC4899]/30',
    hoverColor: 'hover:from-[#EC4899]/90 hover:to-[#F472B6]/90'
  },
  { 
    id: 'midnight', 
    name: 'Meia-Noite', 
    value: 'bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#334155]',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#1E293B]/30 to-[#334155]/30',
    buttonGradient: 'bg-gradient-to-r from-[#1E293B] to-[#334155]',
    accentColor: '#475569',
    borderColor: 'border-[#1E293B]/50',
    hoverColor: 'hover:from-[#1E293B]/90 hover:to-[#334155]/90'
  },
  { 
    id: 'crimson', 
    name: 'Carmesim', 
    value: 'bg-gradient-to-br from-[#DC2626] via-[#B91C1C] to-[#EF4444]',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#DC2626]/30 to-[#EF4444]/30',
    buttonGradient: 'bg-gradient-to-r from-[#DC2626] to-[#EF4444]',
    accentColor: '#EF4444',
    borderColor: 'border-[#DC2626]/30',
    hoverColor: 'hover:from-[#DC2626]/90 hover:to-[#EF4444]/90'
  },
  { 
    id: 'amber', 
    name: 'Âmbar Dourado', 
    value: 'bg-gradient-to-br from-[#F59E0B] via-[#D97706] to-[#FBBF24]',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#F59E0B]/30 to-[#FBBF24]/30',
    buttonGradient: 'bg-gradient-to-r from-[#F59E0B] to-[#FBBF24]',
    accentColor: '#FBBF24',
    borderColor: 'border-[#F59E0B]/30',
    hoverColor: 'hover:from-[#F59E0B]/90 hover:to-[#FBBF24]/90'
  },
  { 
    id: 'cyan', 
    name: 'Ciano Neon', 
    value: 'bg-gradient-to-br from-[#06B6D4] via-[#0891B2] to-[#22D3EE]',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#06B6D4]/30 to-[#22D3EE]/30',
    buttonGradient: 'bg-gradient-to-r from-[#06B6D4] to-[#22D3EE]',
    accentColor: '#22D3EE',
    borderColor: 'border-[#06B6D4]/30',
    hoverColor: 'hover:from-[#06B6D4]/90 hover:to-[#22D3EE]/90'
  },
  { 
    id: 'indigo', 
    name: 'Índigo Místico', 
    value: 'bg-gradient-to-br from-[#4F46E5] via-[#4338CA] to-[#6366F1]',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#4F46E5]/30 to-[#6366F1]/30',
    buttonGradient: 'bg-gradient-to-r from-[#4F46E5] to-[#6366F1]',
    accentColor: '#6366F1',
    borderColor: 'border-[#4F46E5]/30',
    hoverColor: 'hover:from-[#4F46E5]/90 hover:to-[#6366F1]/90'
  },
  { 
    id: 'rose', 
    name: 'Rosa Clássico', 
    value: 'bg-gradient-to-br from-[#F43F5E] via-[#E11D48] to-[#FB7185]',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#F43F5E]/30 to-[#FB7185]/30',
    buttonGradient: 'bg-gradient-to-r from-[#F43F5E] to-[#FB7185]',
    accentColor: '#FB7185',
    borderColor: 'border-[#F43F5E]/30',
    hoverColor: 'hover:from-[#F43F5E]/90 hover:to-[#FB7185]/90'
  },
  { 
    id: 'lime', 
    name: 'Lima Vibrante', 
    value: 'bg-gradient-to-br from-[#65A30D] via-[#4D7C0F] to-[#84CC16]',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#65A30D]/30 to-[#84CC16]/30',
    buttonGradient: 'bg-gradient-to-r from-[#65A30D] to-[#84CC16]',
    accentColor: '#84CC16',
    borderColor: 'border-[#65A30D]/30',
    hoverColor: 'hover:from-[#65A30D]/90 hover:to-[#84CC16]/90'
  },
  { 
    id: 'violet', 
    name: 'Violeta Real', 
    value: 'bg-gradient-to-br from-[#7C3AED] via-[#6D28D9] to-[#8B5CF6]',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#7C3AED]/30 to-[#8B5CF6]/30',
    buttonGradient: 'bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6]',
    accentColor: '#8B5CF6',
    borderColor: 'border-[#7C3AED]/30',
    hoverColor: 'hover:from-[#7C3AED]/90 hover:to-[#8B5CF6]/90'
  },
  { 
    id: 'emerald', 
    name: 'Esmeralda Profunda', 
    value: 'bg-gradient-to-br from-[#059669] via-[#047857] to-[#10B981]',
    textColor: 'text-white',  
    calendarColor: 'bg-gradient-to-br from-[#059669]/30 to-[#10B981]/30',
    buttonGradient: 'bg-gradient-to-r from-[#059669] to-[#10B981]',
    accentColor: '#10B981',
    borderColor: 'border-[#059669]/30',
    hoverColor: 'hover:from-[#059669]/90 hover:to-[#10B981]/90'
  }
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

  // Apply the gradient and CSS variables to the body element whenever it changes
  useEffect(() => {
    const bodyElement = document.body;
    
    // Set the background with the selected gradient
    bodyElement.className = `${selectedGradient.value} min-h-screen w-full`;
    bodyElement.style.minHeight = '100vh';
    bodyElement.style.width = '100%';
    bodyElement.style.margin = '0';
    bodyElement.style.padding = '0';
    
    // Set CSS custom properties for dynamic theming
    const root = document.documentElement;
    root.style.setProperty('--theme-accent', selectedGradient.accentColor);
    root.style.setProperty('--theme-button-gradient', selectedGradient.buttonGradient.replace('bg-gradient-to-r ', ''));
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
