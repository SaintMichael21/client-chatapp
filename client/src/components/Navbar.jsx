import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchProfile } from "../features/profile/profile-slice";

const Navbar = () => {
  const { profile } = useSelector((state) => state.profile);
  // const [profile, setProfile] = useState({});
  // const {profile, isLoading, errorMsg } = useSelector((state)=> state.profile)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //fetch
  useEffect(() => {
    dispatch(fetchProfile());
  }, []);

  return (
    <>
      <section className="w-full">
        <div className="flex flex-row justify-between p-2 bg-indigo-200 px-10">
          <div>
            <a
              onClick={(e) => {
                navigate("/chat-page");
              }}
            >
              <h1 className="font-bold text-sky-800 text-3xl cursor-pointer">
                Chat <span className="text-sky-600">App</span>
              </h1>
            </a>
          </div>
          <a
            onClick={(e) => {
              navigate("/profile-page");
            }}
          >
            <div className="my-auto flex flex-row gap-3">
              <div className="h-10">
                <img
                  src={profile.profilePict}
                  alt="Foto"
                  className="h-full w-full rounded-full"
                />
              </div>
              <h1 className="my-auto">{profile.username}</h1>
            </div>
          </a>
        </div>
      </section>
    </>
  );
};

export default Navbar;
