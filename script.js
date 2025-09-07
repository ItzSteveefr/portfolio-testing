console.log("Standalone Preloader script.js is loaded ✅");

gsap.registerPlugin(SplitText);

function initPreloader() {
  // Create split text elements for preloader only
  function createSplitTexts(elements) {
    const splits = {};

    elements.forEach(({ key, selector, type }) => {
      const config = { type, mask: type };

      if (type === "chars") config.charsClass = "char";
      if (type === "lines") config.linesClass = "line";
      splits[key] = SplitText.create(selector, config);
    });

    return splits;
  }

  // Only preloader-related split text elements
  const splitElements = [
    { key: "logoChars", selector: ".preloader-logo h1", type: "chars" },
    { key: "footerLines", selector: ".preloader-footer p", type: "lines" },
  ];

  const splits = createSplitTexts(splitElements);

  // Initial states for preloader animations
  gsap.set([splits.logoChars.chars], { x: "100%" });
  gsap.set([splits.footerLines.lines], { y: "100%" });
  
  // Initially hide the main page content
  gsap.set("#page-content", { opacity: 0 });

  // Progress bar animation function
  function animateProgress(duration = 4) {
    const tl = gsap.timeline();
    const counterSteps = 5;
    let currentProgress = 0;

    for (let i = 0; i < counterSteps; i++) {
      const finalStep = i === counterSteps - 1;
      const targetProgress = finalStep
        ? 1
        : Math.min(currentProgress + Math.random() * 0.3 + 0.1, 0.9);
      currentProgress = targetProgress;

      tl.to(".preloader-progress-bar", {
        scaleX: targetProgress,
        duration: duration / counterSteps,
        ease: "power2.out",
      });
    }

    return tl;
  }

  // Main preloader timeline
  const tl = gsap.timeline({ 
    delay: 0.5,
    onComplete: () => {
      // Show main page content after preloader finishes
      gsap.to("#page-content", {
        opacity: 1,
        duration: 1,
        ease: "power3.out"
      });
    }
  });

  tl.to(splits.logoChars.chars, {
    x: "0%",
    stagger: 0.05,
    duration: 1,
    ease: "power4.inOut",
  })
    .to(
      splits.footerLines.lines,
      {
        y: "0%",
        stagger: 0.1,
        duration: 1,
        ease: "power4.inOut",
      },
      "0.25",
    )
    .add(animateProgress(), "<")
    .set(".preloader-progress", { backgroundColor: "var(--base-300)" })
    .to(
      splits.logoChars.chars,
      {
        x: "-100%",
        stagger: 0.05,
        duration: 1,
        ease: "power4.inOut",
      },
      "-=0.5",
    )
    .to(
      splits.footerLines.lines,
      {
        y: "-100%",
        stagger: 0.1,
        duration: 1,
        ease: "power4.inOut",
      },
      "<",
    )
    .to(
      ".preloader-progress",
      {
        opacity: 0,
        duration: 0.5,
        ease: "power3.out",
      },
      "-=0.25",
    )
    .to(
      ".preloader-mask",
      {
        scale: 5,
        duration: 2.5,
        ease: "power3.out",
      },
      "<",
    );
}

// Initialize preloader when fonts are ready
document.fonts.ready.then(() => {
  initPreloader();
});
