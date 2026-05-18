import { useEffect, useState } from "react";
import "./styles/Loading.css";
import { useLoading } from "../context/LoadingProvider";
import { profile } from "../data/portfolioData";
import { useLocale } from "../context/LocaleProvider";
import { siteCopy } from "../data/portfolioData";

const Loading = () => {
  const { setIsLoading } = useLoading();
  const { locale } = useLocale();
  const copy = siteCopy[locale];
  const [percent, setPercent] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [hoverPoint, setHoverPoint] = useState({ x: "50%", y: "50%" });

  useEffect(() => {
    let animationFrameId = 0;
    let startTime = 0;
    const duration = 650;

    const animateProgress = (timestamp: number) => {
      if (!startTime) {
        startTime = timestamp;
      }

      const elapsed = timestamp - startTime;
      const nextPercent = Math.min(100, Math.round((elapsed / duration) * 100));
      setPercent((current) => (nextPercent > current ? nextPercent : current));

      if (nextPercent < 100) {
        animationFrameId = window.requestAnimationFrame(animateProgress);
      }
    };

    animationFrameId = window.requestAnimationFrame(animateProgress);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    if (percent < 100 || loaded) return;

    const loadedTimeout = window.setTimeout(() => {
      setLoaded(true);
    }, 120);

    return () => {
      window.clearTimeout(loadedTimeout);
    };
  }, [percent, loaded]);

  useEffect(() => {
    if (!loaded || isLoaded) return;

    const isLoadedTimeout = window.setTimeout(() => {
      setIsLoaded(true);
    }, 160);

    return () => {
      window.clearTimeout(isLoadedTimeout);
    };
  }, [loaded, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;

    let timeoutId: number | undefined;
    let animationFrameId = 0;

    setClicked(true);
    timeoutId = window.setTimeout(() => {
      setIsLoading(false);
      animationFrameId = window.requestAnimationFrame(() => {
        import("./utils/initialFX").then((module) => {
          module.initialFX?.();
        });
      });
    }, 180);

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [isLoaded]);

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    if (clicked) return;
    const { currentTarget: target } = e;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setHoverPoint({ x: `${x}px`, y: `${y}px` });
  }

  return (
    <>
      <div className="loading-header">
        <a href="/#" className="loader-title" data-cursor="disable">
          {profile.shortName}
        </a>
        <div className={`loaderGame ${clicked && "loader-out"}`}>
          <div className="loaderGame-container">
            <div className="loaderGame-in">
              {[...Array(27)].map((_, index) => (
                <div className="loaderGame-line" key={index}></div>
              ))}
            </div>
            <div className="loaderGame-ball"></div>
          </div>
        </div>
      </div>
      <div className="loading-screen">
        <div className="loading-marquee">
          <span> {copy.loadingTicker[0]}</span>
          <span> {copy.loadingTicker[1]}</span>
        </div>
        <div
          className={`loading-wrap ${clicked && "loading-clicked"}`}
          onMouseMove={(e) => handleMouseMove(e)}
          style={
            {
              "--mouse-x": hoverPoint.x,
              "--mouse-y": hoverPoint.y,
            } as React.CSSProperties
          }
        >
          <div className="loading-hover"></div>
          <div className={`loading-button ${loaded && "loading-complete"}`}>
            <div className="loading-container">
              <div className="loading-content">
                <div className="loading-content-in">
                  {copy.loadingText} <span>{percent}%</span>
                </div>
              </div>
              <div className="loading-box"></div>
            </div>
            <div className="loading-content2">
              <span>{copy.welcomeText}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Loading;
