import React from "react";
import { createRoot } from "react-dom/client";
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

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
