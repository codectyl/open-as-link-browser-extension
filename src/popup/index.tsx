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
    <div className="mx-5 flex flex-col h-screen">
      <LinkInputForm />
      <div className="m-2" />
      <div className="h-max-100 overflow-y-auto">
        <LinkList />
      </div>
    </div>
  )
}

export default Popup
