import { useState } from "react";

export default function TitleCard() {
  const [fade, setFade] = useState("");
  setTimeout(() => {
    setFade("fadeout");
  }, 3000);
  return (
    <div className={"loading-screen-container " + fade}>
      <div className="top-left-decor">
        <span>BT-7274</span>
        <span>Memory Machine</span>
        <span>Stand by for Arrival</span>
      </div>
      <div className="loader-circle"></div>
      <div className="main-title">
        <h1>
          <ruby style={{ rubyPosition: "top" }}>
            <ruby className="kanji-memory">
              記憶<rt>きおく</rt>
            </ruby>
            <rt>Memory</rt>の
            <ruby className="kanji-orb">
              玉<rt>たま</rt>
            </ruby>
            <rt> Orb</rt>
          </ruby>
        </h1>
      </div>
      <div className="loading-status-text">Initialized</div>
    </div>
  );
}
