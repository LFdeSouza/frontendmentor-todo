import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.todo.createMany({
    data: [
      {
        title: "Complete online JavaScript course",
        completed: true,
        position: 1,
      },
      { title: "Jog around the park 3x", completed: false, position: 2 },
      { title: "10 minutes meditation", completed: false, position: 3 },
      { title: "Read for 1 h", completed: false, position: 4 },
      { title: "Pick up groceries", completed: false, position: 5 },
      {
        title: "Complete Todo App on Frontend Mentor",
        completed: false,
        position: 6,
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
