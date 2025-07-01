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
  },
  { 
    id: 'sunset', 
    name: 'Pôr do Sol Tropical', 
    value: 'bg-gradient-to-br from-[#FF6B6B] via-[#FFE66D] to-[#FF6B35]',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#FF6B6B]/30 via-[#FFE66D]/30 to-[#FF6B35]/30'
  },
  { 
    id: 'aurora', 
    name: 'Aurora Boreal', 
    value: 'bg-gradient-to-br from-[#00C9FF] via-[#92FE9D] to-[#00C9FF]',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#00C9FF]/30 via-[#92FE9D]/30 to-[#00C9FF]/30'
  },
  { 
    id: 'cosmic', 
    name: 'Cósmico', 
    value: 'bg-gradient-to-br from-[#667eea] via-[#764ba2] to-[#f093fb]',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#667eea]/30 via-[#764ba2]/30 to-[#f093fb]/30'
  },
  { 
    id: 'fire', 
    name: 'Chamas', 
    value: 'bg-gradient-to-br from-[#f12711] to-[#f5af19]',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#f12711]/30 to-[#f5af19]/30'
  },
  { 
    id: 'ocean', 
    name: 'Oceano Profundo', 
    value: 'bg-gradient-to-br from-[#2E3192] to-[#1BFFFF]',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#2E3192]/30 to-[#1BFFFF]/30'
  },
  { 
    id: 'paradise', 
    name: 'Paraíso Tropical', 
    value: 'bg-gradient-to-br from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB]',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#1FA2FF]/30 via-[#12D8FA]/30 to-[#A6FFCB]/30'
  },
  { 
    id: 'galaxy', 
    name: 'Galáxia', 
    value: 'bg-gradient-to-br from-[#360033] via-[#0b8793] to-[#360033]',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#360033]/30 via-[#0b8793]/30 to-[#360033]/30'
  },
  { 
    id: 'spring', 
    name: 'Primavera', 
    value: 'bg-gradient-to-br from-[#c471f5] via-[#fa71cd] to-[#c471f5]',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#c471f5]/30 via-[#fa71cd]/30 to-[#c471f5]/30'
  },
  { 
    id: 'neon', 
    name: 'Neon Cyberpunk', 
    value: 'bg-gradient-to-br from-[#FC466B] to-[#3F5EFB]',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#FC466B]/30 to-[#3F5EFB]/30'
  },
  { 
    id: 'forest', 
    name: 'Floresta Mágica', 
    value: 'bg-gradient-to-br from-[#134E5E] to-[#71B280]',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#134E5E]/30 to-[#71B280]/30'
  },
  { 
    id: 'desert', 
    name: 'Deserto Dourado', 
    value: 'bg-gradient-to-br from-[#FDBB2D] to-[#22C1C3]',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#FDBB2D]/30 to-[#22C1C3]/30'
  },
  { 
    id: 'royal', 
    name: 'Real Dourado', 
    value: 'bg-gradient-to-br from-[#8360c3] to-[#2ebf91]',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#8360c3]/30 to-[#2ebf91]/30'
  },
  { 
    id: 'volcano', 
    name: 'Vulcão', 
    value: 'bg-gradient-to-br from-[#ff9a9e] via-[#fecfef] to-[#fecfef]',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#ff9a9e]/30 via-[#fecfef]/30 to-[#fecfef]/30'
  },
  { 
    id: 'arctic', 
    name: 'Ártico', 
    value: 'bg-gradient-to-br from-[#74b9ff] to-[#0984e3]',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#74b9ff]/30 to-[#0984e3]/30'
  },
  { 
    id: 'rainbow', 
    name: 'Arco-íris', 
    value: 'bg-gradient-to-br from-[#ff9a56] via-[#ff6b95] via-[#c44569] to-[#f8b500]',
    textColor: 'text-white',
    calendarColor: 'bg-gradient-to-br from-[#ff9a56]/30 via-[#ff6b95]/30 via-[#c44569]/30 to-[#f8b500]/30'
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
        const foundGradient = gradientOptions.find(g => g.id === parsedGradient.id);
        if (foundGradient) {
          setSelectedGradient(foundGradient);
        }
      } catch (error) {
        console.error('Error parsing saved gradient:', error);
      }
    }
  }, []);

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
