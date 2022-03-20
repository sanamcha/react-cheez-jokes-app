import React from "react";
import JokeList from "./JokeList";

//using class component method instead of function

class App extends React.Component {
  render() {
  return (
    <div className="App">
      <JokeList />
    </div>
  );
  }
}

export default App;
