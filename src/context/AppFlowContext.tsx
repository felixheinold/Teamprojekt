import { createContext, useState, useContext, useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

type AppFlowContextType = {
  selectedModule: string;
  setSelectedModule: (modul: string) => void;
  selectedChapter: string;
  setSelectedChapter: (chapter: string) => void;
};

export const AppFlowContext = createContext<AppFlowContextType>({
  selectedModule: "",
  setSelectedModule: () => {},
  selectedChapter: "",
  setSelectedChapter: () => {},
});

export const AppFlowProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedModule, setSelectedModule] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");

  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType === "POP") {
      if (location.pathname === "/" || location.pathname === "/modules") {
        setSelectedModule("");
        setSelectedChapter("");
      } else if (location.pathname.startsWith("/chapters")) {
        setSelectedChapter("");
      }
    }
  }, [location.pathname, navigationType]);

  return (
    <AppFlowContext.Provider
      value={{
        selectedModule,
        setSelectedModule,
        selectedChapter,
        setSelectedChapter,
      }}
    >
      {children}
    </AppFlowContext.Provider>
  );
};

export const useAppFlow = () => useContext(AppFlowContext);
