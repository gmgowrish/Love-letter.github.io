import React, { useState, useRef, useEffect, useCallback } from "react";
import "./LoveLetter.css";
import audioFile from "./song.mp3";

const LoveLetter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullSize, setIsFullSize] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const letterRef = useRef(null);
  const audioRef = useRef(null);

  const handleOpenLetter = () => {
    setIsOpen(true);
    setTimeout(() => {
      setIsFullSize(true);
      if (audioRef.current) {
        audioRef.current
          .play()
          .then(() => console.log("Playback succeeded"))
          .catch((e) => console.error("Playback failed:", e));
      }
    }, 800);
  };

  const handleCloseLetter = () => {
    setIsFullSize(false);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsOpen(false);
    }, 800);
  };

  // Use useCallback to memoize the function
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setScrollPosition(e.clientY); // Store the initial mouse position
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (isDragging && letterRef.current) {
        const scrollDifference = scrollPosition - e.clientY;
        letterRef.current.scrollTop += scrollDifference; // Scroll the letter content
        setScrollPosition(e.clientY); // Update the scroll position
      }
    },
    [isDragging, scrollPosition]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isFullSize) {
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("mousemove", handleMouseMove);
    }
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isFullSize, handleMouseMove, handleMouseUp]);

  return (
    <div
      className={`envelope ${isOpen ? "open" : ""}`}
      onClick={!isFullSize ? handleOpenLetter : handleCloseLetter}
    >
      <div className="flap"></div>
      <div className="body"></div>
      <div
        className={`letter ${isFullSize ? "fullSize" : ""}`}
        ref={letterRef}
        onMouseDown={handleMouseDown}
        style={{ overflowY: isFullSize ? "auto" : "hidden" }}
      >
        🖤,
        <br />
        Dear Hinata, You must be a magician, because whenever I look at you,
        everyone else disappears. Either that, or my contacts are acting up
        again.
        <br />
        I know we’ve been through a lot together – like the time you couldn’t
        decide where to eat, so we starved for hours. But that’s what makes us a
        great team: I ask what you want, you say "I don’t know," and then we
        still end up eating pizza. It’s a system that works!
        <br />
        You must be made of copper and tellurium, because you're Cu-Te. I know,
        I’m smooth. But seriously, if I had a nickel for every time you made me
        smile, I’d be rich enough to buy all the tacos you love.
        <br />
        I love you more than Netflix loves reminding me that I’m still watching.
        And that’s saying something. I promise to always share my fries with you
        (even though I secretly don’t want to), and I will forever laugh at your
        jokes, even when they’re terrible.
        <br />
        Let’s grow old together, like two avocados left out too long.
        <br />
        Yours forever (or until we can't decide on dinner again), Naruto
        <br />
      </div>
      <audio
        ref={audioRef}
        src={audioFile}
        onError={(e) => console.error("Audio error:", e.message)}
      />
    </div>
  );
};

export default LoveLetter;
