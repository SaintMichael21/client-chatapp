import GambarSamping from "../assets/Gambar.png";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setEmail,
  setPassword,
  setUsername,
} from "../features/user/user-slice";

const RegisterPage = ({ url, socket }) => {
  const { email, password, username } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  /*
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [username, setUsername] = useState("");

  // console.log(email, password, username);
  */

  const fnOnSubmit = async (e) => {
    try {
      e.preventDefault();
      const dataRegis = {
        email,
        password,
        username,
      };

      await axios.post(`${url}/register`, dataRegis);

      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  /*
  useEffect(() => {
    console.log(email);
    console.log(password);
    console.log(username);
  });
  */

  return (
    <>
      <section>
        <div className="text-white flex flex-row w-full min-h-dvh">
          <div className="w-1/2 md:w-0 lg:w-1/2 md:flex flex-col align-middle items-center lg:bg-slate-700 hidden">
            <img src={GambarSamping} alt="asd" className="p-2 my-auto" />
          </div>
          <div className="w-full lg:w-1/2 flex flex-col items-center">
            <div className="p-6 bg-slate-700 md:w-3/5 h-fit my-auto rounded-3xl">
              <h1 className="text-2xl">Register Page</h1>
              <h3 className="text-sm text-slate-300">
                Get ready for the forum!
              </h3>

              <div className="my-5">
                <form className=" flex flex-col gap-2" onSubmit={fnOnSubmit}>
                  <input
                    type="text"
                    placeholder="Email"
                    autoComplete="off"
                    className="p-2 w-full rounded-lg text-black"
                    onChange={(e) => dispatch(setEmail(e.target.value))}
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    autoComplete="off"
                    className="p-2 w-full rounded-lg text-black"
                    onChange={(e) => dispatch(setPassword(e.target.value))}
                  />
                  <input
                    type="username"
                    placeholder="Username"
                    autoComplete="off"
                    className="p-2 w-full rounded-lg text-black"
                    onChange={(e) => dispatch(setUsername(e.target.value))}
                  />
                  <input
                    type="submit"
                    value="Register"
                    className="p-2 w-full rounded-3xl bg-white text-black mt-10"
                  />
                  <h3 className="text-center">
                    Have an account?{" "}
                    <a href="/login" className="text-sky-300">
                      Login Now
                    </a>
                  </h3>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default RegisterPage;
