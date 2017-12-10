class Logging {
  constructor() {
    this.debug = true
  }

  SpaceTitleAndLog(title, object) {
    if (this.debug) {
      console.groupCollapsed(title);
      console.log(object)
      console.groupEnd();
    }
  }
}

export default new Logging()
