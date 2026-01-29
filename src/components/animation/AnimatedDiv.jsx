import React, { useEffect, useState } from "react";
import img from "../../images/agency/summary/jobpostings.svg";

const AnimatedDiv = () => {
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAngle((prevAngle) => prevAngle + 5); // Clockwise rotation
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "400px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      {/* Outermost rotating div (Clockwise rotation) */}
      <div
        style={{
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          border: "1px solid black",
          position: "absolute",
          transform: `rotate(${angle}deg)`, // Clockwise rotation
          transition: "transform 0.05s linear",
        }}
      >
        <img
          src={img}
          alt="icon"
          style={{
            position: "absolute",
            right: "-20px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "30px",
            height: "30px",
          }}
        />
      </div>

      {/* Middle rotating div (Anti-clockwise rotation) */}
      <div
        style={{
          width: "150px",
          height: "150px",
          borderRadius: "50%",
          border: "1px solid black",
          position: "absolute",
          transform: `rotate(${-angle}deg)`, // Anti-clockwise rotation
          transition: "transform 0.05s linear",
        }}
      >
        <img
          src={img}
          alt="icon"
          style={{
            position: "absolute",
            right: "-15px",
            bottom: "50%",
            transform: "translateY(-50%)",
            width: "30px",
            height: "30px",
          }}
        />
      </div>

      {/* Inner rotating div (Clockwise rotation) */}
      <div
        style={{
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          border: "1px solid black",
          position: "absolute",
          transform: `rotate(${angle}deg)`, // Clockwise rotation
          transition: "transform 0.05s linear",
        }}
      >
        <img
          src={img}
          alt="icon"
          style={{
            position: "absolute",
            right: "-15px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "30px",
            height: "30px",
          }}
        />
      </div>
    </div>
  );
};

export default AnimatedDiv;
