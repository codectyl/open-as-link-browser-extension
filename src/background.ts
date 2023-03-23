import { CHROME_STORAGE_LINKS_KEY, LinkStore } from "./dao/link_store";

const OPEN_SELECTED_AS_LINK_CONTEXT_MENU_ID = "openSelectedAsLink";
LinkStore.getInstance()
  .getAllLinksAsJson()
  .then((json) =>
    chrome.storage.sync.set({
      [CHROME_STORAGE_LINKS_KEY]: JSON.stringify(json),
    })
  );

async function generateContextMenuForSelection() {
  chrome.contextMenus.create({
    id: OPEN_SELECTED_AS_LINK_CONTEXT_MENU_ID,
    title: "Open As Link",
    contexts: ["selection"],
  });

  const links = await LinkStore.getInstance().getAllLinks();
  links.forEach((link) => {
    chrome.contextMenus.create({
      id: link.id,
      title: link.name,
      contexts: ["selection"],
      parentId: OPEN_SELECTED_AS_LINK_CONTEXT_MENU_ID,
    });
  });
}

export const generateContextMenu = async () => {
  chrome.contextMenus.removeAll(async () => {
    await generateContextMenuForSelection();
  });
};
