import React, { useState, type FormEvent } from "react"

import { LinkStore } from "~dao/link_store"
import { Link } from "~models/link"

import { AddIcon, LinkIcon, TagIcon } from "./icons"

const LinkInputForm = () => {
  const linkStore: LinkStore = LinkStore.getInstance()
  const [link, setLink] = useState("")
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    try {
      if (isSubmitting || !link || !name) return
      setIsSubmitting(true)
      await linkStore.addLink(name, Link.urlWithProtocol(link))
      setLink("")
      setName("")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <label className="input input-bordered flex items-center gap-2">
        <TagIcon />
        <input
          type="text"
          placeholder="Name"
          value={name}
          className="grow"
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <div>
        <label className="input input-bordered flex items-center gap-2">
          <LinkIcon />
          <input
            type="text"
            value={link}
            className="grow"
            placeholder='Eg: "github.com/username/[]"'
            onChange={(e) => setLink(e.target.value)}
          />
        </label>
        <div className="py-1 text-xs">Enter the link with `[]` placeholder</div>
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-outline btn-sm mt-3 text-md gap-0 border-2">
        Add
        <span className="scale-75">
          <AddIcon />
        </span>
      </button>
    </form>
  )
}
export default LinkInputForm
