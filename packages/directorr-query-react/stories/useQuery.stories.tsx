// import { QueryArg } from '@nimel/directorr-query'
import type { Meta, StoryObj } from '@storybook/react'
import { FC } from 'react'
import { useQuery } from '../src'
import { QueryArg } from '@nimel/directorr-query'
import { Directorr } from '@nimel/directorr'
import { logMiddleware } from '@nimel/directorr-middlewares'
import { DirectorrProvider } from '@nimel/directorr-react'
import { createQueryMiddleware } from '@nimel/directorr-query'

const directorr = new Directorr({ middlewares: [logMiddleware, createQueryMiddleware()] })

function delay(ms = 1000) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function someQuery({ variables: { id = 0 } }: QueryArg<{ id: number }>) {
  await delay(3000)

  return [id]
}

async function someQueryError({ variables: { id = 0 } }: QueryArg<{ id: number }>) {
  await delay(3000)

  throw new Error(`${id}`)
}

async function someQueryUseAnotherQuery({
  variables: { id = 0 },
  runQuery,
}: QueryArg<{ id: number }>) {
  await delay(1000)

  return runQuery(someQuery, { id })
}

type Story = StoryObj<typeof QueryRunner>

let count = 0

const QueryRunner: FC<any> = ({ query, variables }) => {
  const { fetch, data, isLoading, isSuccess, isError, error } = useQuery(query, variables)

  return (
    <>
      <button onClick={() => fetch({ id: count++ })}>run query</button>
      <>
        <h4>{`data: ${data}`}</h4>
        <h4>{`isLoading: ${isLoading}`}</h4>
        <h4>{`isSuccess: ${isSuccess}`}</h4>
        <h4>{`isError: ${isError}`}</h4>
        <h4>{`error: ${error}`}</h4>
      </>
    </>
  )
}

export const Default: Story = {
  args: {
    query: someQuery,
  },
}

export const InitVariables: Story = {
  args: {
    query: someQuery,
    variables: { id: 0 },
  },
}

export const NestedQuery: Story = {
  args: {
    query: someQueryUseAnotherQuery,
    variables: { id: 0 },
  },
}

export const WhenError: Story = {
  args: {
    query: someQueryError,
    variables: { id: 0 },
  },
}

export default {
  title: 'useQuery',
  component: QueryRunner,
  decorators: [
    (Story, context) => (
      <DirectorrProvider value={directorr}>
        <Story {...context} />
      </DirectorrProvider>
    ),
  ],
} as Meta<typeof QueryRunner>
