export class Link {
  id: string;
  url: string;
  name: string;

  static withProtocol = (url: string): string => {
    if (!/^https?:\/\//i.test(url)) {
      url = "https://" + url;
    }
    return url;
  };

  constructor(id: string, url: string, name: string) {
    this.id = id;
    this.url = url;
    this.name = name;
  }

  toJson(): { name: string; id: string; url: string } {
    return { id: this.id, name: this.name, url: this.url };
  }

  jsonString(): string {
    return JSON.stringify(this.toJson());
  }

  static fromJsonString(jsonString: string): Link {
    const val = JSON.parse(jsonString);
    return new Link(val.id, val.name, val.url);
  }
}
