import React from "react";
import ReactDOM from "react-dom";
import LinkInputForm from "./ui/link_input_form";
import LinkList from "./ui/link_list";

const Popup = () => {

  return (
    <div>
      <LinkInputForm />
      <LinkList />
    </div>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);
