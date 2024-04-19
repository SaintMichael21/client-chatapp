import GambarSamping from "../assets/Gambar.png";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setEmail, setPassword } from "../features/user/user-slice";

const LoginPage = ({ url, socket }) => {
  const navigate = useNavigate();
  const { email, password } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const googleLogin = async (codeResponse) => {
    try {
      const { data } = await axios.post(`${url}/google-login`, null, {
        headers: { Authorization: codeResponse.credential },
      });
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("username", data.username);
      refreshPage();
      navigate("/chat-page");
    } catch (error) {
      console.log(error);
    }
  };

  const fnOnSubmit = async (e) => {
    try {
      e.preventDefault();
      const dataLogin = {
        email,
        password,
      };

      const { data } = await axios.post(`${url}/login`, dataLogin);

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("username", data.username);
      refreshPage();
      navigate("/chat-page");
    } catch (error) {
      console.log(error);
    }
  };

  //socket dan github
  useEffect(() => {
    //github
    handleGitHubCallback();
  }, []);

  //github
  const GITHUB_CLIENT_ID = "3a18904ef17316403cad";
  const githubOAuthURL = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=user`;

  const handleGitHubCallback = async () => {
    try {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const code = urlParams.get("code");
      if (code) {
        const data = {
          code,
        };
        const result = await axios.post(`${url}/github-login`, data);

        localStorage.setItem("access_token", result.data.access_token);
        localStorage.setItem("username", result.data.username);
        navigate("/chat-page");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const refreshPage = () => {
    return window.location.reload(false);
  };

  return (
    <>
      <section>
        <div className="text-white flex flex-row w-full min-h-dvh">
          <div className="w-1/2 md:w-0 lg:w-1/2 md:flex flex-col align-middle items-center lg:bg-slate-700 hidden">
            <img
              src={GambarSamping}
              alt="asd"
              className="p-2 my-auto lg:h-fit hidden lg:flex"
            />
          </div>
          <div className="w-full lg:w-1/2  flex flex-col items-center">
            <div className="p-6 bg-slate-700 md:w-3/5 h-fit my-auto rounded-3xl">
              <h1 className="text-2xl">Login Page</h1>
              <h3 className="text-sm text-slate-300">Welcome to our forum!</h3>

              <div className="my-5">
                <form className=" flex flex-col gap-2" onSubmit={fnOnSubmit}>
                  <input
                    type="text"
                    placeholder="Email"
                    autoComplete="off"
                    className="p-2 w-full rounded-lg text-black"
                    value={email}
                    onChange={(e) => dispatch(setEmail(e.target.value))}
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    autoComplete="off"
                    className="p-2 w-full rounded-lg text-black"
                    value={password}
                    onChange={(e) => dispatch(setPassword(e.target.value))}
                  />
                  <input
                    type="submit"
                    value="Login"
                    className="p-2 w-full rounded-3xl bg-white text-black mt-10"
                  />
                  <h3 className="text-center">
                    Don't have an account?{" "}
                    <a href="/register" className="text-sky-300">
                      Register Now
                    </a>
                  </h3>
                  <div className="flex flex-col gap-3 w-full p-2 items-center text-center">
                    <div className="">
                      <GoogleLogin onSuccess={googleLogin} />
                    </div>
                    <div className="my-auto w-full">
                      <a
                        href={githubOAuthURL}
                        className="text-xs bg-white px-10 text-black p-2 rounded-md md:px-10 py-3 hover:text-white hover:bg-slate-500"
                      >
                        Login dengan Github
                      </a>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LoginPage;
