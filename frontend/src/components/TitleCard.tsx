import { useState } from "react";
import { Howl } from "howler";

const bgm = new Howl({
  src: ["/Benoît Pioulard - Stanza IV - 01 Xaipe.mp3"],
  loop: true,
  preload: true,
  volume: 0.06,
});

export default function TitleCard() {
  const [fadeOut, setFadeOut] = useState("");
  const [fadeIn, setFadeIn] = useState("");
  const [unclick, setUnclick] = useState("");
  setTimeout(() => {
    setFadeIn("fadein");
  }, 1000);
  return (
    <div
      onClick={() => {
        setFadeOut("fadeout");
        setUnclick("unclick");
        bgm.seek(2);
        bgm.play();
      }}
      className={"loading-screen-container " + fadeOut + ` ${unclick}`}
    >
      <div className="top-left-decor">
        <span>BT-7274</span>
        <span>Memory Machine</span>
        <span>Stand by for Arrival</span>
      </div>
      <div className="main-title">
        <h1>
          <ruby style={{ rubyPosition: "top" }}>
            <ruby className="kanji-memory">
              記憶<rt>きおく</rt>
            </ruby>
            <rt>Memory</rt>の
            <ruby className="kanji-orb">
              オーブ
            </ruby><rt>Orb</rt>
          </ruby>
        </h1>
      </div>
      <div className="loader-circle"></div>
      <div className="loading-status-text">Initialized</div>
      <div className={"continue " + fadeIn}>Press to Continue</div>
    </div>
  );
}
