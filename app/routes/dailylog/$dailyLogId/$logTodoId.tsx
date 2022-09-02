import { Link, useActionData, useLoaderData } from "@remix-run/react"
import type { ActionFunction, LoaderFunction } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import { db } from "~/utils/db.server"
import type { Todo } from "@prisma/client"
import invariant from "tiny-invariant"
import Button from "~/components/Button"
import LargeTitle from "~/components/LargeTitle"
import ScreenHeader from "~/components/ScreenHeader"
import ScreenHeaderNavLink from "~/components/ScreenHeaderNavLink"
import FormFieldGroup from "~/components/Form/FormFieldGroup"
import FormLabel from "~/components/Form/FormLabel"
import FormField from "~/components/Form/FormField"
import FormInput from "~/components/Form/FormInput"
import FormFieldDescription from "~/components/Form/FormFieldDescription"
import FormTextarea from "~/components/Form/FormTextarea"

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
      <ScreenHeader>
        <LargeTitle>
          {!isNew ? "Update Daily Item" : "Add New Daily Item"}
        </LargeTitle>
        <ScreenHeaderNavLink
          to={BACK_TO_ROUTE}
          label={"Back to Today"}
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
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          }
        />
      </ScreenHeader>

      <div className="px-4">
        <form method="post">
          <FormFieldGroup>
            <FormLabel htmlFor="title">Title</FormLabel>
            <FormField>
              <FormInput
                id="title"
                type="text"
                name="title"
                placeholder="Use imperative form"
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
            </FormField>
            {actionData?.fieldErrors?.title ? (
              <FormFieldDescription>
                <p className="text-red-600" role="alert" id="title-error">
                  {actionData.fieldErrors.title}
                </p>
              </FormFieldDescription>
            ) : null}
          </FormFieldGroup>

          <FormFieldGroup>
            <FormLabel htmlFor="description">Description</FormLabel>
            <FormField>
              <FormTextarea
                id="description"
                name="description"
                placeholder="Add any details about this item"
                defaultValue={
                  typeof actionData?.fields?.description === "string"
                    ? actionData?.fields?.description
                    : typeof todo?.description === "string"
                    ? todo.description
                    : ""
                }
              />
            </FormField>
          </FormFieldGroup>

          <FormFieldGroup>
            <FormLabel htmlFor="sequence">Sequence</FormLabel>
            <FormField>
              <FormInput
                id="sequence"
                type="number"
                name="sequence"
                placeholder="E.g. 50 or 225"
                defaultValue={
                  typeof actionData?.fields?.sequence === "string"
                    ? actionData?.fields?.sequence
                    : todo?.sequence
                }
                aria-invalid={
                  Boolean(actionData?.fieldErrors?.sequence) || undefined
                }
                aria-errormessage={
                  actionData?.fieldErrors?.sequence
                    ? "sequence-error"
                    : undefined
                }
                required
              />
            </FormField>
            {actionData?.fieldErrors?.sequence ? (
              <FormFieldDescription>
                <p className="text-red-600" role="alert" id="sequence-error">
                  {actionData.fieldErrors.sequence}
                </p>
              </FormFieldDescription>
            ) : (
              <FormFieldDescription>
                This number determines order in the list. Use tens or hundreds.
              </FormFieldDescription>
            )}
          </FormFieldGroup>

          <FormFieldGroup>
            <div className="pb-2">
              <Button
                primary
                type="submit"
                label={!isNew ? "Update" : "Create new"}
              />

              {!isNew && (
                <Button
                  type="submit"
                  name="delete"
                  value="yes"
                  label={"Delete"}
                  className={"ml-3 !text-danger-600"}
                />
              )}
            </div>
          </FormFieldGroup>
        </form>
      </div>
    </>
  )
}
