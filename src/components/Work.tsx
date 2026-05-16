import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { projects } from "../data/portfolioData";
import { useLocale } from "../context/LocaleProvider";
import { siteCopy } from "../data/portfolioData";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const Work = () => {
  const { locale } = useLocale();
  const copy = siteCopy[locale];
  const sectionRef = useRef<HTMLDivElement>(null);
  const flexRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current || !flexRef.current || window.innerWidth <= 1024) {
        return;
      }

      const section = sectionRef.current;
      const container = section.querySelector(".work-container") as HTMLDivElement | null;
      const flex = flexRef.current;

      ScrollTrigger.getById("work")?.kill();
      gsap.set(flex, { x: 0, clearProps: "transform" });

      const getScrollDistance = () => {
        if (!container) return 0;
        const cards = flex.querySelectorAll(".work-box");
        const lastCard = cards[cards.length - 1] as HTMLElement | undefined;
        if (!lastCard) return 0;

        const flexStyles = window.getComputedStyle(flex);
        const leadingOffset = parseFloat(flexStyles.marginLeft) || 0;

        return Math.max(
          0,
          lastCard.offsetLeft + lastCard.offsetWidth - container.clientWidth + leadingOffset
        );
      };

      const updateSectionHeight = () => {
        section.style.setProperty(
          "--work-scroll-height",
          `${window.innerHeight + getScrollDistance()}px`
        );
      };

      updateSectionHeight();

      const timeline = gsap.timeline({
        scrollTrigger: {
          id: "work",
          trigger: section,
          start: "top top",
          end: () => `+=${getScrollDistance()}`,
          scrub: 1,
          pin: section.querySelector(".work-container"),
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: updateSectionHeight,
        },
      });

      timeline.to(flex, {
        x: () => -getScrollDistance(),
        ease: "none",
      });

      ScrollTrigger.refresh();

      return () => {
        ScrollTrigger.getById("work")?.kill();
        timeline.kill();
        gsap.set(flex, { x: 0, clearProps: "transform" });
        section.style.removeProperty("--work-scroll-height");
      };
    },
    { dependencies: [locale], scope: sectionRef }
  );

  return (
    <div className="work-section" id="work" ref={sectionRef}>
      <div className="work-container section-container">
        <h2>
          {copy.workTitle} <span>{copy.workAccent}</span>
        </h2>
        <div className="work-flex" ref={flexRef} key={locale}>
          {projects.map((project) => (
            <div
              className={`work-box ${
                "image" in project && project.image ? "" : "work-box-no-image"
              }`}
              key={project.id}
            >
              <div className="work-info">
                <div className="work-title">
                  <h3>{project.id}</h3>

                  <div>
                    <h4>{project.title[locale]}</h4>
                    <p>{project.category[locale]}</p>
                  </div>
                </div>
                <h4>{copy.workLabels.tools}</h4>
                <p>{project.tools[locale]}</p>
                <h4>{copy.workLabels.overview}</h4>
                <p>{project.summary[locale]}</p>
              </div>
              {"image" in project && project.image ? (
                <WorkImage
                  image={project.image}
                  alt={project.title[locale]}
                  link={"link" in project ? project.link : undefined}
                />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;
