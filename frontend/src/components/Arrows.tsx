interface Props {
  onClickRight: () => void;
}

export default function Arrows() {
  return (
    <>
      <div className="arrow-right"></div>
      <div className="arrow-left"></div>
    </>
  );
}
