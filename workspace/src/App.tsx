import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HomePage from "./pages/Home";
import RootLayout from "./pages/Root";
import SignInPage from "./pages/SignIn/SignIn";
import ErrorPage from "./pages/error-page/Error";
import SignUpAdminPage from "./pages/SignUp/SignUpAdmin/SignUpAdmin";
import SignUpUserPage from "./pages/SignUp/SignUpUser/SignUpUser";
import UserOnly from "./auth/UserOnly";
import AdminOnly from "./auth/AdminOnly";

import { lazy, Suspense } from "react";
import SkeletonLog from "./UI/Skeleton/Skeleton";

const Admin = lazy(
  () => import("./pages/admin/EmployerControl/EmployerControl")
);
const AdminStats = lazy(() => import("./pages/admin/AdminStats/AdminStats"));
const User = lazy(() => import("./pages/user/EmployeeProfile"));
const UserStats = lazy(() => import("./pages/user/Stats"));

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
        element: (
          <AdminOnly>
            <Suspense fallback={<SkeletonLog />}>
              <Admin />,
            </Suspense>
          </AdminOnly>
        ),
      },
      // {
      //   path: "admin/stats",
      //   element: (
      //     <AdminOnly>
      //       <Suspense fallback={<SkeletonLog />}>
      //         <AdminStats />,
      //       </Suspense>
      //     </AdminOnly>
      //   ),
      // },
      {
        path: "user",
        element: (
          <UserOnly>
            <Suspense fallback={<SkeletonLog />}>
              <User />,
            </Suspense>
          </UserOnly>
        ),
      },
      {
        path: "user/stats",
        element: (
          <UserOnly>
            <Suspense fallback={<SkeletonLog />}>
              <UserStats />,
            </Suspense>
          </UserOnly>
        ),
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default function WrappedApp() {
  return (
    <Suspense fallback="...loading">
      <App />
    </Suspense>
  );
}
