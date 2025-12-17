import gsap from "gsap";
import { useState } from "react";

function AddForm() {
  const [active, setActive] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    setActive(true);
  };
  return (
    <div className={`form-container ${active ? "form-container-done" : ""}`}>
      <form
        className={`memory-form ${active ? "memory-done" : ""}`}
        onSubmit={handleSubmit}
      >
        <h2 className="add-title">Add a Memory</h2>

        <div className="input-group">
          <label htmlFor="memoryName">Memory Name</label>
          <input
            type="text"
            id="memoryName"
            placeholder="a wonderful memory"
          ></input>
        </div>
        <div className="input-group">
          <label htmlFor="date">Date</label>
          <input type="date" id="date" name="date"></input>
        </div>
        <div className="input-group">
          <label htmlFor="memoryImage">Memory Image</label>
          <input type="file" id="memoryImage" name="memoryImage"></input>
        </div>
        <button type="submit" className="btn-form">
          Add Memory
        </button>
      </form>
    </div>
  );
}

export default function AddButton() {
  const [state, setState] = useState("inactive");
  return (
    <>
      <div
        className={"btn-container-" + state}
        onClick={() => {
          state === "inactive" ? setState("active") : setState("inactive");
        }}
      >
        <div className="plus"></div>
      </div>
      <AddForm />
    </>
  );
}
