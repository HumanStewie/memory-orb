interface Props {
  name: string;
  date: string;
  count: string;
  length: string;
}

function MemoryName({ name, date, count, length }: Props) {
  return (
    <>
      <h1 id="mem-total">
        {count} / {length}
      </h1>
      <h1 id="mem-count">{count}.</h1>
      <div className="memory-title">
        <h1 id="main-name">{name}</h1>
        <h1 id="secondary-name">{date}</h1>
      </div>
    </>
  );
}

export default MemoryName;
