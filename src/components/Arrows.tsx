export default function Arrows() {
  
  return (
    <>
      <div className="arrow1" onClick={() => console.log("baller")}>
        <div className="arrow-top"></div>
        <div className="arrow-bottom"></div>
      </div>
      <div className="arrow2">
        <div className="arrow-top"></div>
        <div className="arrow-bottom"></div>
      </div>
    </>
  );
}
