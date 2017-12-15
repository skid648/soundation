class Logging {
  constructor() {
    this.debug = true
  }

  spaceTitleAndLog(title, object) {
    if (this.debug) {
      console.groupCollapsed(title);
      console.log(object)
      console.groupEnd();
    }
  }

  printArrayHeader() {
    console.log('-----------------------------------------------------------------------')
    console.log('   Note   |   Duration   |          Time          |       interval     ')
    console.log('-----------------------------------------------------------------------')
  }

  logSpacerColored() {
    console.log('%c==========%c---------%c==============', 'color: #FC3A51', 'color: #F5B349', 'color: #FC3A51')
  }
}

export default new Logging()
