import React from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import './styles/index.css';
import { App } from './components';
import { AuthProvider, PostProvider } from './providers';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>


      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <AuthProvider>
        <PostProvider >
          <App/>
        </PostProvider>
      </AuthProvider>
      

    
  </React.StrictMode>
);
