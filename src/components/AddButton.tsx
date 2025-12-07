import gsap from "gsap";
import { useState } from "react";

interface Props{
  state: string
}

function AddForm({state } : Props){
  return (
    <div className={"login-"+state}>
      <h1 className="add-title">Add a Memory</h1>
      
      <div className="input-group">
        <label htmlFor='memoryName'>Memory Name</label>
        <input type="text" id="memoryName" placeholder="A wonderful memory."></input>
      </div>
      <div className="input-group">
        <label htmlFor='date'>Date</label>
        <input type="date" id="date" name="date"></input>
      </div>
      <div className="input-group">
        <label htmlFor='memoryImage'>Memory Image</label>
        <input type="file" id="memoryImage" name="memoryImage"></input>
      </div>
      <button type="submit">Add Memory</button>
    </div>
  );
}

export default function AddButton() {
  const [state, setState] = useState('inactive')
  return (
    <>
    <div className={"btn-container-" + state} onClick={() => { state === 'inactive' ? setState('active') : setState('inactive'); } }>
      <div className="plus"></div>
    </div>
    <AddForm state={state}/>
    </>
  );
}
