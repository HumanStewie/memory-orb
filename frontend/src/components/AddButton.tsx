import { useState } from "react";

interface FormProps {
  onClick?: () => void;
}

function AddForm({ onClick }: FormProps) {
  const [active, setActive] = useState(false);
  const [isFile, setIsFile] = useState(true);
  const [file, setFile] = useState(null!);
  const [isMax, setIsMax] = useState(false)
  const [isInfoMax, setIsInfoMax] = useState(false)
  const handleFile = (e: any) => {
    setFile(e.target.files[0]);
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://127.0.0.1:8000/memory`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (response.ok) {
        setActive(true);
        window.location.reload();
      } else if (response.status == 400) {
        setIsFile(false);
      } else {
        throw new Error(`Response status: ${response.status}`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleMax = (type : string, num : number, max: number) => {
    if (num == max){
      type == "name" ? setIsMax(true) : setIsInfoMax(true)
    }
    else{
      type == "name" ? setIsMax(false) : setIsInfoMax(false)
    }
  }
  return (
    <div
      className={`form-container ${
        active ? "form-container-done" : "form-container-start"
      }`}
    >
      <form
        className={`memory-form ${active ? "memory-done" : "memory-start"}`}
        onSubmit={handleSubmit}
      >
        <h2 className="add-title">Add a Memory</h2>

        <div className="input-group">
          <label htmlFor="memoryName">Memory Name - 30 words{isMax ? <b style={{color: "red"}}> - max word</b> : ''}</label>
          <input
            type="text"
            id="memoryName"
            name="memoryName"
            placeholder="a wonderful memory"
            maxLength={30}
            onChange={(e) => {handleMax("name", e.target.value.length, 30)}}
          ></input>
        </div>
        <div className="input-group">
          <label htmlFor="memoryName">Memory Info - 500 words{isInfoMax ? <b style={{color: "red"}}> - max word</b> : ''}</label>
          <textarea
            id="memoryInfo"
            name="memoryInfo"
            maxLength={500}
            onChange={(e) => {handleMax("info", e.target.value.length, 500)}}
            placeholder="must have been a wonderful memory. express it, with your beautiful heart. this too shall pass."
          ></textarea>
        </div>
        <div className="input-group">
          <label htmlFor="date">Date</label>
          <input type="date" id="date" name="date"></input>
        </div>
        <div className="input-group">
          <label htmlFor="memoryImage">Memory Image</label>
          <input
            type="file"
            id="memoryImage"
            name="memoryImage"
            onChange={handleFile}
          ></input>
        </div>
        <button type="submit" className="btn-form">
          {isFile ? "Add Memory" : "Add Memory - no image found."}
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
      {state === "inactive" ? (
        ""
      ) : (
        <AddForm onClick={() => setState("inactive")} />
      )}
    </>
  );
}
