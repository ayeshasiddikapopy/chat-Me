import { configureStore } from '@reduxjs/toolkit'
import userSlice from '../slices/userSlices'
import chatUserSlice from '../slices/chatSlice'

export default configureStore({
  reducer: {
    userdata:userSlice,
    userChatdata: chatUserSlice
  },
})