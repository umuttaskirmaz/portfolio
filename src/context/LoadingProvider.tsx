import {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from "react";
import Loading from "../components/Loading";

interface LoadingType {
  isLoading: boolean;
  setIsLoading: (state: boolean) => void;
  restartLoading: () => void;
}

export const LoadingContext = createContext<LoadingType | null>(null);

export const LoadingProvider = ({ children }: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingKey, setLoadingKey] = useState(0);

  const restartLoading = () => {
    document.body.style.overflowY = "hidden";
    document.getElementsByTagName("main")[0]?.classList.remove("main-active");
    setLoadingKey((current) => current + 1);
    setIsLoading(true);
  };

  const value = {
    isLoading,
    setIsLoading,
    restartLoading,
  };

  return (
    <LoadingContext.Provider value={value as LoadingType}>
      {isLoading && <Loading key={loadingKey} />}
      <main className="main-body">{children}</main>
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
