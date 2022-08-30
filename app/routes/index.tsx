import type { ActionFunction, LoaderFunction } from "@remix-run/node"
import { db } from "~/utils/db.server"
import type { Prisma } from "@prisma/client"
import { json, redirect } from "@remix-run/node"
import { Link, useActionData, useLoaderData } from "@remix-run/react"
import { format, parseISO } from "date-fns"

type DailyLogWithTodos = Prisma.DailyLogGetPayload<{
  include: { logTodos: true }
}>

type LoaderData = {
  dailyLog: DailyLogWithTodos
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
    include: {
      logTodos: true,
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

type ActionData = {
  formError?: string
}

const badRequest = (data: ActionData) => json(data, { status: 400 })

export const action: ActionFunction = async ({ request }) => {
  const form: FormData = await request.formData()

  const id = form.get("id")

  if (typeof id !== "string") {
    return badRequest({
      formError: `Invalid item ID`,
    })
  }

  console.log("id", id)

  // make sure we find it
  await db.logTodo.findUniqueOrThrow({ where: { id } })

  // mark as done
  await db.logTodo.update({
    data: {
      isDone: true,
    },
    where: {
      id,
    },
  })

  return redirect("/")
}

export default function IndexRoute() {
  const { dailyLog } = useLoaderData<LoaderData>()
  const actionData = useActionData<ActionData>()

  return (
    <>
      <header>
        <h2>Today: {format(parseISO(dailyLog.logDate), "do MMMM, y")}</h2>
      </header>
      <section>
        {actionData?.formError && (
          <p className="text-red-600">{actionData?.formError}</p>
        )}
        <ul>
          {dailyLog.logTodos.map((todo) => {
            return (
              <li key={todo.id}>
                <strong>
                  {todo.isDone ? "☑" : "☐"} {todo.title}
                </strong>
                <br />
                {todo.description}
                <form method="post" action="?index">
                  <input type="hidden" name="id" value={todo.id} />
                  <button type="submit">Mark as Done</button>
                </form>
              </li>
            )
          })}
        </ul>
      </section>
    </>
  )
}
