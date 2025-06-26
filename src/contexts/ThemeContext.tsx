
import React, { createContext, useState, useContext, useEffect } from 'react';

type GradientOption = {
  id: string;
  name: string;
  value: string;
  textColor: string;
  calendarColor: string;
};

export const gradientOptions: GradientOption[] = [
  { 
    id: 'default', 
    name: 'Roxo-Rosa', 
    value: 'bg-gradient-to-br from-[#7B68EE] to-[#D946EF]',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#7B68EE]/30 to-[#D946EF]/30'
  },
  { 
    id: 'blue', 
    name: 'Azul Oceano', 
    value: 'bg-gradient-to-br from-[#0EA5E9] to-[#3B82F6]',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#0EA5E9]/30 to-[#3B82F6]/30'
  },
  { 
    id: 'green', 
    name: 'Verde Esmeralda', 
    value: 'bg-gradient-to-br from-[#10B981] to-[#34D399]',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#10B981]/30 to-[#34D399]/30'
  },
  { 
    id: 'orange', 
    name: 'Laranja Sunset', 
    value: 'bg-gradient-to-br from-[#F97316] to-[#FB923C]',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#F97316]/30 to-[#FB923C]/30'
  },
  { 
    id: 'teal', 
    name: 'Turquesa', 
    value: 'bg-gradient-to-br from-[#14B8A6] to-[#2DD4BF]',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#14B8A6]/30 to-[#2DD4BF]/30'
  },
  { 
    id: 'purple', 
    name: 'Roxo Profundo', 
    value: 'bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA]',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#8B5CF6]/30 to-[#A78BFA]/30'
  },
  { 
    id: 'pink', 
    name: 'Rosa Neon', 
    value: 'bg-gradient-to-br from-[#EC4899] to-[#F472B6]',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#EC4899]/30 to-[#F472B6]/30'
  },
  { 
    id: 'midnight', 
    name: 'Meia-Noite', 
    value: 'bg-gradient-to-br from-[#1E293B] to-[#334155]',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#1E293B]/30 to-[#334155]/30'
  },
  { 
    id: 'crimson', 
    name: 'Carmesim', 
    value: 'bg-gradient-to-br from-[#DC2626] to-[#EF4444]',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#DC2626]/30 to-[#EF4444]/30'
  },
  { 
    id: 'amber', 
    name: 'Âmbar Dourado', 
    value: 'bg-gradient-to-br from-[#F59E0B] to-[#FBBF24]',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#F59E0B]/30 to-[#FBBF24]/30'
  },
  { 
    id: 'cyan', 
    name: 'Ciano Neon', 
    value: 'bg-gradient-to-br from-[#06B6D4] to-[#22D3EE]',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#06B6D4]/30 to-[#22D3EE]/30'
  },
  { 
    id: 'indigo', 
    name: 'Índigo Místico', 
    value: 'bg-gradient-to-br from-[#4F46E5] to-[#6366F1]',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#4F46E5]/30 to-[#6366F1]/30'
  },
  { 
    id: 'rose', 
    name: 'Rosa Clássico', 
    value: 'bg-gradient-to-br from-[#F43F5E] to-[#FB7185]',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#F43F5E]/30 to-[#FB7185]/30'
  },
  { 
    id: 'lime', 
    name: 'Lima Vibrante', 
    value: 'bg-gradient-to-br from-[#65A30D] to-[#84CC16]',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#65A30D]/30 to-[#84CC16]/30'
  },
  { 
    id: 'violet', 
    name: 'Violeta Real', 
    value: 'bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6]',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#7C3AED]/30 to-[#8B5CF6]/30'
  },
  { 
    id: 'emerald', 
    name: 'Esmeralda Profunda', 
    value: 'bg-gradient-to-br from-[#059669] to-[#10B981]',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#059669]/30 to-[#10B981]/30'
  }
];

type ThemeContextType = {
  selectedGradient: GradientOption;
  setSelectedGradient: (gradient: GradientOption) => void;
  gradientOptions: GradientOption[];
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedGradient, setSelectedGradient] = useState(gradientOptions[0]);

  // Load saved gradient from localStorage on mount
  useEffect(() => {
    const savedGradient = localStorage.getItem('andcont_gradient');
    if (savedGradient) {
      try {
        const parsedGradient = JSON.parse(savedGradient);
        setSelectedGradient(parsedGradient);
      } catch (error) {
        console.error('Error parsing saved gradient:', error);
      }
    }
  }, []);

  // Apply the gradient to the document body when it changes
  useEffect(() => {
    // Remove all existing gradient classes from body
    document.body.className = document.body.className
      .split(' ')
      .filter(cls => !cls.startsWith('bg-gradient-to-'))
      .join(' ');
    
    // Add the new gradient class to body
    document.body.classList.add(...selectedGradient.value.split(' '));
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
