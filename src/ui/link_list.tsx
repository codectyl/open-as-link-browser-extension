import {
  DndContext,
  useSensor,
  useSensors,
  type DragEndEvent
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import React, {
  useEffect,
  useState,
  type CSSProperties,
  type MouseEventHandler
} from "react"

import { LinkStore } from "~dao/link_store"
import { Link } from "~models/link"
import { copyToClipboard, readClipboardText } from "~utils"

import { DnDMouseSensor } from "./helpers/dnd_sensor"
import { CopyIcon, OpenLinkIcon, ReorderListIcon, ThrashIcon } from "./icons"

const LinkList = () => {
  const [links, setLinks] = useState<null | Array<Link>>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | undefined>(undefined)

  const [clipboard, setClipboard] = useState<string | undefined>(undefined)

  const sensors = useSensors(useSensor(DnDMouseSensor))

  const linkStore = LinkStore.getInstance()
  const loadLinks = async (): Promise<void> => {
    try {
      setIsLoading(true)
      const fetchedLinks = await linkStore.getAllLinks()
      setLinks(fetchedLinks)
    } catch (er: any) {
      setError(er.toString())
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    readClipboardText().then((val) => {
      setClipboard(val)
    })
    loadLinks()
    linkStore.addListener(loadLinks)
    return () => {
      linkStore.removeListener(loadLinks)
    }
  }, [])

  if (isLoading && !links) {
    return (
      <div className="prose prose-xl h-48 flex items-center justify-center">
        Loading...
      </div>
    )
  }

  if (error) {
    return (
      <div className="prose prose-xl h-48 flex items-center justify-center">
        Error: {error}
      </div>
    )
  }

  if (!links) {
    return (
      <div className="prose prose-xl h-48 flex items-center justify-center">
        No Links Added
      </div>
    )
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (links != null && over != null && active.id !== over?.id) {
      const oldIndex = links.findIndex((l) => l.id === active.id)
      const newIndex = links.findIndex((l) => l.id === over.id)
      if (oldIndex === -1 || newIndex === -1) return
      const movedArray = arrayMove(links!, oldIndex, newIndex)
      setLinks(movedArray)
      linkStore.updateAllLinks(
        movedArray.map((l, i) => {
          // Updating the sortOrder
          l.sortOrder = movedArray.length - 1 - i
          return l
        })
      )
    }
  }

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
      sensors={sensors}>
      <SortableContext items={links} strategy={verticalListSortingStrategy}>
        {links.map((link, i) => (
          <div className={`py-2 ${i == 0 ? "pt-0" : ""}`} key={link.id}>
            <LinkInfo
              link={link}
              onPasteTap={() =>
                chrome.tabs.create({
                  url: link.resolveLink(clipboard ?? "")
                })
              }
              onCopyTap={() => copyToClipboard(link.url)}
              onDeleteTap={() => linkStore.removeLink(link.id)}
            />
          </div>
        ))}
      </SortableContext>
    </DndContext>
  )
}

const LinkInfo = (props: {
  link: Link
  onCopyTap: MouseEventHandler<HTMLButtonElement>
  onDeleteTap: MouseEventHandler<HTMLButtonElement>
  onPasteTap: MouseEventHandler<HTMLButtonElement>
}) => {
  const { link, onCopyTap, onDeleteTap, onPasteTap } = props

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.link.id })

  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      data-no-dnd="true"
      className="card bg-base-100 shadow-md border border-neutral-50/25 cursor-default">
      <div className="card-body p-4 flex flex-row items-center justify-between">
        <button
          className="grow btn btn-circle btn-ghost cursor-move"
          data-no-dnd="false">
          <ReorderListIcon />
        </button>

        <div data-no-dnd="true" className="min-w-0">
          <div className="font-bold text-xl text-wrap">{link.name}</div>
          <p className="text-xs text-wrap break-words">{link.url}</p>
        </div>

        <div className="space-x-2 flex flex-row flex-nowrap">
          <span className="tooltip tooltip-left" data-tip="Open As Link">
            <button
              className="btn btn-circle btn-outline border-2 btn-primary"
              onClick={onPasteTap}>
              <OpenLinkIcon />
            </button>
          </span>
          <span className="tooltip tooltip-left" data-tip="Copy">
            <button
              className="btn btn-circle btn-outline border-2 btn-info"
              onClick={onCopyTap}>
              <CopyIcon />
            </button>
          </span>
          <span className="tooltip tooltip-left" data-tip="Delete">
            <button
              className="btn btn-circle btn-outline border-2 btn-error"
              onClick={onDeleteTap}>
              <ThrashIcon />
            </button>
          </span>
        </div>
      </div>
    </div>
  )
}

export default LinkList
