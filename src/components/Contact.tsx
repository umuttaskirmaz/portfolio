import { MdArrowOutward, MdCopyright } from "react-icons/md";
import "./styles/Contact.css";
import { education, profile, siteCopy } from "../data/portfolioData";
import { useLocale } from "../context/LocaleProvider";

const Contact = () => {
  const { locale } = useLocale();
  const copy = siteCopy[locale];
  const currentYear = new Date().getFullYear();

  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>{copy.contactTitle}</h3>
        <div className="contact-flex">
          <div className="contact-box">
            <h4>{copy.contactLabels.email}</h4>
            <p>
              <a href={`mailto:${profile.email}`} data-cursor="disable">
                {profile.email}
              </a>
            </p>
            <h4>{copy.contactLabels.phone}</h4>
            <p>
              <a href="tel:+905384487416" data-cursor="disable">
                {profile.phone}
              </a>
            </p>
            <h4>{copy.contactLabels.education}</h4>
            <p>{education[locale]}</p>
          </div>
          <div className="contact-box">
            <h4>{copy.contactLabels.links}</h4>
            <a
              href={profile.social.github}
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              Github <MdArrowOutward />
            </a>
            <a
              href={profile.social.linkedin}
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              Linkedin <MdArrowOutward />
            </a>
            <a
              href={profile.social.instagram}
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              Instagram <MdArrowOutward />
            </a>
            <a
              href={profile.cv.tr}
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              CV (TR) <MdArrowOutward />
            </a>
            <a
              href={profile.cv.en}
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              CV (EN) <MdArrowOutward />
            </a>
          </div>
          <div className="contact-box">
            <h2>
              <span>Umut Kadir Taşkırmaz</span>
              <br /> {copy.contactLabels.builtFor}
            </h2>
            <h5>
              <MdCopyright /> {currentYear}
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
