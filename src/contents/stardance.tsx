export const config = {
  matches: ["https://stardance.hackclub.com/*"],
};

function StardanceContent() {
  return (
    <>
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 999998,
          background: "#1c1c1f",
          color: "#f0eeeb",
          padding: "10px 16px",
          borderRadius: "999px",
          fontSize: "14px",
          fontWeight: 600,
        }}
      >
        ✨ Active
      </div>
    </>
  );
}

export default StardanceContent;
