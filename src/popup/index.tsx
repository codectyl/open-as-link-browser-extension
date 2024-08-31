import React, { useEffect } from "react"

import { generateContextMenu } from "~background"
import { LinkStore } from "~dao/link_store"
import LinkInputForm from "~ui/link_input_form"
import LinkList from "~ui/link_list"

import "~styles/main.css"

const Popup = () => {
  useEffect(() => {
    LinkStore.getInstance().addListener(generateContextMenu)
    return () => {
      LinkStore.getInstance().removeListener(generateContextMenu)
    }
  })

  return (
    <div className="flex flex-col h-screen border border-neutral-500 border-dashed">
      <div className="pt-8 px-8 mb-4">
        <LinkInputForm />
      </div>
      <div className="p-4 w-full overflow-y-auto">
        <LinkList />
      </div>
    </div>
  )
}

export default Popup
