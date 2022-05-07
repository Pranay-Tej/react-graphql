import Apollo from "./Apollo";
import "./App.css";
import ReactQuery from "./ReactQuery";
import Urql from "./Urql";

function App() {
  return (
    <div className="App">
      <Apollo />
      <hr />
      <Urql />
      <hr />
      <ReactQuery />
      <hr />
    </div>
  );
}

export default App;
