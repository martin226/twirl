import React from "react";

interface AnimationProps {
    command: string;
}
export const appearAnimation = (command: string) => {
    if (command === "about-me") {
        return <div className="about-me-animation">about-me</div>;
    }
}