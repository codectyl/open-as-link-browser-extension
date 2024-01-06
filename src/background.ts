import { LinkStore } from "~dao/link_store"

const OPEN_SELECTED_AS_LINK_CONTEXT_MENU_ID = "openSelectedAsLink"

async function generateContextMenuForSelection() {
  const links = await LinkStore.getInstance().getAllLinks()
  if (links.length === 0) return
  chrome.contextMenus.create({
    id: OPEN_SELECTED_AS_LINK_CONTEXT_MENU_ID,
    title: "Open Selected As Link",
    contexts: ["selection"]
  })

  links.forEach((link) => {
    chrome.contextMenus.create({
      id: link.id,
      title: link.name,
      contexts: ["selection"],
      parentId: OPEN_SELECTED_AS_LINK_CONTEXT_MENU_ID
    })
  })
}

export const generateContextMenu = async () => {
  chrome.contextMenus.removeAll(async () => {
    await generateContextMenuForSelection()
  })
}

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const selectedText = info.selectionText
  const id = info.menuItemId
  if (!selectedText || typeof id !== "string") return
  const link = await LinkStore.getInstance().getLinkById(id)
  if (!link) return
  const url = link.resolveLink(selectedText)
  chrome.tabs.create({ url })
})
