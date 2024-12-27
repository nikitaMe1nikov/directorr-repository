import type { Meta, StoryObj } from '@storybook/react'
import { FC, HTMLAttributes } from 'react'
import { useQuery } from '../src'
import { QueryArg, Query } from '@nimel/directorr-query'
import { logMiddleware } from '@nimel/directorr-middlewares'
import { createDecoratorWithDirectorr } from '../../../.storybook/utils'
// import { createQueryMiddleware } from '@nimel/directorr-query'

export function delay(ms = 1000) {
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

export const QueryRunner: FC<{
  query: Query
  variables: any
  style: HTMLAttributes<HTMLDivElement>['style']
}> = ({ query, variables, children, style }) => {
  const { fetch, data, isLoading, isSuccess, isError, error } = useQuery(query, variables)

  return (
    <div style={style}>
      <button onClick={() => fetch({ id: 0 })}>run query</button>
      <>
        <h4>{`data: ${data}`}</h4>
        <h4>{`isLoading: ${isLoading}`}</h4>
        <h4>{`isSuccess: ${isSuccess}`}</h4>
        <h4>{`isError: ${isError}`}</h4>
        <h4>{`error: ${error}`}</h4>
      </>
      {children}
    </div>
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

export const InnerQuery: Story = {
  args: {
    query: someQuery,
    variables: { id: 0 },
    style: { background: 'red' },
    children: (
      <QueryRunner query={someQuery} variables={{ id: 0 }} style={{ background: 'green' }} />
    ),
  },
}

export default {
  title: 'useQuery',
  component: QueryRunner,
  decorators: [createDecoratorWithDirectorr({ middlewares: [logMiddleware] })],
} as Meta<typeof QueryRunner>
