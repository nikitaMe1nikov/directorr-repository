import type { Meta, StoryObj } from '@storybook/react'
import { FC } from 'react'
import {
  Router,
  historyChange,
  ANY_PATH,
  HistoryStore as HistoryStoreDefault,
  ANIMATIONS,
} from '../src'
import { Directorr } from '@nimel/directorr'
import { logMiddleware } from '@nimel/directorr-middlewares'
import { DirectorrProvider, useStore } from '@nimel/directorr-react'
import { createMemoryHistory } from '@nimel/directorr-router'

class HistoryStore extends HistoryStoreDefault {
  static storeInitOptions = createMemoryHistory()
}

const directorr = new Directorr({ middlewares: [logMiddleware], stores: [HistoryStore] })

class TestStore {
  @historyChange('/two')
  ToAction = (payload: any) => {
    console.log('historyChange', payload)
  }
}

const containerStyle = {
  height: '400px',
  width: '400px',
  display: 'flex',
  flex: '1 1 auto',
  flexDirection: 'column' as any,
  justifyContent: 'center',
  alignItems: 'center',
}

const pageOneStyle = {
  ...containerStyle,
  backgroundColor: 'aquamarine',
}

const PageOne: FC = () => {
  const router = useStore(HistoryStore)

  return (
    <div style={pageOneStyle}>
      <button onClick={() => router.push('/two')}>PageOne</button>
    </div>
  )
}

const pageThreeStyle = {
  ...containerStyle,
  backgroundColor: 'chartreuse',
}

const PageThree: FC = () => {
  const router = useStore(HistoryStore)

  return (
    <div style={pageThreeStyle}>
      <button onClick={() => router.push('/two/four')}>PageThree</button>
    </div>
  )
}

const pageFourStyle = {
  ...containerStyle,
  backgroundColor: 'teal',
}

const PageFour: FC = () => {
  const router = useStore(HistoryStore)

  return (
    <div style={pageFourStyle}>
      <button onClick={() => router.push('/two')}>PageFour</button>
    </div>
  )
}

const pageTwoStyle = {
  ...containerStyle,
  backgroundColor: 'tomato',
}

const subcontainerStyle = {
  ...containerStyle,
  width: '100%',
}

const PageTwo: FC = () => {
  useStore(TestStore)
  const router = useStore(HistoryStore)
  const routes = [
    {
      path: '/two',
      component: PageThree,
    },
    {
      path: '/two/four',
      component: PageFour,
    },
  ]

  return (
    <div style={pageTwoStyle}>
      <button onClick={() => router.push('/')}>PageTwo</button>
      <div style={subcontainerStyle}>
        <Router animation={ANIMATIONS.FADE} routes={routes} />
      </div>
    </div>
  )
}

type Story = StoryObj<typeof Router>

export const Default: Story = {
  args: {
    routes: [
      {
        path: '/',
        component: PageOne,
      },
      {
        path: `/two${ANY_PATH}`,
        component: PageTwo,
      },
    ],
  },
}

export default {
  title: 'Router',
  component: Router,
  layout: 'fullscreen',
  decorators: [
    (Story, context) => (
      <DirectorrProvider value={directorr}>
        <Story {...context} />
      </DirectorrProvider>
    ),
  ],
} as Meta<typeof Router>
