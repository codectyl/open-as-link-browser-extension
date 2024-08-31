import type { PickProperties } from "~types"

export class Link {
  id: string
  url: string
  name: string
  sortOrder: number

  static urlWithProtocol = (url: string): string => {
    if (!/^https?:\/\//i.test(url)) {
      url = "https://" + url
    }
    return url
  }

  constructor(params: PickProperties<Link>) {
    const { id, url, name, sortOrder } = params;
    this.id = id
    this.url = url
    this.name = name
    this.sortOrder = sortOrder
  }

  toJson(): PickProperties<Link> {
    return {
      id: this.id,
      name: this.name,
      url: this.url,
      sortOrder: this.sortOrder
    }
  }

  jsonString(): string {
    return JSON.stringify(this.toJson())
  }

  resolveLink(text: string): string {
    return encodeURI(this.url.replace(/\[\]/g, text))
  }

  static fromJson(json: PickProperties<Link>) {
    return new Link({ id: json["id"], name: json["name"], url: json["url"], sortOrder: json["sortOrder"] })
  }

  static fromJsonString(jsonString: string): Link {
    const val = JSON.parse(jsonString)
    return this.fromJson(val)
  }
}
