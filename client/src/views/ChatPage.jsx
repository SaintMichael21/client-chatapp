import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import "regenerator-runtime/runtime";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const ChatPage = ({ url, socket }) => {
  const navigate = useNavigate();

  //voice to text
  const {
    transcript,
    resetTranscript,
    /*
    listening,
    browserSupportsSpeechRecognition,
    */
  } = useSpeechRecognition();

  const [messageSent, setMessageSent] = useState("");
  const [messages, setMessages] = useState([]);
  const [loginUser, setLoginUser] = useState(undefined);
  const [divImage, setDivImage] = useState(false);
  const [file, setFile] = useState(undefined);

  //ini submit message
  function handleSubmit(e) {
    e.preventDefault();
    setDivImage(false);
    if (messageSent) {
      socket.emit("message:new", messageSent);

      const sendMessage = async () => {
        try {
          const message = { message: messageSent };
          const data = await axios.post(`${url}/send-message`, message, {
            headers: { Authorization: `Bearer ${localStorage.access_token}` },
          });
          resetTranscript();
          setFile(undefined);
        } catch (error) {
          console.log(error);
        }
      };
      sendMessage();
    }

    if (file) {
      const sendMessagePicture = async () => {
        try {
          const formData = new FormData();
          formData.append("profilePict", file);
          const { data } = await axios.post(
            `${url}/messages-picture`,
            formData,
            {
              headers: { Authorization: `Bearer ${localStorage.access_token}` },
            }
          );
          const link = data.data;
          socket.emit("message:new", link);
          setFile(undefined);
        } catch (error) {
          console.log(error);
        }
      };
      sendMessagePicture();
    }
  }

  //use effect socket & fetch data
  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const { data } = await axios.get(`${url}/all-messages`, {
          headers: { Authorization: `Bearer ${localStorage.access_token}` },
        });
        setMessages(data);
      } catch (error) {
        console.log(error);
      }
    };

    // fetchAllUser();
    fetchMessage();

    // ngeset auth buat socketnya
    socket.auth = {
      username: localStorage.username,
    };

    // kenapa butuh connect manual? supaya bisa set auth dlu sblm connect
    socket.connect();

    //terima online user
    socket.on("getOnlineUsers", (users) => {
      setLoginUser(users);
    });

    socket.on("message:update", (newMessage) => {
      setMessages((current) => {
        // console.log(current, 101);
        // console.log(newMessage, 102);
        return [...current, newMessage];
      });
    });

    socket.on("message:deleted", () => {
      return fetchMessage();
    });

    //voice recognition
    if (transcript) {
      setMessageSent((current) => {
        return (current += transcript);
      });
      resetTranscript();
    }

    return () => {
      socket.off("message:update");
      socket.off("message:deleted");
      socket.off("getOnlineUsers");
      socket.disconnect();
    };
  }, [transcript]);
  // console.log(loginUser, new Date());
  // console.log(messages);
  //deleteMsg
  const fnDeleteMsg = async (e, id) => {
    try {
      socket.emit("message:delete");
      const data = await axios.delete(`${url}/messages/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.access_token}` },
      });
    } catch (error) {
      console.log(error);
    }
  };

  //tombol logout
  const fnLogOut = (e) => {
    e.preventDefault();
    socket.disconnect();
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      <section className="min-h-dvh flex flex-col md:flex-row md:p-0 p-5">
        <div className="block md:hidden mb-5 justify-end text-end">
          <a
            onClick={fnLogOut}
            className="cursor-pointer p-2 bg-red-400 text-white rounded-md active:bg-red-200 hover:bg-red-300"
          >
            Logout
          </a>
        </div>
        <div className="border border-b-2 border-indigo-400 rounded-3xl flex flex-col w-full md:w-1/4 md:mb-20 mb-5 md:mr-0 md:ml-10 md:mt-10 shadow-2xl">
          <div className="mx-auto border border-solid border-t-0 border-l-0 border-r-0 border-indigo-400 w-full p-2">
            <h1 className="text-slate-500">User - Online</h1>
          </div>
          <div className="flex flex-row  md:grid md:grid-cols-1 p-2 gap-2 overflow-scroll scroll-smooth">
            {loginUser?.map((el, index) => {
              return (
                <div
                  key={index}
                  className="flex flex-row border-2 p-3 rounded-md border-indigo-500 gap-2 hover:border-none hover:bg-indigo-500 hover:text-white duration-100"
                >
                  <div className="my-auto">
                    <h1>{el}</h1>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="border border-indigo-400 rounded-3xl flex flex-col justify-center items-center w-full md:w-2/4 mx-auto md:mb-20 md:mt-10 shadow-2xl overflow-hidden">
          <div className="w-full h-full p-4 md:p-10 flex flex-col gap-2 overflow-scroll">
            {messages.map((el, index) => {
              return (
                <div key={index}>
                  <div
                    className={
                      el.User.username == localStorage.username
                        ? "flex flex-col text-end"
                        : "flex flex-col"
                    }
                  >
                    {/* untuk menampilkan username */}
                    <h1>
                      {el.User.username === localStorage.username
                        ? "You"
                        : el.User.username}
                    </h1>
                    <div
                      className={
                        el.User.username == localStorage.username
                          ? " bg-indigo-100 rounded-lg p-1 px-5 ml-auto flex flex-row"
                          : "bg-slate-100 rounded-lg p-1 px-5 mr-auto"
                      }
                    >
                      {/* ini untuk silang hapus pesan */}
                      {el.User.username == localStorage.username ? (
                        <div>
                          <a
                            onClick={(e) => fnDeleteMsg(e, el.id)}
                            className="text-xs my-auto mr-3 cursor-pointer text-indigo-600/80 hover:text-indigo-300"
                          >
                            X
                          </a>
                        </div>
                      ) : (
                        ""
                      )}
                      {/* cek apakah message ini gambar atau bukan */}
                      {el.image ? (
                        <img src={el.message}></img>
                      ) : (
                        <h1>{el.message}</h1>
                      )}
                    </div>
                    {/* untuk format waktu */}
                    <h1 className="text-slate-400 text-sm">
                      {format(new Date(el.createdAt), "h:mm a")}
                    </h1>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="w-full flex p-2">
            <form
              className="w-full flex flex-row justify-around"
              onSubmit={handleSubmit}
            >
              <div className="md:3/4 lg:w-4/6">
                <input
                  type="text"
                  placeholder="Input Text..."
                  className="p-2 border-2 rounded-2xl border-indigo-400 w-full"
                  onChange={(e) => setMessageSent(e.target.value)}
                  value={messageSent}
                />
              </div>
              <div className="my-auto">
                <button
                  type="button"
                  className="bg-indigo-300 p-1 py-2 lg:py-1 rounded-lg active:bg-indigo-500 text-sm lg:text-lg"
                  onTouchStart={() =>
                    SpeechRecognition.startListening({ continuous: true })
                  }
                  onMouseDown={() =>
                    SpeechRecognition.startListening({ continuous: true })
                  }
                  onTouchEnd={SpeechRecognition.stopListening}
                  onMouseUp={SpeechRecognition.stopListening}
                >
                  Voice
                </button>
              </div>
              <div className="my-auto cursor-pointer">
                <button
                  type="button"
                  onClick={() => {
                    if (divImage) {
                      setFile("");
                      setDivImage(false);
                    } else if (!divImage) {
                      setDivImage(true);
                    }
                  }}
                  className="bg-indigo-300 p-1 py-2 lg:py-1 rounded-lg active:bg-indigo-500 text-sm lg:text-lg"
                >
                  Upload
                </button>
              </div>
              {divImage && (
                <div className="absolute w-3/4 md:w-2/5 h-fit bg-indigo-400 bottom-28 md:bottom-24 z-999 border-solid border-white rounded-3xl p-10">
                  <button
                    type="button"
                    onClick={() => setDivImage(false)}
                    className="text-slate 200 absolute right-5 top-2"
                  >
                    X
                  </button>
                  <div className="flex flex-col text-white">
                    <label htmlFor="upload-image">Upload Image</label>
                    <input
                      type="file"
                      name="upload-image"
                      onChange={(e) => setFile(e.target.files[0])}
                      className="md:w-full"
                    />
                  </div>
                </div>
              )}
              <div className="my-auto">
                <button
                  type="submit"
                  className="bg-indigo-300 p-1 py-2 lg:py-1 rounded-lg active:bg-indigo-500 text-sm lg:text-lg"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="mr-10 mt-10 hidden md:block">
          <a
            onClick={fnLogOut}
            className="cursor-pointer p-2 bg-red-400 text-white rounded-md active:bg-red-200 hover:bg-red-300"
          >
            Logout
          </a>
        </div>
      </section>
    </>
  );
};

export default ChatPage;
