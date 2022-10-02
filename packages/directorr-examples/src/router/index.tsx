import ReactDOM from 'react-dom'
import { Directorr } from '@nimel/directorr'
import { DirectorrProvider } from '@nimel/directorr-react'
import { Router, historyChange, ANY_PATH } from '@nimel/directorr-router-react'
import { logMiddleware } from '@nimel/directorr-middlewares'
import './index.css'
import PageOne from './PageOne'
import PageTwo from './PageTwo'

class TestStore {
  @historyChange('/two')
  ToAction = (payload: any) => {
    console.log('historyChange', payload)
  }
}

const director = new Directorr()

director.addMiddlewares([logMiddleware])
director.addStores([TestStore])

const routes = [
  {
    path: '/',
    component: PageOne,
  },
  {
    path: `/two${ANY_PATH}`,
    component: PageTwo,
  },
]

const app = (
  <DirectorrProvider value={director}>
    <Router routes={routes} />
  </DirectorrProvider>
)

ReactDOM.render(app, document.querySelector('#app'))
