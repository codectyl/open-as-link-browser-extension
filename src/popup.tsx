import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import LinkInputForm from "./ui/link_input_form";
import LinkList from "./ui/link_list";
import { LinkStore } from "./dao/link_store";
import { generateContextMenu } from "./background";

const Popup = () => {
  useEffect(() => {
    LinkStore.getInstance().addListener(generateContextMenu);
    return () => {
      LinkStore.getInstance().removeListener(generateContextMenu);
    };
  });

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
