import { SplitText } from "gsap-trial/SplitText";
import gsap from "gsap";
import { smoother } from "../Navbar";

let activeSplits: SplitText[] = [];
let activeAnimations: gsap.core.Animation[] = [];
let activeLoopTimelines: gsap.core.Timeline[] = [];

function resetLandingFX() {
  activeLoopTimelines.forEach((timeline) => timeline.kill());
  activeAnimations.forEach((animation) => animation.kill());
  activeSplits
    .slice()
    .reverse()
    .forEach((split) => split.revert());

  activeLoopTimelines = [];
  activeAnimations = [];
  activeSplits = [];
}

function buildLandingFX(animateHeader = false) {
  const textProps = { type: "chars,lines", linesClass: "split-h2" };
  const introText = new SplitText(
    [".landing-info h3", ".landing-intro h2", ".landing-intro h1"],
    {
      type: "chars,lines",
      linesClass: "split-line",
    }
  );
  const primaryBottom = new SplitText(".landing-h2-info", textProps);
  const secondaryBottom = new SplitText(".landing-h2-info-1", textProps);
  const secondaryTop = new SplitText(".landing-h2-1", textProps);
  const primaryTop = new SplitText(".landing-h2-2", textProps);

  activeSplits.push(
    introText,
    primaryBottom,
    secondaryBottom,
    secondaryTop,
    primaryTop
  );

  activeAnimations.push(
    gsap.fromTo(
      introText.chars,
      { opacity: 0, y: 80, filter: "blur(5px)" },
      {
        opacity: 1,
        duration: 1.2,
        filter: "blur(0px)",
        ease: "power3.inOut",
        y: 0,
        stagger: 0.025,
        delay: 0.3,
      }
    ),
    gsap.fromTo(
      primaryBottom.chars,
      { opacity: 0, y: 80, filter: "blur(5px)" },
      {
        opacity: 1,
        duration: 1.2,
        filter: "blur(0px)",
        ease: "power3.inOut",
        y: 0,
        stagger: 0.025,
        delay: 0.3,
      }
    ),
    gsap.fromTo(
      ".landing-info-h2",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        duration: 1.2,
        ease: "power1.inOut",
        y: 0,
        delay: 0.8,
      }
    )
  );

  if (animateHeader) {
    activeAnimations.push(
      gsap.fromTo(
        [".header", ".icons-section", ".nav-fade"],
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1.2,
          ease: "power1.inOut",
          delay: 0.1,
        }
      )
    );
  }

  activeLoopTimelines.push(
    LoopText(primaryBottom, secondaryBottom),
    LoopText(secondaryTop, primaryTop)
  );
}

export function initialFX() {
  document.body.style.overflowY = "auto";
  smoother.paused(false);
  document.getElementsByTagName("main")[0].classList.add("main-active");
  gsap.to("body", {
    backgroundColor: "#0b080c",
    duration: 0.5,
    delay: 1,
  });
  resetLandingFX();
  buildLandingFX(true);
}

export function refreshLandingFX() {
  resetLandingFX();
  buildLandingFX(false);
}

function LoopText(Text1: SplitText, Text2: SplitText) {
  const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
  const delay = 4;
  const delay2 = delay * 2 + 1;

  tl.fromTo(
    Text2.chars,
    { opacity: 0, y: 80 },
    {
      opacity: 1,
      duration: 1.2,
      ease: "power3.inOut",
      y: 0,
      stagger: 0.1,
      delay: delay,
    },
    0
  )
    .fromTo(
      Text1.chars,
      { y: 80 },
      {
        duration: 1.2,
        ease: "power3.inOut",
        y: 0,
        stagger: 0.1,
        delay: delay2,
      },
      1
    )
    .fromTo(
      Text1.chars,
      { y: 0 },
      {
        y: -80,
        duration: 1.2,
        ease: "power3.inOut",
        stagger: 0.1,
        delay: delay,
      },
      0
    )
    .to(
      Text2.chars,
      {
        y: -80,
        duration: 1.2,
        ease: "power3.inOut",
        stagger: 0.1,
        delay: delay2,
      },
      1
    );

  return tl;
}
