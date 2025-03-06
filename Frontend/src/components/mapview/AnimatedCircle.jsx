// AnimatedCircle.jsx
import { useState, useEffect } from "react";
import { Circle } from "react-leaflet";

export function AnimatedCircle({ center, initialRadius, maxRadius, duration, pathOptions }) {
  const [radius, setRadius] = useState(initialRadius);

  useEffect(() => {
    let startTime = null;
    let animationFrame;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = (elapsed % duration) / duration;
      const newRadius = initialRadius + (maxRadius - initialRadius) * progress;
      setRadius(newRadius);
      animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [initialRadius, maxRadius, duration]);

  const opacity = 0.2 * (1 - (radius - initialRadius) / (maxRadius - initialRadius));

  return (
    <Circle
      center={center}
      radius={radius}
      pathOptions={{ ...pathOptions, fillOpacity: opacity }}
    />
  );
}
