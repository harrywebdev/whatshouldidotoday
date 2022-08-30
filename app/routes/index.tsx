import type { LoaderFunction } from "@remix-run/node"
import { db } from "~/utils/db.server"
import type { DailyLog } from "@prisma/client"
import { json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { format, parseISO } from "date-fns"

type LoaderData = {
  dailyLog: DailyLog
}

export const loader: LoaderFunction = async () => {
  // get today's log or create new one
  const today = new Date()

  // querying by datetime, let's normalize and use the date part only
  today.setUTCHours(0)
  today.setUTCMinutes(0)
  today.setUTCSeconds(0)
  today.setUTCMilliseconds(0)

  const dailyLog = await db.dailyLog.findFirst({
    where: {
      logDate: today,
    },
  })

  if (!dailyLog) {
    // fetch all the TODOs that should be here
    const todos = await db.todo.findMany({
      where: {
        repeat: {
          contains: format(today, "EEEEEE").toLowerCase(),
        },
      },
    })

    const logTodos = todos.map((todo) => {
      return {
        title: todo.title,
        description: todo.description,
        sequence: todo.sequence,
        isDone: false,
      }
    })

    const newDailyLog = await db.dailyLog.create({
      data: {
        logDate: today,
        logTodos: {
          create: logTodos,
        },
      },
      include: {
        logTodos: true,
      },
    })

    return json({ dailyLog: newDailyLog })
  }

  return json({ dailyLog })
}

export default function IndexRoute() {
  const { dailyLog } = useLoaderData<LoaderData>()

  return (
    <>
      <header>
        <h2>Today: {format(parseISO(dailyLog.logDate), "do MMMM, y")}</h2>
      </header>
    </>
  )
}
