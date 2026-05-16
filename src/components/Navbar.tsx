import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap-trial/ScrollSmoother";
import "./styles/Navbar.css";
import { useLocale } from "../context/LocaleProvider";
import { siteCopy } from "../data/portfolioData";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
export let smoother: ScrollSmoother;

const Navbar = () => {
  const { locale, setLocale } = useLocale();
  const copy = siteCopy[locale];

  useEffect(() => {
    smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.7,
      speed: 1.7,
      effects: true,
      autoResize: true,
      ignoreMobileResize: true,
    });

    smoother.scrollTop(0);
    smoother.paused(true);

    let links = document.querySelectorAll(".header ul a");
    links.forEach((elem) => {
      let element = elem as HTMLAnchorElement;
      element.addEventListener("click", (e) => {
        if (window.innerWidth > 1024) {
          e.preventDefault();
          let elem = e.currentTarget as HTMLAnchorElement;
          let section = elem.getAttribute("data-href");
          smoother.scrollTo(section, true, "top top");
        }
      });
    });
    window.addEventListener("resize", () => {
      ScrollSmoother.refresh(true);
    });
  }, []);
  return (
    <>
      <label className="navbar-locale-floating" data-cursor="disable">
        <select
          value={locale}
          onChange={(e) => setLocale(e.target.value as "tr" | "en")}
          aria-label="Language selector"
        >
          <option value="tr">Türkçe</option>
          <option value="en">English</option>
        </select>
      </label>
      <div className="header">
        <a
          href="mailto:umuttashko@gmail.com"
          className="navbar-connect"
          data-cursor="disable"
        >
          umuttashko@gmail.com
        </a>
        <ul>
          <li>
            <a data-href="#about" href="#about">
              <HoverLinks text={copy.nav.about} />
            </a>
          </li>
          <li>
            <a data-href="#work" href="#work">
              <HoverLinks text={copy.nav.work} />
            </a>
          </li>
          <li>
            <a data-href="#contact" href="#contact">
              <HoverLinks text={copy.nav.contact} />
            </a>
          </li>
        </ul>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
