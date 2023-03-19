import LocalForage from "localforage";
import { Link } from "../models/link";
import { v4 as uuidv4 } from "uuid";

const LINK_STORE_NAME = "linkStore";

export class LinkStore {
  storeInstance: LocalForage;

  private static instance: LinkStore;

  listeners: Array<VoidFunction> = [];

  addListener(cb: VoidFunction): void {
    this.listeners.push(cb);
  }

  removeListener(cb: VoidFunction): void {
    this.listeners = this.listeners.filter((fn) => fn != cb);
  }

  notifyListeners() {
    this.listeners.forEach((cb) => cb());
  }

  public static getInstance(): LinkStore {
    if (!LinkStore.instance) {
      LinkStore.instance = new LinkStore();
    }
    return LinkStore.instance;
  }

  constructor() {
    this.storeInstance = LocalForage.createInstance({
      name: LINK_STORE_NAME,
      version: 1,
      storeName: LINK_STORE_NAME,
    });
  }

  async isReady(): Promise<boolean> {
    try {
      await this.storeInstance.ready();
      return true;
    } catch (er) {
      return false;
    }
  }

  async getAllLinks(): Promise<Array<Link>> {
    const links: Array<Link> = [];
    await this.storeInstance.iterate<string, void>((value, key, _) => {
      const link = new Link(key, value);
      links.push(link);
    });
    return links;
  }

  getLinkById(id: string): Promise<Link | undefined | null> {
    return this.storeInstance.getItem(id);
  }

  async addLink(link: string): Promise<string> {
    const uniqueId = uuidv4();
    const val = await this.storeInstance.setItem(uniqueId, link);
    this.notifyListeners();
    return val;
  }
}
