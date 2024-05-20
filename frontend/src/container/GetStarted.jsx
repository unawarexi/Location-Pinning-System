import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { registerUser, loginUser } from "../apis/UserCRUD";

const AUTH_MAP_API = import.meta.env.VITE_AUTH_MAP_API;

const GetStarted = () => {
  //-------------------------- handles Auth forms state
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  //-------------------------- handles location state
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    //  user's location using  Geolocation API
    const fetchLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            console.error("Error fetching location:", error);
            // return to IP-based geolocation if user rejects permission request
            fetchIpLocation();
          }
        );
      } else {
        // use this if Geolocation API is not supported
        fetchIpLocation();
      }
    };

    //-------------------------- handles fetching of ip location
    const fetchIpLocation = async () => {
      try {
        const response = await fetch(AUTH_MAP_API);
        const data = await response.json();
        setLocation({ lat: data.latitude, lng: data.longitude });
      } catch (error) {
        console.error("Error fetching IP location:", error);
      }
    };

    fetchLocation();
  }, []);

  //-------------------------- handles form button toggle and retain data onchange
  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  //-------------------------- handles login anf navigation submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const response = await loginUser(formData);
        // console.log("User logged in:", response);
      } else {
        const response = await registerUser(formData);
        // console.log("User registered:", response);
      }
      setFormData({
        email: "",
        password: "",
      });
      login();
      navigate("/home");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <section className="text-gray-600 body-font relative">
      {/* {============================ handles background map with user location =========================} */}
      <div className="absolute inset-0 bg-gray-300 rounded-lg">
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          marginHeight="0"
          marginWidth="0"
          title="map"
          scrolling="no"
          src={`https://maps.google.com/maps?width=100%&height=600&hl=en&q=${location.lat},${location.lng}&ie=UTF8&t=&z=14&iwloc=B&output=embed`}
          style={{ filter: "grayscale(1) contrast(1.2) opacity(0.4)" }}
        ></iframe>
      </div>
      <div className="container px-5 py-24 mx-auto flex">
        <div className="lg:w-1/3 md:w-1/2 bg-white rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 relative z-10 shadow-md">
          <h2 className="text-gray-900 text-lg mb-1 font-medium title-font">
            {isLogin ? "Login" : "Sign Up"}
          </h2>
          <p className="leading-relaxed mb-5 text-gray-600">
            Verify securely- then go get 'em before someone does!
          </p>

          {/* {============================ handles Auth forms register and login =========================} */}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="relative mb-4">
              <label
                htmlFor="email"
                className="leading-7 text-sm text-gray-600"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none
                 text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                required
              />
            </div>

            {/* Password */}
            <div className="relative mb-4">
              <label
                htmlFor="password"
                className="leading-7 text-sm text-gray-600"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700
                 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                required
              />
            </div>

            {/* {============================ handles form button  =========================} */}
            <button
              type="submit"
              className={`text-white border-0 py-2 px-6 focus:outline-none w-full rounded text-lg ${
                isLogin
                  ? " bg-gray-500 hover:bg-gray-600 "
                  : "bg-indigo-500 hover:bg-indigo-600"
              }`}
            >
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </form>

          {/* ================================ Toggle between login and sign-up ============================*/}
          <p className="text-xs text-gray-500 mt-3">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <span
              className="text-indigo-500 cursor-pointer"
              onClick={toggleForm}
            >
              {isLogin ? "Sign up here" : "Login here"}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default GetStarted;
