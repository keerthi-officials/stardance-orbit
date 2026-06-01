import { useEffect, useState } from "react";

export const config = {
  matches: ["https://stardance.hackclub.com/*"],
};

function StardanceContent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const shown = localStorage.getItem("stardance-orbit-installed");

    if (!shown) {
      setOpen(true);
      localStorage.setItem("stardance-orbit-installed", "true");
    }
  }, []);

  return (
    <>
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 999998,
          background: "#000",
          color: "#fff",
          padding: "10px 16px",
          borderRadius: "999px",
          fontSize: "14px",
          fontWeight: 600,
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        }}
      >
        ✨ Stardance Orbit Active
      </div>
    </>
  );
}

export default StardanceContent;
