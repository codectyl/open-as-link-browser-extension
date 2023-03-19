import {LinkStore} from "../dao/link_store";
import React, {FormEvent, useState} from "react";

const LinkInputForm = () => {
    const linkStore: LinkStore = new LinkStore();
    const [link, setLink] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        if (isSubmitting || !link) return;
        setIsSubmitting(true);
        await linkStore.addLink(link);
        setLink("");
        setIsSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Link: Add text with a placeholder `[]` For eg: "github.com/username/{}"
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
