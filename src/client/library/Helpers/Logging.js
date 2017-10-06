class Logging {
    constructor() {

    }

    SpaceTitleAndLog (title, object) {
        console.groupCollapsed(title);
        console.log(object)
        console.groupEnd();
    }
}

export default new Logging()