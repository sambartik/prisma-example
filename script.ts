import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// A `main` function so that we can use async/await
async function main(includePosts: boolean) {
  // Seed the database with users and posts
  const user1 = await prisma.user.upsert({
    where: {
      email: "alice@prisma.io"
    },
    create: {
      email: 'alice@prisma.io',
      name: 'Alice',
      posts: {
        create: {
          title: 'Watch the talks from Prisma Day 2019',
          content: 'https://www.prisma.io/blog/z11sg6ipb3i1/',
          published: true,
        },
      },
    },
    update: {},
    include: {
      posts: true,
    },
  });
  const user2 = await prisma.user.upsert({
    where: {
      email: "bob@prisma.io"
    },
    create: {
      email: 'bob@prisma.io',
      name: 'Bob',
      posts: {
        create: [
          {
            title: 'Subscribe to GraphQL Weekly for community news',
            content: 'https://graphqlweekly.com/',
            published: true,
          },
          {
            title: 'Follow Prisma on Twitter',
            content: 'https://twitter.com/prisma/',
            published: false,
          },
        ],
      },
    },
    update: {},
    include: {
      posts: true,
    },
  })
  console.log(
    `Users: ${user1.name} (${user1.posts.length} post) and ${user2.name} (${user2.posts.length} posts) `,
  );

  const userFindManyArgs: Prisma.Args<typeof prisma.user, "findMany"> = includePosts ? {
    include: {
      posts: true
    }
  } : {}

  const users = await prisma.user.findMany(userFindManyArgs);

  if (includePosts) {
    console.log("Posts are included in the users prisma payload.");
    users.forEach(user => {
      console.log(user.posts);
    });
  } else {
    console.log("Posts are NOT included in the users prisma payload.");
    users.forEach(user => {
      console.log(user.posts)
    })
  }
}

main(false)
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
