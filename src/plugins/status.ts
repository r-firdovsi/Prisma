import Hapi from "@hapi/hapi"
import boom from "@hapi/boom"

const statusPlugin: Hapi.Plugin<undefined> = {
    name: "app/status",
    register: async function(server: Hapi.Server) {
        // Define a status endpoint
        server.route({
            method: 'GET',
            path: '/',
            handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
                return boom.badImplementation()
            }
        })
    }
}

export default statusPlugin