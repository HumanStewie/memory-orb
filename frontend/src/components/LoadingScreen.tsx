import { useEffect, useRef, useState } from "react";

export default function LoadingScreen() {
  const [percent, setPercent] = useState(0);
  const prev = useRef(0);

  // Adding percentage - "Fake loading screen"
  useEffect(() => {
    const count = () => {
      if (prev.current >= 95) {
        // Add 1 to percent if its bigger than 95% "getting slower effect"
        setPercent(prev.current < 99 ? (prev.current += 1) : 99);

        return;
      }
      const inc = Math.floor(Math.random() * 5) + 1;

      setPercent(Math.min((prev.current += inc), 95));
    };
    const interval = setInterval(count, 70);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={"loading-screen-container"}>
      <div className="top-left-decor">
        <span>BT-7274</span>
        <span>Memory Machine</span>
        <span>Stand by for Arrival</span>
      </div>
      <div className="loader-circle">
        <div className={"loader-ring-spinner "}></div>
        <span className={"percentage-text"}>{percent}%</span>
      </div>
      <div className="loading-status-text">Loading...</div>
    </div>
  );
}
