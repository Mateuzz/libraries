function logPlugin(result) {
    const userResult = result

    return {
        name: "log-plugin",

        setup(build) {
            build.onEnd(result => {
                console.log(result)
                console.log(userResult)
            })
        }
    }
}

export default logPlugin
