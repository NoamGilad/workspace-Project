import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HomePage from "./pages/Home";
import RootLayout from "./pages/Root";
import SignInPage from "./pages/SignIn/SignIn";
import ErrorPage from "./pages/error-page/Error";
import EmployeeProfilePage from "./pages/user/EmployeeProfile";
import EmployeeControlPage from "./pages/admin/EmployerControl/EmployerControl";
import SignUpAdminPage from "./pages/SignUp/SignUpAdmin/SignUpAdmin";
import SignUpUserPage from "./pages/SignUp/SignUpUser/SignUpUser";
import UserOnly from "./auth/UserOnly";
import StatsPage from "./pages/user/Stats";

import { Suspense } from "react";
import { useTranslation } from "react-i18next";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "signup-admin",
        element: <SignUpAdminPage />,
      },
      {
        path: "signin",
        element: <SignInPage />,
      },
      {
        path: "signup-user",
        element: <SignUpUserPage />,
      },
      {
        path: "signup-user",
        element: <SignUpUserPage />,
      },
      {
        path: "admin",
        element: <EmployeeControlPage />,
      },
      {
        path: "user",
        element: (
          <UserOnly>
            <EmployeeProfilePage />,
          </UserOnly>
        ),
      },
      {
        path: "user/stats",
        element: (
          <UserOnly>
            <StatsPage />,
          </UserOnly>
        ),
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default function WrappedApp() {
  return (
    <Suspense fallback="...loading">
      <App />
    </Suspense>
  );
}
