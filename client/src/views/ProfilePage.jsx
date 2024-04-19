import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";

const ProfilePage = ({ url }) => {
  const { profile } = useSelector((state) => state.profile);
  const [file, setFile] = useState({});

  const fnOnSubmit = async (e) => {
    try {
      e.preventDefault();

      const formData = new FormData();

      formData.append("profilePict", file);

      const { data } = await axios.patch(`${url}/edit/profile-pict`, formData, {
        headers: { Authorization: `Bearer ${localStorage.access_token}` },
      });

      refreshPage();
    } catch (error) {
      console.log(error);
    }
  };

  const refreshPage = () => {
    return window.location.reload(false);
  };
  return (
    <>
      <section className="w-full flex flex-col-reverse lg:flex-row lg:mt-10">
        <div className="w-full lg:w-2/3 my-auto h-fit ">
          <div className="rounded-3xl bg-sky-200 p-10 flex flex-col mx-10 align-middle mt-10 mb-10 md:mb-0 lg:mt-20 gap-3">
            <h1 className="text-center text-xl font-bold">Profile</h1>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-sm font-bold text-slate-500"
              >
                Email
              </label>
              <input
                type="text"
                name="email"
                value={profile.email}
                disabled
                className="rounded-lg bg-slate-200 p-2 w-full"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="username"
                className="text-sm font-bold text-slate-500"
              >
                Username
              </label>
              <input
                type="text"
                name="username"
                value={profile.username}
                disabled
                className="rounded-lg bg-slate-200 p-2 w-full"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="username"
                className="text-sm font-bold text-slate-500"
              >
                Join From
              </label>
              <input
                type="text"
                name="createdAt"
                value={profile.createdAt}
                disabled
                className="rounded-lg bg-slate-200 p-2 w-full"
              />
            </div>
            <form
              onSubmit={(e) => fnOnSubmit(e)}
              className="flex flex-col gap-5"
              encType="multipart/form-data"
            >
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="profilePict"
                  className="text-sm font-bold text-slate-500"
                >
                  Update Image
                </label>
                <input
                  type="file"
                  name="profilePict"
                  className="rounded-lg bg-white p-2 w-full"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
              <input
                type="submit"
                value="Update Photo"
                className="cursor-pointer p-2 bg-indigo-700 text-white rounded-2xl"
              />
            </form>
          </div>
        </div>
        <div className="w-full mt-10 lg:w-1/3 flex justify-center align-middle items-center">
          <img
            src={profile.profilePict}
            className="rounded-full h-44 md:h-72 border-solid border-sky-400"
          />
        </div>
      </section>
    </>
  );
};

export default ProfilePage;
