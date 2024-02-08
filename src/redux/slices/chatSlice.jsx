import { createSlice } from "@reduxjs/toolkit";

export const chatUserSlice = createSlice({
    name: 'chat',
    initialState:{
         chatInfo: 
            localStorage.getItem('chatInfo') 
            ?
            JSON.parse(localStorage.getItem('chatInfo'))
            :
            'null'  
    },
    reducers: {
        activeChatUser : (state, action) => {
            state.chatInfo = action.payload
        }
    }
    
})

export const {activeChatUser} = chatUserSlice.actions
export default chatUserSlice.reducer




