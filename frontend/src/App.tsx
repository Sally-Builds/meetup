import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthLayout from "./layout/AuthLayout";
import LandingPage from "./pages/LandingPage/LandingPage";
import "./App.css";
import TermsPage from "./pages/TermsPage";
import AuthPage from "./pages/AuthPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import GettingStartedPage from "./pages/GettingStartedPage";
import MainLayout from "./layout/MainLayout";
import DashboardPage from "./pages/DashboardPage";
import EventsPage from "./pages/EventsPage";
import CreateEventPage from "./pages/CreateEventPage";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import EventOverviewPage from "./pages/EventOverviewPage";
import Protected from "./components/Auth/Protected";
import Tinder from "./pages/Tinder";
import Chat from "./pages/Chat";
import MessageList from "./pages/Messages";
import FriendRequests from "./pages/Requests";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "./apollo-client";
import SettingsPage from "./pages/SettingsPage";
import ConnectionsPage from "./pages/ConnectionsPage";

const queryClient = new QueryClient();

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
          element: (
            // <Protected>
            <GettingStartedPage />
            // </Protected>
          ),
        },
      ],
    },
    {
      path: "/dashboard",
      element: (
        <Protected>
          <MainLayout />
        </Protected>
      ),
      children: [
        {
          path: "",
          element: <DashboardPage />,
        },
        {
          path: "events",
          element: <EventsPage />,
        },
        {
          path: "events/create",
          element: <CreateEventPage />,
        },
        {
          path: "events/:slug",
          element: <EventOverviewPage />,
        },
        {
          path: "duo-meetup",
          element: <Tinder />,
        },
        {
          path: "requests",
          element: <FriendRequests />,
        },
        {
          path: "chat/:friendId",
          element: <Chat />,
        },
        {
          path: "messages",
          element: <MessageList />,
        },
        {
          path: "settings",
          element: <SettingsPage />,
        },
        {
          path: "connections",
          element: <ConnectionsPage />,
        },
      ],
    },
  ]);
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ApolloProvider client={apolloClient}>
          <RouterProvider router={router} />
        </ApolloProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
