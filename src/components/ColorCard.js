export default function ColorCard({ color, onClick, flash, pressed, nftUrl }) {
  return (
    <div
      onClick={onClick}
      className={`colorCard ${color} ${flash ? "alert-shown" : ""}
      ${pressed ? "pressed" : ""}`}
      id={`${color}`}
    >
      {nftUrl !== undefined && (
        <img id={`${color}`} className="nftImage" src={`${nftUrl}`} />
      )}
    </div>
  );
}
