import React from 'react'
import ReactDOM from 'react-dom/client'
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App.jsx'
import Game from './components/Game.jsx';
import Game2 from './components/game2.jsx';
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
      path: "/game",
      element: <Game />
  },
  {
    path: "/game2/:roomId",
    element: <Game2 />
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <Auth0Provider
    domain = "dev-6gmgt36lvurunwhc.us.auth0.com"
    clientId= "hqqhubvZzzw2sGdooyJz9Akr4VKNFaQ7"
    authorizationParams={{
      redirect_uri: "https://d5ttvtw2-5173.inc1.devtunnels.ms/"
    }}
  >
     <RouterProvider router={router}>
      <App/>
    </RouterProvider>
  </Auth0Provider>,

)
