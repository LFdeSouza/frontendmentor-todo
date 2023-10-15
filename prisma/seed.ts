import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.todo.createMany({
    data: [
      { title: "Complete online JavaScript course", completed: true },
      { title: "Jog around the park 3x", completed: false },
      { title: "10 minutes meditation", completed: false },
      { title: "Read for 1 h", completed: false },
      { title: "Pick up groceries", completed: false },
      { title: "Complete Todo App on Frontend Mentor", completed: false },
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
