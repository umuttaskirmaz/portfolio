import { PropsWithChildren, useEffect, useRef } from "react";
import "./styles/Landing.css";
import { profile } from "../data/portfolioData";
import { useLocale } from "../context/LocaleProvider";
import { siteCopy } from "../data/portfolioData";
import { useLoading } from "../context/LoadingProvider";

const Landing = ({ children }: PropsWithChildren) => {
  const { locale } = useLocale();
  const { isLoading } = useLoading();
  const copy = siteCopy[locale];
  const hasMounted = useRef(false);

  useEffect(() => {
    if (isLoading) return;
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    let cancelled = false;
    const syncLanding = async () => {
      const module = await import("./utils/initialFX");
      if (!cancelled) {
        requestAnimationFrame(() => {
          module.refreshLandingFX();
        });
      }
    };

    syncLanding();

    return () => {
      cancelled = true;
    };
  }, [locale, isLoading]);

  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container" key={locale}>
          <div className="landing-intro">
            <h2>{copy.hero.intro}</h2>
            <h1>
              {profile.firstName}
              <br />
              <span>{profile.lastName}</span>
            </h1>
          </div>
          <div
            className={`landing-info ${
              locale === "en" ? "landing-info-compact" : ""
            }`}
          >
            <h3>{copy.hero.lead}</h3>
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">{copy.hero.roleSecondary}</div>
              <div className="landing-h2-2">{copy.hero.rolePrimary}</div>
            </h2>
            <h2>
              <div className="landing-h2-info">{copy.hero.rolePrimary}</div>
              <div className="landing-h2-info-1">{copy.hero.roleSecondary}</div>
            </h2>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
