import Hapi from "@hapi/hapi"
import boom from "@hapi/boom";

const usersPlugin: Hapi.Plugin<undefined> = {
    name: "app/users",
    dependencies: ['prisma'],
    register: async function (server: Hapi.Server) {
        server.route([
            {
                method: "POST",
                path: "/users",
                handler: createUserHandler,
            }
        ])
    }
}

export default usersPlugin

interface UserInput {
    firstName: string,
    lastName: string,
    email: string,
    social: {
        facebook?: string,
        twitter?: string,
        github?: string,
        website?: string,
        instagram?: string
    }
}

async function createUserHandler(request: Hapi.Request, h: Hapi.ResponseToolkit) {
    const { prisma } = request.server.app
    const payload = request.payload as UserInput

    try {
        const createdUser = await prisma.user.create({
            data: {
                email: payload.email,
                firstName: payload.firstName,
                lastName: payload.lastName,
                social: payload.social
            }
        })

        return h.response(createdUser).code(201)
    } catch (error) {
        console.log(error)
        return boom.badImplementation('Error creating user')
    }
}