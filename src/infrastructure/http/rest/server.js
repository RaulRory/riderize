import { app } from "./app.js"

async function start() {
    try {
        app.listen({ port: process.env.PORT, host: process.env.HOST})
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

start().then(() => { console.log(`App ridezire it's running on port ${process.env.PORT}`) });