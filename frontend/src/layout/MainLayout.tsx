import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const MainLayout = () => {
  return (
    <>
      <div className="container">
        <Navbar />
        <div className="body">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default MainLayout;
