import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import { ThemeProvider } from "./components/theme-provider";
import Layout from "./layouts/Layout";
import HomePage from "./pages/HomePage";
import Amor from "./labs/amor/Amor";
import DockerLabsLayout from "./labs/DockerLabsLayout";
import AnonymousPingu from "./labs/anonymouspingu/AnonymousPingu";
import AguaDeMayo from "./labs/aguademayo/AguaDeMayo";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout/>,
    children:[
      {
        path: "",
        element: <HomePage/>
      },
      {
        path: "/docker-labs",
        element:<DockerLabsLayout/>,
        children:[
          {
            path: "amor",
            element: <Amor />
          },
          {
            path: "agua-de-mayo",
            element: <AguaDeMayo />
          },
          {
            path: "anonymous-pingu",
            element: <AnonymousPingu/>
          }
        ]
      },

    ]
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <RouterProvider router={router} />
  </ThemeProvider>
);