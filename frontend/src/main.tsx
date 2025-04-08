import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.tsx";
import About from "./pages/About.tsx";
import Page404 from "./pages/Page404.tsx";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import Create from "./pages/Admin.tsx";
import AuthComponent from "./components/AuthComponent.tsx";
import BadURLRedirect from "./components/BadURLRedirect.tsx";
import { AuthStates } from "./services/AuthStates.ts";
import AuthenticationPage from "./pages/Authentication";

const client = new ApolloClient({
  uri: "/api",
  cache: new InMemoryCache(),
  credentials: "same-origin",
});

const router = createBrowserRouter([
  {
    path: "",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/admin",
        element: (
          <AuthComponent authStates={[AuthStates.admin]}>
            <Create />
          </AuthComponent>
        ),
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: `/auth/:tab`,
        element: (
          <AuthComponent authStates={[AuthStates.unauthenticated]}>
            <AuthenticationPage />
          </AuthComponent>
        ),
      },
    ],
  },
  {
    path: "*",
    element: (
      <BadURLRedirect
        authStates={[AuthStates.unauthenticated, AuthStates.user]}
      >
        <Page404 />
      </BadURLRedirect>
    ),
  },
]);

createRoot(document.getElementById("root")!).render(
  <ApolloProvider client={client}>
    <RouterProvider router={router} />
  </ApolloProvider>
);
