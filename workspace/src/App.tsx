import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HomePage from "./pages/Home";
import RootLayout from "./pages/Root";
import SignInPage from "./pages/SignIn/SignIn";
import ErrorPage from "./pages/error-page/Error";
import EmployeeProfilePage from "./pages/user/EmployeeProfile";
import EmployeeControlPage from "./pages/admin/EmployerControl/EmployerControl";
import SignUpAdminPage from "./pages/SignUp/SignUpAdmin/SignUpAdmin";
import SignUpUserPage from "./pages/SignUp/SignUpUser/SignUpUser";
import AdminOnly from "./auth/AdminOnly";
import UserOnly from "./auth/UserOnly";
import { Stats } from "fs";
import StatsPage from "./pages/user/Stats";

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

export default App;
