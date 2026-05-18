import { lazy, Suspense, useEffect, useState } from "react";
import "./App.css";

const CharacterModel = lazy(() => import("./components/Character"));
const MainContainer = lazy(() => import("./components/MainContainer"));
import { LoadingProvider } from "./context/LoadingProvider";
import { LocaleProvider, useLocale } from "./context/LocaleProvider";

const CharacterSlot = ({
  shouldRenderCharacter,
}: {
  shouldRenderCharacter: boolean;
}) => {
  const { locale } = useLocale();

  if (!shouldRenderCharacter) {
    return null;
  }

  return <CharacterModel key={locale} />;
};

const AppContent = ({
  shouldRenderCharacter,
}: {
  shouldRenderCharacter: boolean;
}) => {
  const { locale } = useLocale();

  return (
    <MainContainer key={locale}>
      <Suspense fallback={null}>
        <CharacterSlot shouldRenderCharacter={shouldRenderCharacter} />
      </Suspense>
    </MainContainer>
  );
};

const App = () => {
  const [shouldRenderCharacter, setShouldRenderCharacter] = useState(() =>
    window.innerWidth <= 1024
  );

  useEffect(() => {
    if (window.innerWidth <= 1024) {
      setShouldRenderCharacter(true);
      return;
    }

    let timeoutId: number | undefined;
    let idleId: number | undefined;

    const queueCharacterLoad = () => {
      if ("requestIdleCallback" in window) {
        idleId = window.requestIdleCallback(() => {
          setShouldRenderCharacter(true);
        }, { timeout: 1500 });
        return;
      }

      setShouldRenderCharacter(true);
    };

    timeoutId = window.setTimeout(queueCharacterLoad, 250);

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
      if (idleId && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
    };
  }, []);

  return (
    <>
      <LocaleProvider>
        <LoadingProvider>
          <Suspense fallback={null}>
            <AppContent shouldRenderCharacter={shouldRenderCharacter} />
          </Suspense>
        </LoadingProvider>
      </LocaleProvider>
    </>
  );
};

export default App;
