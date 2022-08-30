import { PrismaClient } from "@prisma/client"

const db = new PrismaClient()

async function seed() {
  await Promise.all(
    getTodos().map((todo) => {
      return db.todo.create({ data: todo })
    })
  )
}

seed()

function getTodos() {
  return [
    {
      title: "Naplanuj den u snidane",
      description: "Domluvit obed, odpoledne/vecer, nejaky plany s Jonikem?",
      sequence: 10,
      repeat: "mo,tu,we,th,fr,sa,su",
    },
    {
      title: 'Vypln "Rovnovahu doma"',
      sequence: 20,
      repeat: "mo,tu,we,th,fr,sa,su",
    },
    {
      title: "Udelej web2022 report",
      sequence: 30,
      repeat: "tu",
    },
    {
      title: "Vzdelavej se (treba 20 minut)",
      sequence: 40,
      repeat: "mo,tu,we,th,fr",
    },
  ]
}
