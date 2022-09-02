import type { ActionFunction, LoaderFunction } from "@remix-run/node"
import { db } from "~/utils/db.server"
import type { Prisma } from "@prisma/client"
import { json, redirect } from "@remix-run/node"
import { useActionData, useLoaderData } from "@remix-run/react"
import { format, parseISO } from "date-fns"
import ScreenHeader from "~/components/Screen/ScreenHeader"
import ScreenHeaderNavLink from "~/components/ScreenHeaderNavLink"
import LogTodoItem from "~/components/LogTodoItem"
import ItemGroup from "~/components/ItemGroup"
import SecondaryTitle from "~/components/SecondaryTitle"
import ScreenTitle from "~/components/Screen/ScreenTitle"
import ScreenContent from "~/components/Screen/ScreenContent"

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

  // make sure we find it
  const logTodo = await db.logTodo.findUniqueOrThrow({ where: { id } })

  // mark as done
  await db.logTodo.update({
    data: {
      isDone: !logTodo.isDone,
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
      <ScreenHeader
        title="Today"
        rightAction={
          <ScreenHeaderNavLink
            to={`/dailylog/${dailyLog.id}/new`}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            }
          />
        }
      />

      <ScreenContent>
        <SecondaryTitle className="px-3">
          {format(parseISO(dailyLog.logDate), "do MMM, y")}
        </SecondaryTitle>
        {actionData?.formError && (
          <p className="text-red-600">{actionData?.formError}</p>
        )}
        <ItemGroup>
          <ul>
            {dailyLog.logTodos.map((todo) => {
              return (
                <LogTodoItem
                  key={todo.id}
                  todo={todo}
                  dailyLogId={dailyLog.id}
                  formAction="?index"
                />
              )
            })}
          </ul>
        </ItemGroup>
      </ScreenContent>
    </>
  )
}
