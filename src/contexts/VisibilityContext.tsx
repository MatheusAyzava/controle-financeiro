import { createContext, useContext, useState, ReactNode } from 'react';

interface VisibilityContextType {
  valoresVisiveis: boolean;
  toggleValores: () => void;
}

const VisibilityContext = createContext<VisibilityContextType | undefined>(undefined);

export function VisibilityProvider({ children }: { children: ReactNode }) {
  const [valoresVisiveis, setValoresVisiveis] = useState(false);
  const toggleValores = () => setValoresVisiveis(prev => !prev);

  return (
    <VisibilityContext.Provider value={{ valoresVisiveis, toggleValores }}>
      {children}
    </VisibilityContext.Provider>
  );
}

export function useVisibility() {
  const context = useContext(VisibilityContext);
  if (context === undefined) {
    throw new Error('useVisibility must be used within a VisibilityProvider');
  }
  return context;
}
