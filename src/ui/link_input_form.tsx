import React, {
  useRef,
  useState,
  type ChangeEvent,
  type ChangeEventHandler,
  type FormEvent,
  type MouseEventHandler,
  type SyntheticEvent
} from "react"

import { LinkStore } from "~dao/link_store"
import { Link } from "~models/link"
import type { PickProperties } from "~types"

import { AddIcon, LinkIcon, SaveIcon, TagIcon, UploadIcon } from "./icons"

const LinkInputForm = () => {
  const linkStore: LinkStore = LinkStore.getInstance()
  const [link, setLink] = useState("")
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const nameInputRef = useRef<HTMLInputElement>(null)
  const loadFileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    try {
      if (isSubmitting || !link || !name) return
      setIsSubmitting(true)
      await linkStore.addLink(name, Link.urlWithProtocol(link))
      nameInputRef.current?.focus()
      setLink("")
      setName("")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function backupLinks(): Promise<void> {
    const linksStr = JSON.stringify({
      links: await linkStore.getAllLinksAsJson()
    })
    await chrome.downloads.download({
      url: `data:application/json;base64,${Buffer.from(linksStr, "utf-8").toString("base64")}`,
      filename: "links_backup.json"
    })
  }

  function restoreLinks(e: ChangeEvent<HTMLInputElement>): void {
    e.preventDefault()
    const file = (e.target?.files as FileList)[0]
    if (!file) return
    var reader = new FileReader()
    reader.readAsText(file, "UTF-8")
    e.target.value = ""

    reader.onload = async function (evt) {
      try {
        const result = evt.target?.result
        if (!result) return
        const parsed = JSON.parse(result as string)
        if (!parsed.links) throw new Error("Failed parsing links")
        const links = (parsed.links as Array<PickProperties<Link>>).map((e) =>
          Link.fromJson(e)
        )
        await linkStore.updateAllLinks(links)
      } catch (er) {
        alert("Failed parsing JSON File")
      }
    }
    reader.onerror = function (evt) {
      alert("Error Opening File")
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
          ref={nameInputRef}
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

      <div className="flex flex-row justify-between mt-3">
        <button
          type="submit"
          className="btn btn-primary btn-outline btn-sm text-md gap-0 border-2">
          Add
          <span className="scale-75">
            <AddIcon />
          </span>
        </button>

        <div className="space-x-2 my-auto">
          <div className="tooltip tooltip-top" data-tip="Backup">
            <button
              className="gap-x-1 btn-sm px-2 btn btn-outline btn-success border-2"
              onClick={backupLinks}>
              <SaveIcon />
            </button>
          </div>
          <div className="tooltip tooltip-top" data-tip="Restore">
            <input
              type="file"
              id="save-file-input"
              accept=".json,application/JSON"
              ref={loadFileInputRef}
              onChange={restoreLinks}
              hidden
            />
            <button
              className="gap-x-1 btn px-2 btn-sm btn-outline btn-neutral border-2"
              onClick={() => loadFileInputRef.current?.click()}>
              <UploadIcon />
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
export default LinkInputForm
