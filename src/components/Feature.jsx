import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const FONT_WEIGHT = {
     subtitle: { min: 100, max: 500, default: 100 },
};

const renderText = (text, className, baseWeight = 400) => {
     return [...text].map((char, index) => (
          <span
               className={className}
               key={index}
               data-weight={baseWeight}
               style={{
                    fontVariationSettings: `'wght' ${baseWeight}`,
                    display: "inline-block",
               }}
          >
               {char === " " ? "\u00A0" : char}
          </span>
     ));
};

const setupWeightHover = (container, type) => {
     if (!container) return;

     const letters = [...container.querySelectorAll("span")];
     const { min, max } = FONT_WEIGHT[type];

     const weights = letters.map((letter) => ({
          val: parseFloat(letter.dataset.weight ?? min),
     }));

     const applyWeight = (letter, obj) => {
          letter.style.fontVariationSettings = `'wght' ${Math.round(obj.val)}`;
     };

     const handleMouseMove = (e) => {
          const { left } = container.getBoundingClientRect();
          const mouseX = e.clientX - left;

          letters.forEach((letter, i) => {
               const { left: l, width: w } = letter.getBoundingClientRect();
               const letterCenter = l - left + w / 2;
               const distance = Math.abs(mouseX - letterCenter);
               const intensity = Math.exp(-(distance ** 2) / 3000);
               const targetWeight = min + (max - min) * intensity;

               gsap.killTweensOf(weights[i]);
               gsap.to(weights[i], {
                    val: targetWeight,
                    duration: 0.3,
                    ease: "power2.out",
                    onUpdate: () => applyWeight(letter, weights[i]),
               });
          });
     };

     const handleMouseLeave = () => {
          letters.forEach((letter, i) => {
               const base = parseFloat(letter.dataset.weight ?? min);
               gsap.killTweensOf(weights[i]);
               gsap.to(weights[i], {
                    val: base,
                    duration: 0.6,
                    ease: "power3.out",
                    onUpdate: () => applyWeight(letter, weights[i]),
               });
          });
     };

     container.addEventListener("mousemove", handleMouseMove);
     container.addEventListener("mouseleave", handleMouseLeave);

     return () => {
          container.removeEventListener("mousemove", handleMouseMove);
          container.removeEventListener("mouseleave", handleMouseLeave);
          letters.forEach((_, i) => gsap.killTweensOf(weights[i]));
     };
};

const setupScaleHover = (container) => {
     if (!container) return;

     const letters = [...container.querySelectorAll("span")];

     const handleMouseMove = (e) => {
          const { left } = container.getBoundingClientRect();
          const mouseX = e.clientX - left;

          letters.forEach((letter) => {
               const { left: l, width: w } = letter.getBoundingClientRect();
               const letterCenter = l - left + w / 2;
               const distance = Math.abs(mouseX - letterCenter);
               const intensity = Math.exp(-(distance ** 2) / 8000);

               gsap.to(letter, {
                    scale: 1 + 0.5 * intensity,
                    y: -18 * intensity,
                    duration: 0.3,
                    ease: "power2.out",
                    overwrite: "auto",
               });
          });
     };

     const handleMouseLeave = () => {
          letters.forEach((letter) => {
               gsap.to(letter, {
                    scale: 1,
                    y: 0,
                    duration: 0.6,
                    ease: "elastic.out(1, 0.4)",
                    overwrite: "auto",
               });
          });
     };

     container.addEventListener("mousemove", handleMouseMove);
     container.addEventListener("mouseleave", handleMouseLeave);

     return () => {
          container.removeEventListener("mousemove", handleMouseMove);
          container.removeEventListener("mouseleave", handleMouseLeave);
     };
};

const Feature = () => {
     const titleRef = useRef(null);
     const subtitleRef = useRef(null);

     useGSAP(() => {
          const cleanupTitle = setupScaleHover(titleRef.current);
          const cleanupSubtitle = setupWeightHover(subtitleRef.current, "subtitle");

          return () => {
               cleanupTitle?.();
               cleanupSubtitle?.();
          };
     }, []);

     return (
          <section id="feature">
               <p ref={subtitleRef}>{renderText("Hello, welcome to my", "text-3xl font-georama", 100)}</p>
               <h1 ref={titleRef} className="mt-5">{renderText("Portfolio", "font-allura text-9xl italic")}</h1>

               <div className="small-screen">
                    <p>This Portfolio is designed for desktop/tabled screens only.</p>
               </div>
          </section>
     );
};

export default Feature;