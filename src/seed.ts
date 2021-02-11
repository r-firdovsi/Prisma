import {PrismaClient} from '@prisma/client'
import {add} from 'date-fns'

// Instantiate Prisma Client
const prisma = new PrismaClient()

// A `main` function so that we can use async/await
async function main() {
    await prisma.courseEnrollment.deleteMany({}); // Should not be done in production
    await prisma.testResult.deleteMany({}); // Should not be done in production
    await prisma.user.deleteMany({}); // Should not be done in production
    await prisma.test.deleteMany({}); // Should not be done in production
    await prisma.course.deleteMany({}); // Should not be done in production

    const grace = await prisma.user.create({
        data: {
            email: 'grace@hello.com',
            firstName: 'Firdovsi',
            lastName: 'Rustamov',
            social: {
                facebook: "firdovsi",
                instagram: "firdovsi"
            }
        }
    })

    const weekFromNow = add(new Date(), {days: 7})
    const twoWeekFromNow = add(new Date(), {days: 14})
    const monthFromNow = add(new Date(), {days: 28})

    const course = await prisma.course.create({
        data: {
            name: "CRUD with Prisma in the real world",
            courseDetails: "Modern backend with Prisma",
            tests: {
                create: [
                    {
                        date: weekFromNow,
                        name: "First test"
                    },
                    {
                        date: twoWeekFromNow,
                        name: "Second test"
                    },
                    {
                        date: monthFromNow,
                        name: "Final exam"
                    }
                ]
            },
            members: {
                create: {
                    role: "TEACHER",
                    user: {
                        connect: {email: grace.email}
                    }
                }
            }
        },
        include: {
            tests: true,
            members: {include: {user: true}}
        }
    })

    const shakuntala = await prisma.user.create({
        data: {
            email: 'devi@prisma.io',
            firstName: 'Shakuntala',
            lastName: 'Devi',
            social: {
                facebook: "firdovsi",
                instagram: "firdovsi"
            },
            courses: {
                create: {
                    role: 'STUDENT',
                    course: {
                        connect: { id: course.id },
                    },
                },
            },
        },
    })

    const david = await prisma.user.create({
        data: {
            email: 'david@prisma.io',
            firstName: 'David',
            lastName: 'Deutsch',
            social: {
                facebook: "firdovsi",
                instagram: "firdovsi"
            },
            courses: {
                create: {
                    role: 'STUDENT',
                    course: {
                        connect: { id: course.id },
                    },
                },
            },
        },
    })

    const testResults = [0, 950, 700]
    let counter = 0

    for (const test of course.tests) {
        const shakuntalaTestResult = await prisma.testResult.create({
            data: {
                gradedBy: {connect: {email: grace.email}},
                student: {connect: {email: shakuntala.email}},
                test: {connect: {id: test.id}},
                result: testResults[counter]
            }
        })

        counter++;
    }

    const results = await  prisma.testResult.aggregate({
        where: {studentId: shakuntala.id},
        avg: {result: true},
        max: {result: true},
        min: {result: true},
        count: true
    })

    console.log(results);

    // console.log(course);
}

main()
    .catch((e: Error) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        // Disconnect Prisma Client
        await prisma.$disconnect()
    })
