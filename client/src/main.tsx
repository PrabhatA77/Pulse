import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import './index.css'
import App from './App.tsx'


createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
      <App />
      <ToastContainer position='top-center' autoClose={3000}/>
    </BrowserRouter>
)
