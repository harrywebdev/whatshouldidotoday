import { Link, useActionData, useLoaderData } from "@remix-run/react"
import type { ActionFunction, LoaderFunction } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import { db } from "~/utils/db.server"
import type { Todo } from "@prisma/client"
import invariant from "tiny-invariant"

type ActionData = {
  fieldErrors?: {
    title: string | undefined
    sequence: string | undefined
  }
  fields?: {
    title: FormDataEntryValue | undefined
    description: FormDataEntryValue | undefined
    sequence: FormDataEntryValue | undefined
  }
}

type LoaderData = {
  todo: Todo | undefined
  isNew: boolean
}

const BACK_TO_ROUTE = `/`

const badRequest = (data: ActionData) => json(data, { status: 400 })

const validate = async (fieldName: string, fieldValue: unknown) => {
  switch (fieldName) {
    case "title":
      return typeof fieldValue !== "string" || fieldValue.trim().length < 1
        ? `Title is too short`
        : undefined

    case "sequence":
      return Number.isNaN(Number(fieldValue))
        ? `Sequence must be a valid number`
        : undefined

    case "dailyLogId":
      const dailyLog = db.dailyLog.findUnique({
        where: { id: String(fieldValue) },
      })

      return !dailyLog ? `Daily Log not found` : undefined
  }
}

export const action: ActionFunction = async ({ request, params }) => {
  const form: FormData = await request.formData()

  if (form.get("delete") === "yes") {
    await db.logTodo.delete({
      where: {
        id: params.logTodoId,
      },
    })

    return redirect(BACK_TO_ROUTE)
  }

  const fields = {
    title: form.get("title") ?? undefined,
    description: form.get("description") ?? undefined,
    sequence: form.get("sequence") ?? undefined,
    dailyLogId: params.dailyLogId,
  }

  const fieldErrors = {
    title: await validate("title", fields.title),
    sequence: await validate("sequence", fields.sequence),
    dailyLogId: await validate("dailyLogId", fields.dailyLogId),
  }

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields })
  }

  const data = {
    title: fields.title as string,
    description:
      typeof fields.description === "string" ? fields.description : null,
    sequence: Number(fields.sequence),
    isDone: false,
    dailyLogId: fields.dailyLogId as string,
  }

  if (params.logTodoId === "new") {
    await db.logTodo.create({ data })
  } else {
    await db.logTodo.update({
      where: {
        id: params.logTodoId,
      },
      data,
    })
  }

  return redirect(BACK_TO_ROUTE)
}

export const loader: LoaderFunction = async ({ params }) => {
  // pre-fill sequence
  const dailyLog = await db.dailyLog.findUnique({
    where: { id: params.dailyLogId },
    include: {
      logTodos: {
        select: {
          sequence: true,
        },
        orderBy: {
          sequence: "desc",
        },
        take: 1,
      },
    },
  })
  invariant(dailyLog, `Daily Log not found :(`)

  const nextSequence =
    dailyLog.logTodos.length > 0 ? dailyLog.logTodos[0].sequence + 10 : 0

  if (params.logTodoId === "new") {
    return json({ todo: { sequence: nextSequence }, isNew: true })
  }

  const todo = await db.logTodo.findUniqueOrThrow({
    where: { id: params.logTodoId },
  })
  invariant(todo, `Item not found :(`)

  return json({
    todo,
    isNew: false,
  })
}

export default function TodosNewRoute() {
  const { todo, isNew } = useLoaderData<LoaderData>()
  const actionData = useActionData<ActionData>()

  return (
    <>
      <header>
        <h2>{!isNew ? "Update Daily Item" : "Add New Daily Item"}</h2>
        <nav>
          <Link
            to={BACK_TO_ROUTE}
            title="Back to Today"
            aria-label="Back to Today"
          >
            Back to Today
          </Link>
        </nav>
      </header>

      <form method="post">
        <div>
          <label>
            Title:{" "}
            <input
              type="text"
              name="title"
              defaultValue={
                typeof actionData?.fields?.title === "string"
                  ? actionData?.fields?.title
                  : todo?.title
              }
              aria-invalid={
                Boolean(actionData?.fieldErrors?.title) || undefined
              }
              aria-errormessage={
                actionData?.fieldErrors?.title ? "title-error" : undefined
              }
              required
            />
          </label>
          {actionData?.fieldErrors?.title ? (
            <p className="text-red-600" role="alert" id="title-error">
              {actionData.fieldErrors.title}
            </p>
          ) : null}
        </div>
        <div>
          <label>
            Description:{" "}
            <textarea
              name="description"
              defaultValue={
                typeof actionData?.fields?.description === "string"
                  ? actionData?.fields?.description
                  : typeof todo?.description === "string"
                  ? todo.description
                  : ""
              }
            />
          </label>
        </div>
        <div>
          <label>
            Sequence:{" "}
            <input
              type="number"
              name="sequence"
              defaultValue={
                typeof actionData?.fields?.sequence === "string"
                  ? actionData?.fields?.sequence
                  : todo?.sequence
              }
              required
              aria-invalid={
                Boolean(actionData?.fieldErrors?.sequence) || undefined
              }
              aria-errormessage={
                actionData?.fieldErrors?.sequence ? "sequence-error" : undefined
              }
            />
          </label>
          {actionData?.fieldErrors?.sequence ? (
            <p className="text-red-600" role="alert" id="sequence-error">
              {actionData.fieldErrors.sequence}
            </p>
          ) : null}
        </div>
        <div>
          <button type="submit">{!isNew ? "Update" : "Create new"}</button>

          {!isNew && (
            <button type="submit" name="delete" value="yes">
              Delete
            </button>
          )}
        </div>
      </form>
    </>
  )
}
