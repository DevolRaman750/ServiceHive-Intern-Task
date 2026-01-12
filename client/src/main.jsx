import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './store/store.js'
import { NotificationProvider } from './context/NotificationContext.jsx'
import { SocketProvider } from './context/SocketContext.jsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <NotificationProvider>
        <SocketProvider>
          <App />
          <ToastContainer />
        </SocketProvider>
      </NotificationProvider>
    </Provider>
  </React.StrictMode>,
)
