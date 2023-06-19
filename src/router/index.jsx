import { createBrowserRouter } from 'react-router-dom'
import Home from '../components/home'
import GetData from '../components/members'
import '../assets/css/general-style.css'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/members/house',
    element: <GetData type='house' />
  },
  {
    path: '/members/congress',
    element: <GetData type='senate' />
  },
  {
    path: '*',
    element: <div>Error 404, Not Found</div>
  }
])
