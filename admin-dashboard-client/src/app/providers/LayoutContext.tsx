import { createContext, useContext, useState } from "react";

interface LayoutContextType {
  searchPlaceholder: string;
  setSearchPlaceholder: (placeholder: string) => void;
}

const LayoutContext = createContext<LayoutContextType>({
  searchPlaceholder: "Search across architecture...",
  setSearchPlaceholder: () => {},
});

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [searchPlaceholder, setSearchPlaceholder] = useState(
    "Search across architecture..."
  );

  return (
    <LayoutContext.Provider value={{ searchPlaceholder, setSearchPlaceholder }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayoutContext() {
  return useContext(LayoutContext);
}
