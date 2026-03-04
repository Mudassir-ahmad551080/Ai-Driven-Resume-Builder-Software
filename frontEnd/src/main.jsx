
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './context/ThemContext.jsx'
import { Provider } from 'react-redux'
import {store} from './app/store.js'
createRoot(document.getElementById('root')).render(
    <ThemeProvider>
        <BrowserRouter>
        <Provider store={store}>
         <App />
        </Provider>
        </BrowserRouter>
     </ThemeProvider>
)
