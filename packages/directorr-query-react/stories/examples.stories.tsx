import type { Meta, StoryObj } from '@storybook/react'
import { FC, useState } from 'react'
import { useQuery } from '../src'
import { QueryArg } from '@nimel/directorr-query'
import { logMiddleware } from '@nimel/directorr-middlewares'
import { createDecoratorWithDirectorr } from '../../../.storybook/utils'
// import { createQueryMiddleware } from '@nimel/directorr-query'
import { delay, QueryRunner } from './useQuery.stories'

const db = { posts: [] as string[] }

async function getPosts(_: QueryArg<Record<string, unknown>>) {
  await delay(1000)

  return db.posts
}

async function addPost({ variables: { post }, runQuery }: QueryArg<{ post: string }>) {
  await delay(1000)

  db.posts = [...db.posts, post]

  return runQuery(getPosts, {})
}

type Story = StoryObj<typeof QueryRunner>

const AddPost: FC = () => {
  const [post, setPost] = useState('')
  const { fetch, isLoading, isSuccess, isLoaded } = useQuery(addPost)
  const status = isLoading ? 'Loading...' : isLoaded ? (isSuccess ? '✔' : '×') : ''

  return (
    <div>
      <span>
        <input value={post} onChange={e => setPost(e.target.value)} />
        <button onClick={() => post && fetch({ post })}>send post</button>
        <div>{status}</div>
      </span>
    </div>
  )
}

export const UpdatePost: Story = {
  args: {
    query: getPosts,
    variables: {},
    children: <AddPost />,
  },
}

export default {
  title: 'examples',
  component: QueryRunner,
  decorators: [createDecoratorWithDirectorr({ middlewares: [logMiddleware] })],
} as Meta
