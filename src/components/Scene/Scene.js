import { useEffect, useRef } from "react";
import { cleanUpScene, initScene } from "./Script";
import "../../stylesheets/Scene.css";

function Scene({ dayMode }) {
  const mountRef = useRef(null);

  useEffect(() => {
    initScene(mountRef, dayMode);

    return () => {
      cleanUpScene();
    };
  }, [dayMode]);

  return <div className="Conteiner-3D" ref={mountRef}></div>;
}

export default Scene;
