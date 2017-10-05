class Logging {
    constructor() {

    }

    SpaceTitleAndLog (title, object) {
        console.log("")
        console.log(`${title}`)
        console.log("==================")
        console.log("")
        console.log(object)
    }
}

export default new Logging()