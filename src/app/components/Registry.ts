class Entry<T> {
  public name: string;
  public item: T;

  constructor(name: string, item: T) {
    this.name = name;
    this.item = item;
  }
}

export default class Registry {
  public register<T>(item: { name: string; default: T }): Entry<T> {
    return new Entry(item.name, item.default);
  }
}
