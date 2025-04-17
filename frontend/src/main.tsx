import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home.tsx";
import About from "./pages/About.tsx";
import Page404 from "./pages/Page404.tsx";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import Create from "./pages/Admin.tsx";
import AuthComponent from "./components/AuthComponent.tsx";
import BadURLRedirect from "./components/BadURLRedirect.tsx";
import { AuthStates } from "./services/AuthStates.ts";
import AuthenticationPage from "./pages/Authentication";
import RideResults from "./pages/RideResults.tsx";
import Signup from "./components/Signup.tsx";
import Signin from "./components/Signin.tsx";
import RideResultTemp from "./pages/RideResultTemp";

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
        index: true,
        element: <Navigate to="/rechercher" replace />,
      },
      {
        path: "/:tab",
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
      // {
      //   path: `/ride-results`,
      //   element: (
      //     <AuthComponent
      //       authStates={[AuthStates.unauthenticated, AuthStates.user]}
      //     >
      //       <RideResult />
      //     </AuthComponent>
      //   ),
      // },
      {
        path: `/ride-results`,
        element: (
          <AuthComponent
            authStates={[AuthStates.unauthenticated, AuthStates.user]}
          >
            <RideResultTemp />
          </AuthComponent>
        ),
      },
      {
        path: `/signin`,
        element: (
          <AuthComponent authStates={[AuthStates.unauthenticated]}>
            <Signin />
          </AuthComponent>
        ),
      },
      {
        path: `/signup`,
        element: (
          <AuthComponent authStates={[AuthStates.unauthenticated]}>
            <Signup />
          </AuthComponent>
        ),
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
