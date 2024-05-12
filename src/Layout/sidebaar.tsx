import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import logo from "../../public/logo-dropbox.svg";
import logout from "../../public/logout.svg";
import profile from "../../public/profile.svg";
import { auth, usersCollection } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

const IndexLayout: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId("");
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        try {
          const userDocRef = doc(usersCollection, userId);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUsername(userData.username);
          }
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchData();
  }, [userId]);

  const handleLogout = () => {
    auth.signOut();
    navigate("/login");
  };
  return (
    <div className="flex">
      <div className="flex flex-col w-64 h-screen px-4 py-8 overflow-y-auto bg-black">
        <Link to="/" className="flex">
          <img className="w-10" src={logo} alt="" />
          <h1 className="text-white font-bold text-2xl ml-2 justify-center">
            Dropbox
          </h1>
        </Link>

        <div className="flex flex-col justify-between flex-1 mt-8">
          <nav>
            <Link
              to={"/"}
              className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-md dark:bg-gray-800 dark:text-gray-200"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span className="mx-4 font-medium">Home</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex w-full items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-md dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
            >
              <img src={logout} alt="" />
              <span className="mx-4 font-medium">Log out</span>
            </button>
          </nav>
          <Link to={"/profile"} className="flex items-center px-4 -mx-2">
            <img src={profile} alt="profile" />
            <span className="mx-2 font-medium text-gray-800 dark:text-gray-200">
              {username || "User"}
            </span>
          </Link>
        </div>
      </div>
      <div className="w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default IndexLayout;
