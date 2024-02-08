import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import firebaseConfig from './config/firebaseConfig.jsx'
import { Provider } from 'react-redux'
import store from '../src/redux/stores/store.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
   <Provider store={store}>
    <App />
  </Provider>
  </>
)
