import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useUserStore } from "../../store/userStore";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "../../api/user";
import { useAppStore } from "../../store/appStore";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const Protected: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { setLoggedInUser } = useUserStore();
  const { setGettingStartedStep } = useAppStore();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["user"],
    queryFn: getUser, // You can pass the function directly
  });

  // Use `useEffect` to set the logged-in user when data is available
  useEffect(() => {
    if (data) {
      // console.log("hit");
      setLoggedInUser(data); // Set the user in the store only once when the data is available
      if (!data.profile_image) {
        setGettingStartedStep(1);
      } else if (data.interests.length == 0) {
        setGettingStartedStep(2);
      }
      // else if (data.images.length == 0) {
      //   setGettingStartedStep(3);
      // }
    }
  }, [data, setLoggedInUser, setGettingStartedStep]); // Only runs when `data` or `setLoggedInUser` changes

  // If the query is still loading, display a loading message
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If there is an error (e.g., user is not authenticated), redirect to login
  if (error) {
    return <Navigate to="/login" replace />;
  }

  // Handle redirection after setting the step
  if (data && !data.profile_image) {
    console.log("entered here");
    navigate("/getting-started");
  }
  if (data && data.interests.length === 0) {
    navigate("/getting-started");
  }
  // if (data && data.images.length === 0) {
  //   navigate("/getting-started");
  // }

  // Render the protected content if the user data is available
  if (data) {
    return <>{children}</>;
  }

  // Fallback in case no user data is found (can redirect to login)
  return <Navigate to="/login" replace />;
};

export default Protected;
