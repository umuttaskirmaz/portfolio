import { FaGithub, FaInstagram, FaLinkedinIn } from "react-icons/fa6";
import { MdAlternateEmail } from "react-icons/md";
import "./styles/SocialIcons.css";
import { TbNotes } from "react-icons/tb";
import { useEffect } from "react";
import HoverLinks from "./HoverLinks";
import { profile, siteCopy } from "../data/portfolioData";
import { useLocale } from "../context/LocaleProvider";

const SocialIcons = () => {
  const { locale } = useLocale();
  const copy = siteCopy[locale];

  useEffect(() => {
    const social = document.getElementById("social");
    if (!social) return;

    const cleanupFns: Array<() => void> = [];

    social.querySelectorAll("span").forEach((item) => {
      const elem = item as HTMLElement;
      const link = elem.querySelector("a") as HTMLElement | null;
      if (!link) return;

      let rect = elem.getBoundingClientRect();
      let mouseX = rect.width / 2;
      let mouseY = rect.height / 2;
      let currentX = mouseX;
      let currentY = mouseY;
      let frameId = 0;

      const updatePosition = () => {
        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;

        link.style.setProperty("--siLeft", `${currentX}px`);
        link.style.setProperty("--siTop", `${currentY}px`);

        frameId = requestAnimationFrame(updatePosition);
      };

      const onMouseMove = (e: MouseEvent) => {
        rect = elem.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x < 40 && x > 10 && y < 40 && y > 5) {
          mouseX = x;
          mouseY = y;
        } else {
          mouseX = rect.width / 2;
          mouseY = rect.height / 2;
        }
      };

      document.addEventListener("mousemove", onMouseMove);
      frameId = requestAnimationFrame(updatePosition);

      cleanupFns.push(() => {
        cancelAnimationFrame(frameId);
        document.removeEventListener("mousemove", onMouseMove);
      });
    });

    return () => {
      cleanupFns.forEach((cleanup) => cleanup());
    };
  }, []);

  return (
    <div className="icons-section">
      <div className="social-icons" data-cursor="icons" id="social">
        <span>
          <a href={profile.social.github} target="_blank" rel="noreferrer">
            <FaGithub />
          </a>
        </span>
        <span>
          <a href={profile.social.linkedin} target="_blank" rel="noreferrer">
            <FaLinkedinIn />
          </a>
        </span>
        <span>
          <a href={profile.social.instagram} target="_blank" rel="noreferrer">
            <FaInstagram />
          </a>
        </span>
        <span>
          <a href={`mailto:${profile.email}`} target="_blank" rel="noreferrer">
            <MdAlternateEmail />
          </a>
        </span>
      </div>
      <a
        className="resume-button"
        href={profile.cv[locale]}
        target="_blank"
        rel="noreferrer"
      >
        <HoverLinks text={copy.socialButton} />
        <span>
          <TbNotes />
        </span>
      </a>
    </div>
  );
};

export default SocialIcons;
