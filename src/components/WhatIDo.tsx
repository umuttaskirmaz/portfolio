import { useEffect, useRef } from "react";
import "./styles/WhatIDo.css";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocale } from "../context/LocaleProvider";
import { siteCopy } from "../data/portfolioData";

const WhatIDo = () => {
  const { locale } = useLocale();
  const copy = siteCopy[locale];
  const focusCards = copy.focusCards;
  const containerRef = useRef<(HTMLDivElement | null)[]>([]);

  const setRef = (el: HTMLDivElement | null, index: number) => {
    containerRef.current[index] = el;
  };

  useEffect(() => {
    if (!ScrollTrigger.isTouch) return;

    const clickHandlers = new Map<HTMLDivElement, () => void>();

    containerRef.current.forEach((container) => {
      if (!container) return;
      container.classList.remove("what-noTouch");

      const onClick = () => handleClick(container);
      clickHandlers.set(container, onClick);
      container.addEventListener("click", onClick);
    });

    return () => {
      clickHandlers.forEach((handler, container) => {
        container.removeEventListener("click", handler);
      });
    };
  }, []);

  return (
    <div className="whatIDO" key={locale}>
      <div className="what-box">
        <h2 className="title">
          {copy.whatTitleTop.slice(0, 1)}
          <span className="hat-h2">{copy.whatTitleTop.slice(1)}</span>
          <div>
            {copy.whatTitleAccent.slice(0, 1)}
            <span className="do-h2">{copy.whatTitleAccent.slice(1)}</span>
          </div>
        </h2>
      </div>
      <div className="what-box">
        <div className="what-box-in">
          <div className="what-border2">
            <svg width="100%">
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="100%"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="7,7"
              />
              <line
                x1="100%"
                y1="0"
                x2="100%"
                y2="100%"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="7,7"
              />
            </svg>
          </div>
          <div
            className="what-content what-noTouch"
            ref={(el) => setRef(el, 0)}
          >
            <div className="what-border1">
              <svg height="100%">
                <line
                  x1="0"
                  y1="0"
                  x2="100%"
                  y2="0"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
                <line
                  x1="0"
                  y1="100%"
                  x2="100%"
                  y2="100%"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
              </svg>
            </div>
            <div className="what-corner"></div>

            <div className="what-content-in">
              <h3>{focusCards[0].title}</h3>
              <h4>{focusCards[0].subtitle}</h4>
              <p>{focusCards[0].description}</p>
              <h5>{copy.whatLabel}</h5>
              <div className="what-content-flex">
                {focusCards[0].tags.map((tag) => (
                  <div className="what-tags" key={tag}>
                    {tag}
                  </div>
                ))}
              </div>
              <div className="what-arrow"></div>
            </div>
          </div>
          <div
            className="what-content what-noTouch"
            ref={(el) => setRef(el, 1)}
          >
            <div className="what-border1">
              <svg height="100%">
                <line
                  x1="0"
                  y1="100%"
                  x2="100%"
                  y2="100%"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
              </svg>
            </div>
            <div className="what-corner"></div>
            <div className="what-content-in">
              <h3>{focusCards[1].title}</h3>
              <h4>{focusCards[1].subtitle}</h4>
              <p>{focusCards[1].description}</p>
              <h5>{copy.whatLabel}</h5>
              <div className="what-content-flex">
                {focusCards[1].tags.map((tag) => (
                  <div className="what-tags" key={tag}>
                    {tag}
                  </div>
                ))}
              </div>
              <div className="what-arrow"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatIDo;

function handleClick(container: HTMLDivElement) {
  container.classList.toggle("what-content-active");
  container.classList.remove("what-sibling");
  if (container.parentElement) {
    const siblings = Array.from(container.parentElement.children);

    siblings.forEach((sibling) => {
      if (sibling !== container) {
        sibling.classList.remove("what-content-active");
        sibling.classList.toggle("what-sibling");
      }
    });
  }
}
