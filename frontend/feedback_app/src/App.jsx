import React from 'react'
import SignupLoginForm from './components/SignupLoginForm'
import {  createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './components/Home'
import ResetPassword from './components/ResetPassword.jsx'
import UpdateProfile from './components/Profile.jsx'
import PublicRoute from './components/PublicRoute.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

import StyleDetail from './components/StyleDetail.jsx'

import AddHijabStyle from './components/AddHijabStyle.jsx'

const App = () => {
  const router = createBrowserRouter([
       { path: '/auth', element: (<PublicRoute><SignupLoginForm /></PublicRoute>) },
        { path: '/reset-password/:token', element: (<PublicRoute><ResetPassword /></PublicRoute>) },
      {path:'/profile',element: (<ProtectedRoute><UpdateProfile/></ProtectedRoute>)},
    
          { path: '/', element: (<ProtectedRoute><Home /></ProtectedRoute>) },
                 { path:"/style/:id" ,element:(<ProtectedRoute><StyleDetail/></ProtectedRoute>) },
                 {path: '/add-style', element:(<ProtectedRoute><AddHijabStyle/></ProtectedRoute>)}
                // { path: '/users', element: (<ProtectedRoute>< GetAllUsers/></ProtectedRoute>) },
  ])
  return (
<RouterProvider router={router}/>
  )
}

export default App
