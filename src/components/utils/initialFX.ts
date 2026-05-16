import gsap from "gsap";

let activeAnimations: gsap.core.Animation[] = [];
let activeLoopTimelines: gsap.core.Timeline[] = [];

function resetLandingFX() {
  activeLoopTimelines.forEach((timeline) => timeline.kill());
  activeAnimations.forEach((animation) => animation.kill());
  activeLoopTimelines = [];
  activeAnimations = [];
}

function buildLandingFX(animateHeader = false) {
  activeAnimations.push(
    gsap.fromTo(
      [".landing-info h3", ".landing-intro h2", ".landing-intro h1"],
      { opacity: 0, y: 80, filter: "blur(5px)" },
      {
        opacity: 1,
        duration: 1.2,
        filter: "blur(0px)",
        ease: "power3.inOut",
        y: 0,
        stagger: 0.12,
        delay: 0.3,
      }
    ),
    gsap.fromTo(
      ".landing-h2-info",
      { opacity: 0, y: 80, filter: "blur(5px)" },
      {
        opacity: 1,
        duration: 1.2,
        filter: "blur(0px)",
        ease: "power3.inOut",
        y: 0,
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
    loopText(".landing-h2-info", ".landing-h2-info-1"),
    loopText(".landing-h2-1", ".landing-h2-2")
  );
}

export function initialFX() {
  document.body.style.overflowY = "auto";
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

function loopText(primarySelector: string, secondarySelector: string) {
  const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
  const delay = 4;
  const delay2 = delay * 2 + 1;

  gsap.set(secondarySelector, { opacity: 0, y: 80 });

  tl.to(primarySelector, {
    y: -80,
    opacity: 0,
    duration: 1.2,
    ease: "power3.inOut",
    delay,
  })
    .to(
      secondarySelector,
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.inOut",
      },
      "<"
    )
    .to(secondarySelector, {
      y: -80,
      opacity: 0,
      duration: 1.2,
      ease: "power3.inOut",
      delay: delay2,
    })
    .to(
      primarySelector,
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.inOut",
      },
      "<"
    );

  return tl;
}
