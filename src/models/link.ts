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

  constructor(id: string, url: string, name: string, sortOrder: number) {
    this.id = id
    this.url = url
    this.name = name
    this.sortOrder = sortOrder
  }

  toJson(): { name: string; id: string; url: string; sortOrder: number } {
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

  static fromJson(json: Object) {
    return new Link(json["id"], json["name"], json["url"], json["sortOrder"])
  }

  static fromJsonString(jsonString: string): Link {
    const val = JSON.parse(jsonString)
    return this.fromJson(val)
  }
}
