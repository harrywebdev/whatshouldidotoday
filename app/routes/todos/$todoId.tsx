import { Link, useActionData, useLoaderData } from "@remix-run/react"
import type { ActionFunction, LoaderFunction } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import { db } from "~/utils/db.server"
import type { Todo } from "@prisma/client"
import invariant from "tiny-invariant"

type ActionData = {
  fieldErrors?: {
    title: string | undefined
    repeat: string | undefined
    sequence: string | undefined
  }
  fields?: {
    title: FormDataEntryValue | undefined
    description: FormDataEntryValue | undefined
    repeat: FormDataEntryValue[]
    sequence: FormDataEntryValue | undefined
  }
}

type LoaderData = {
  todo: Todo | undefined
}

const badRequest = (data: ActionData) => json(data, { status: 400 })

const validate = (fieldName: string, fieldValue: unknown) => {
  switch (fieldName) {
    case "title":
      return typeof fieldValue !== "string" || fieldValue.trim().length < 1
        ? `Title is too short`
        : undefined

    case "repeat":
      return !Array.isArray(fieldValue) ||
        fieldValue.reduce((hasError: boolean, repeat: string) => {
          return (
            hasError ||
            !["mo", "tu", "we", "th", "fr", "sa", "su"].includes(repeat)
          )
        }, false)
        ? `Invalid value for "repeat"`
        : undefined

    case "sequence":
      return Number.isNaN(Number(fieldValue))
        ? `Sequence must be a valid number`
        : undefined
  }
}

export const action: ActionFunction = async ({ request, params }) => {
  const form: FormData = await request.formData()

  if (form.get("delete") === "yes") {
    await db.todo.delete({
      where: {
        id: params.todoId,
      },
    })

    return redirect("/todos")
  }

  const fields = {
    title: form.get("title") ?? undefined,
    description: form.get("description") ?? undefined,
    repeat: form.getAll("repeat").map((value) => value.toString()),
    sequence: form.get("sequence") ?? undefined,
  }

  const fieldErrors = {
    title: validate("title", fields.title),
    repeat: validate("repeat", fields.repeat),
    sequence: validate("sequence", fields.sequence),
  }

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields })
  }

  if (params.todoId === "new") {
    await db.todo.create({
      data: {
        title: fields.title as string,
        repeat: fields.repeat.join(","),
        sequence: Number(fields.sequence),
      },
    })
  } else {
    await db.todo.update({
      where: {
        id: params.todoId,
      },
      data: {
        title: fields.title as string,
        repeat: fields.repeat.join(","),
        sequence: Number(fields.sequence),
      },
    })
  }

  return redirect(`/todos`)
}

export const loader: LoaderFunction = async ({ params }) => {
  if (params.todoId === "new") {
    return json({})
  }

  const todo = await db.todo.findUniqueOrThrow({ where: { id: params.todoId } })
  invariant(todo, `Item not found :(`)

  return json({
    todo,
  })
}

export default function TodosNewRoute() {
  const { todo } = useLoaderData<LoaderData>()
  const actionData = useActionData<ActionData>()

  return (
    <>
      <header>
        <h2>{typeof todo !== "undefined" ? "Update TODO" : "Add New TODO"}</h2>
        <nav>
          <Link to="/todos" title="Back to TODOs" aria-label="Back to TODOs">
            Back to TODOs
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
          <fieldset>
            <legend>Repeat</legend>
            {actionData?.fieldErrors?.repeat ? (
              <p className="text-red-600" role="alert">
                {actionData?.fieldErrors?.repeat}
              </p>
            ) : null}
            <div>
              <label>
                <input
                  type="checkbox"
                  name="repeat"
                  value="mo"
                  defaultChecked={
                    actionData?.fields?.repeat?.includes("mo") ||
                    (typeof todo !== "undefined" &&
                      todo.repeat.indexOf("mo") >= 0)
                  }
                />{" "}
                Every Monday
              </label>
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  name="repeat"
                  value="tu"
                  defaultChecked={
                    actionData?.fields?.repeat?.includes("tu") ||
                    (typeof todo !== "undefined" &&
                      todo.repeat.indexOf("tu") >= 0)
                  }
                />{" "}
                Every Tuesday
              </label>
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  name="repeat"
                  value="we"
                  defaultChecked={
                    actionData?.fields?.repeat?.includes("we") ||
                    (typeof todo !== "undefined" &&
                      todo.repeat.indexOf("we") >= 0)
                  }
                />{" "}
                Every Wednesday
              </label>
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  name="repeat"
                  value="th"
                  defaultChecked={
                    actionData?.fields?.repeat?.includes("th") ||
                    (typeof todo !== "undefined" &&
                      todo.repeat.indexOf("th") >= 0)
                  }
                />{" "}
                Every Thursday
              </label>
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  name="repeat"
                  value="fr"
                  defaultChecked={
                    actionData?.fields?.repeat?.includes("fr") ||
                    (typeof todo !== "undefined" &&
                      todo.repeat.indexOf("fr") >= 0)
                  }
                />{" "}
                Every Friday
              </label>
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  name="repeat"
                  value="sa"
                  defaultChecked={
                    actionData?.fields?.repeat?.includes("sa") ||
                    (typeof todo !== "undefined" &&
                      todo.repeat.indexOf("sa") >= 0)
                  }
                />{" "}
                Every Saturday
              </label>
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  name="repeat"
                  value="su"
                  defaultChecked={
                    actionData?.fields?.repeat?.includes("su") ||
                    (typeof todo !== "undefined" &&
                      todo.repeat.indexOf("su") >= 0)
                  }
                />{" "}
                Every Sunday
              </label>
            </div>
          </fieldset>
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
          <button type="submit">
            {typeof todo !== "undefined" ? "Update" : "Create new"}
          </button>

          {typeof todo !== "undefined" && (
            <button type="submit" name="delete" value="yes">
              Delete
            </button>
          )}
        </div>
      </form>
    </>
  )
}
