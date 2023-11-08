import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { RouterProvider } from '@tanstack/react-router';
import { ConfigProvider } from 'antd';
import router from './routes';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#00b96b',
          colorBgContainer: '#EFF0FA',
          colorLink: '#5458C9',
        },
        components: {
          Segmented: {
            itemSelectedBg: '#00b96b',
            colorBgBase: '#5458C9',
            itemHoverColor: 'white',
            itemColor: 'white',
          },
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
