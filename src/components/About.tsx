import "./styles/About.css";
import { useLocale } from "../context/LocaleProvider";
import { siteCopy } from "../data/portfolioData";

const About = () => {
  const { locale } = useLocale();
  const copy = siteCopy[locale];

  return (
    <div className="about-section" id="about" key={locale}>
      <div className="about-me" key={`about-${locale}`}>
        <h3 className="title">{copy.aboutTitle}</h3>
        <p className="para">{copy.aboutText}</p>
      </div>
    </div>
  );
};

export default About;
