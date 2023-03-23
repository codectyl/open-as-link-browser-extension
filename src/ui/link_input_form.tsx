import { LinkStore } from "../dao/link_store";
import React, { FormEvent, useState } from "react";
import { Link } from "../models/link";

const LinkInputForm = () => {
  const linkStore: LinkStore = LinkStore.getInstance();
  const [link, setLink] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (isSubmitting || !link || !name) return;
    setIsSubmitting(true);
    await linkStore.addLink(Link.withProtocol(link), name);
    setLink("");
    setName("");
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>

      <label>
        Link: Add text with a placeholder `[]` For eg: "github.com/username/[]"
        <input
          type="text"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
      </label>
      <button type="submit">Add</button>
    </form>
  );
};
export default LinkInputForm;
