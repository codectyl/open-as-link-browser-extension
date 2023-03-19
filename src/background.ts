import { CHROME_STORAGE_LINKS_KEY, LinkStore } from "./dao/link_store";

const OPEN_LINK_CONTEXT_MENU_ID = "openAsLink";
LinkStore.getInstance()
  .getAllLinksAsJson()
  .then((json) =>
    chrome.storage.sync.set({
      [CHROME_STORAGE_LINKS_KEY]: JSON.stringify(json),
    })
  );

const generateContextMenu = async () => {
  chrome.contextMenus.create({
    id: OPEN_LINK_CONTEXT_MENU_ID,
    title: "Open As Link",
    contexts: ["selection"],
  });

  const links = await LinkStore.getInstance().getAllLinks();
  links.forEach((link) => {
    chrome.contextMenus.create({
      id: link.id,
      title: link.name,
      contexts: ["selection"],
      parentId: OPEN_LINK_CONTEXT_MENU_ID,
    });
  });
};

chrome.runtime.onInstalled.addListener(generateContextMenu);
LinkStore.getInstance().addListener(generateContextMenu);

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const selectedText = info.selectionText;
  const id = info.menuItemId;
  if (!selectedText || typeof id !== "string") return;
  const link = await LinkStore.getInstance().getLinkById(id);
  const linkUrl = link?.url;
  if (!linkUrl) return;
  const url = linkUrl.replace(/\[\]/g, selectedText);
  chrome.tabs.create({ url }).then();
});
