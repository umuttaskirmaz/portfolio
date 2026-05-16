import { lazy, Suspense } from "react";
import "./App.css";

const CharacterModel = lazy(() => import("./components/Character"));
const MainContainer = lazy(() => import("./components/MainContainer"));
import { LoadingProvider } from "./context/LoadingProvider";
import { LocaleProvider } from "./context/LocaleProvider";

const App = () => {
  return (
    <>
      <LocaleProvider>
        <LoadingProvider>
          <Suspense>
            <MainContainer>
              <Suspense>
                <CharacterModel />
              </Suspense>
            </MainContainer>
          </Suspense>
        </LoadingProvider>
      </LocaleProvider>
    </>
  );
};

export default App;
