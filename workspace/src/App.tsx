import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HomePage from "./pages/Home";
import RootLayout from "./pages/Root";
import SignUpPage from "./pages/SignUp/SignUp";
import SignInPage from "./pages/SignIn/SignIn";
import ErrorPage from "./pages/error-page/Error";
import EmployeeProfilePage from "./pages/user/EmployeeProfile";
import EmployeeControlPage from "./pages/admin/EmployerControl/EmployerControl";
import SignUpAdminPage from "./pages/SignUp/SignUpAdmin/SignUpAdmin";

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
        path: "signupadmin",
        element: <SignUpAdminPage />,
      },
      {
        path: "signup",
        element: <SignUpPage />,
      },
      {
        path: "signin",
        element: <SignInPage />,
      },
      {
        path: "user",
        element: <EmployeeProfilePage />,
        children: [],
      },
      {
        path: "admin",
        element: <EmployeeControlPage />,
        children: [],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
