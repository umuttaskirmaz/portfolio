import "./styles/Career.css";
import { useLocale } from "../context/LocaleProvider";
import { siteCopy } from "../data/portfolioData";

const Career = () => {
  const { locale } = useLocale();
  const copy = siteCopy[locale];

  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          {copy.journeyTitle} <span>&</span>
          <br /> {copy.journeyAccent}
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          {copy.journey.map((item) => (
            <div className="career-info-box" key={item.period + item.role}>
              <div className="career-info-in">
                <div className="career-role">
                  <h4>{item.role}</h4>
                  <h5>{item.org}</h5>
                </div>
                <h3>{item.period}</h3>
              </div>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Career;
