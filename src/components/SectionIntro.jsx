import React from "react";
import { Reveal } from "./Reveal";

export function SectionIntro({ eyebrow, title, description, align = "left", className = "" }) {
  return (
    <Reveal
      className={`section-header ${align === "center" ? "center" : ""} ${className}`.trim()}
    >
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2>{title}</h2>
      {description && <p className="muted section-copy">{description}</p>}
    </Reveal>
  );
}

