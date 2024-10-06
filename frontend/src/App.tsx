import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthLayout from "./layout/AuthLayout";
import LandingPage from "./pages/LandingPage/LandingPage";
import "./App.css";
import TermsPage from "./pages/TermsPage";
import AuthPage from "./pages/AuthPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import GettingStartedPage from "./pages/GettingStartedPage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AuthLayout />,
      children: [
        {
          path: "",
          element: <LandingPage />,
        },
        {
          path: "/terms-of-service",
          element: <TermsPage />,
        },
        {
          path: "/auth",
          element: <AuthPage />,
        },
        {
          path: "/signup",
          element: <SignupPage />,
        },
        {
          path: "/login",
          element: <LoginPage />,
        },
        {
          path: "/getting-started",
          element: <GettingStartedPage />,
        },
      ],
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
