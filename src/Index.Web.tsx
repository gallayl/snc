import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./AppRoot";

declare const document: any;

ReactDOM.render(<App />, document.getElementById("root"));

export default App;
