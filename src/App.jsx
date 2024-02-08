import React from 'react'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Registration from './pages/Registration';
import Login from './pages/Login';
import Home from './pages/Home';
import ForgotPassword from './components/ForgotPassword';
import Rootlayout from './pages/Rootlayout';
import Users from './pages/Users';
import Friends from './pages/Friends';
import Block from './pages/Block';
import FriendRequest from './pages/FriendRequest';
import Groups from './pages/Groups';
import CropImg from './pages/CropImg';
import TRy from './components/TRy';
import Chat from './pages/Chat';

function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path="/" element={<Registration/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/home' element={<Home/>}></Route>
        <Route path='/forgot' element={<ForgotPassword/>}></Route>
        <Route path='/home' element={<Rootlayout/>}>
          <Route index element={<Home/>}></Route>
          <Route path='users' element={<Users/>}></Route>
          <Route path='friends' element={<Friends/>}></Route>
          <Route path='friendRequest' element={<FriendRequest/>}></Route>
          <Route path='group' element={<Groups/>}></Route>
          <Route path='block' element={<Block/>}></Route>
          <Route path='cropimg' element={<CropImg/>}></Route>
          <Route path='try' element={<TRy/>}></Route>
          <Route path='chat' element={<Chat/>}></Route>
        </Route>
        
      </Route>
    )
  );


  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
