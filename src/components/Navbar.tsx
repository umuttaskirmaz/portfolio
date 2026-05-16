import { useEffect } from "react";
import HoverLinks from "./HoverLinks";
import "./styles/Navbar.css";
import { useLocale } from "../context/LocaleProvider";
import { siteCopy } from "../data/portfolioData";

const Navbar = () => {
  const { locale, setLocale } = useLocale();
  const copy = siteCopy[locale];

  useEffect(() => {
    let links = document.querySelectorAll(".header ul a");
    links.forEach((elem) => {
      let element = elem as HTMLAnchorElement;
      element.addEventListener("click", (e) => {
        e.preventDefault();
        let elem = e.currentTarget as HTMLAnchorElement;
        let section = elem.getAttribute("data-href");
        if (section) {
          document.querySelector(section)?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
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
