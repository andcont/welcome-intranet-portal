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
    value: 'bg-gradient-to-br from-[#7B68EE]/30 to-[#D946EF]/30',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#7B68EE]/30 to-[#D946EF]/30'
  },
  { 
    id: 'blue', 
    name: 'Azul Oceano', 
    value: 'bg-gradient-to-br from-[#0EA5E9]/30 to-[#3B82F6]/30',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#0EA5E9]/30 to-[#3B82F6]/30'
  },
  { 
    id: 'green', 
    name: 'Verde Esmeralda', 
    value: 'bg-gradient-to-br from-[#10B981]/30 to-[#34D399]/30',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#10B981]/30 to-[#34D399]/30'
  },
  { 
    id: 'orange', 
    name: 'Laranja Sunset', 
    value: 'bg-gradient-to-br from-[#F97316]/30 to-[#FB923C]/30',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#F97316]/30 to-[#FB923C]/30'
  },
  { 
    id: 'teal', 
    name: 'Turquesa', 
    value: 'bg-gradient-to-br from-[#14B8A6]/30 to-[#2DD4BF]/30',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#14B8A6]/30 to-[#2DD4BF]/30'
  },
  { 
    id: 'purple', 
    name: 'Roxo Profundo', 
    value: 'bg-gradient-to-br from-[#8B5CF6]/30 to-[#A78BFA]/30',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#8B5CF6]/30 to-[#A78BFA]/30'
  },
  { 
    id: 'pink', 
    name: 'Rosa Neon', 
    value: 'bg-gradient-to-br from-[#EC4899]/30 to-[#F472B6]/30',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#EC4899]/30 to-[#F472B6]/30'
  },
  { 
    id: 'midnight', 
    name: 'Meia-Noite', 
    value: 'bg-gradient-to-br from-[#1E293B]/30 to-[#334155]/30',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#1E293B]/30 to-[#334155]/30'
  },
  { 
    id: 'crimson', 
    name: 'Carmesim', 
    value: 'bg-gradient-to-br from-[#DC2626]/30 to-[#EF4444]/30',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#DC2626]/30 to-[#EF4444]/30'
  },
  { 
    id: 'amber', 
    name: 'Âmbar Dourado', 
    value: 'bg-gradient-to-br from-[#F59E0B]/30 to-[#FBBF24]/30',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#F59E0B]/30 to-[#FBBF24]/30'
  },
  { 
    id: 'cyan', 
    name: 'Ciano Neon', 
    value: 'bg-gradient-to-br from-[#06B6D4]/30 to-[#22D3EE]/30',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#06B6D4]/30 to-[#22D3EE]/30'
  },
  { 
    id: 'indigo', 
    name: 'Índigo Místico', 
    value: 'bg-gradient-to-br from-[#4F46E5]/30 to-[#6366F1]/30',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#4F46E5]/30 to-[#6366F1]/30'
  },
  { 
    id: 'rose', 
    name: 'Rosa Clássico', 
    value: 'bg-gradient-to-br from-[#F43F5E]/30 to-[#FB7185]/30',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#F43F5E]/30 to-[#FB7185]/30'
  },
  { 
    id: 'lime', 
    name: 'Lima Vibrante', 
    value: 'bg-gradient-to-br from-[#65A30D]/30 to-[#84CC16]/30',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#65A30D]/30 to-[#84CC16]/30'
  },
  { 
    id: 'violet', 
    name: 'Violeta Real', 
    value: 'bg-gradient-to-br from-[#7C3AED]/30 to-[#8B5CF6]/30',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#7C3AED]/30 to-[#8B5CF6]/30'
  },
  { 
    id: 'emerald', 
    name: 'Esmeralda Profunda', 
    value: 'bg-gradient-to-br from-[#059669]/30 to-[#10B981]/30',
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
    
    // Apply the site background gradient
    document.documentElement.classList.add('gradient-theme-applied');
    
    // Set body to full height and width
    document.body.style.minHeight = '100vh';
    document.body.style.width = '100%';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
  }, []);

  // Apply the gradient to the root element whenever it changes
  useEffect(() => {
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    
    // Remove all existing gradient classes
    gradientOptions.forEach(opt => {
      htmlElement.classList.remove(`gradient-${opt.id}`);
    });
    
    // Add the selected gradient class
    htmlElement.classList.add(`gradient-${selectedGradient.id}`);
    
    // Update the body background to match
    bodyElement.className = `${selectedGradient.value} w-full min-h-screen`;
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
