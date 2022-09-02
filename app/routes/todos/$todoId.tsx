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
import FormLabel from "~/components/Form/FormLabel"
import FormField from "~/components/Form/FormField"
import FormTextarea from "~/components/Form/FormTextarea"
import FormInput from "~/components/Form/FormInput"
import FormFieldDescription from "~/components/Form/FormFieldDescription"
import FormFieldGroup from "~/components/Form/FormFieldGroup"
import FormLegend from "~/components/Form/FormLegend"
import FormCheckbox from "~/components/Form/FormCheckbox"
import ScreenTitle from "~/components/Screen/ScreenTitle"

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
  isNew: boolean
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

  const data = {
    title: fields.title as string,
    description:
      typeof fields.description === "string" ? fields.description : null,
    repeat: fields.repeat.join(","),
    sequence: Number(fields.sequence),
  }

  if (params.todoId === "new") {
    await db.todo.create({ data })
  } else {
    await db.todo.update({
      where: {
        id: params.todoId,
      },
      data,
    })
  }

  return redirect(`/todos`)
}

export const loader: LoaderFunction = async ({ params }) => {
  // pre-fill sequence
  const lastTodo = await db.todo.findFirst({
    select: {
      sequence: true,
    },
    orderBy: {
      sequence: "desc",
    },
    take: 1,
  })
  const nextSequence = lastTodo ? lastTodo.sequence + 10 : 0

  if (params.todoId === "new") {
    return json({ todo: { sequence: nextSequence }, isNew: true })
  }

  const todo = await db.todo.findUniqueOrThrow({ where: { id: params.todoId } })
  invariant(todo, `Item not found :(`)

  return json({
    todo,
    isNew: false,
  })
}

export default function TodosNewRoute() {
  const { todo, isNew } = useLoaderData<LoaderData>()
  const actionData = useActionData<ActionData>()

  const repeatItems = [
    { key: "mo", label: "Every Monday" },
    { key: "tu", label: "Every Tuesday" },
    { key: "we", label: "Every Wednesday" },
    { key: "th", label: "Every Thursday" },
    { key: "fr", label: "Every Friday" },
    { key: "sa", label: "Every Saturday" },
    { key: "su", label: "Every Sunday" },
  ]

  return (
    <>
      <ScreenHeader>
        <ScreenHeaderNavLink
          to={"/todos"}
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
        <ScreenTitle>{!isNew ? "Update TODO" : "Add New TODO"}</ScreenTitle>
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
                placeholder="Use imperative form for TODO title"
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
            <fieldset>
              <FormLegend>Repeat</FormLegend>

              {actionData?.fieldErrors?.repeat ? (
                <p className="text-red-600" role="alert">
                  {actionData?.fieldErrors?.repeat}
                </p>
              ) : null}

              <div className="mt-2 space-y-3 pl-1">
                {repeatItems.map((item) => {
                  return (
                    <FormCheckbox
                      key={item.key}
                      id={`repeat_${item.key}`}
                      name="repeat"
                      value={item.key}
                      defaultChecked={
                        actionData?.fields?.repeat?.includes(item.key) ||
                        (typeof todo?.repeat === "string" &&
                          todo.repeat.indexOf(item.key) >= 0)
                      }
                      label={item.label}
                    />
                  )
                })}
              </div>
            </fieldset>
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
