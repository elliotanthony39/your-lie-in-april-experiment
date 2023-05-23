import React, { useState, useRef } from "react";
import "../../stylesheets/Nav.css";

const Nav = ({ handleDay, dayMode }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="container glass">
      <audio ref={audioRef} src="./music/my-lie.mp3" loop />
      <button
        className={`play-button ${isPlaying ? "playing" : ""}`}
        onClick={togglePlay}
      >
        {isPlaying ? (
          <i className="bi bi-pause-fill"></i>
        ) : (
          <i className="bi bi-play-fill"></i>
        )}
      </button>
      <span>Your lie in April </span>
      <span>
        {" "}
        <a href="https://youtu.be/f04dd09akoo">Music</a> | <a href="https://sketchfab.com/3d-models/grand-piano-159b0bd1ef114b32888d9d39885cac68">Piano</a> |{" "}
        <a href="https://sketchfab.com/3d-models/pink-tree-e4ea2aef9b964e61b128f4b4750136ea">Tree</a> | <a href="https://github.com/elliotanthony39/your-lie-in-april-experiment">Github</a>
      </span>
      <button className="sunset-button" onClick={handleDay}>
        {dayMode ? (
          <i className="bi bi-sunset-fill icon"></i>
        ) : (
          <i className="bi bi-sun-fill icon"></i>
        )}
      </button>
    </div>
  );
};

export default Nav;
