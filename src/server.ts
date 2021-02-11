import Hapi from "@hapi/hapi"
import statusPlugin from "./plugins/status"
import prismPlugin from "./plugins/prisma"
import usersPlugin from "./plugins/users";

const server: Hapi.Server = Hapi.server({
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost'
})

export async function start(): Promise<Hapi.Server> {
    await server.register([statusPlugin, prismPlugin, usersPlugin])
    await server.start()
    console.log(`Server running on ${server.info.uri}`)
    return server
}

process.on('unhandleRejection', (err) => {
    console.log(err)
    process.exit(1)
})

start()
    .catch((err) => {
        console.log(err)
    })