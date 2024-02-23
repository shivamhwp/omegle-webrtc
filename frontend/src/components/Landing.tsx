import { useRef, useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Room } from "./Room";

export function Landing() {
  const [name, setName] = useState("");
  const [localVideoTracck, setlocalVideoTracck] =
    useState<MediaStreamTrack | null>(null);
  const [localAudioTrack, setLocalAudioTrack] =
    useState<MediaStreamTrack | null>(null);

  const [joined, setJoined] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const getCam = async () => {
    const stream = await window.navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    const audioTrack = stream.getAudioTracks()[0];
    const videoTrack = stream.getVideoTracks()[0];

    setLocalAudioTrack(audioTrack);
    setlocalVideoTracck(videoTrack);
    if (!videoRef.current) {
      return;
    }

    videoRef.current.srcObject = new MediaStream([videoTrack]);
    videoRef.current.play();
  };

  useEffect(() => {
    if (videoRef && videoRef.current) {
      getCam();
    }
  }, [videoRef]);

  if (!joined) {
    return (
      <div className=" h-screen w-screen fixed p-2 flex  max-sm:flex-col max-md:flex-col  max-lg:flex-col items-center  bg-zinc-100  justify-around lg:gap-4 xl:gap-4 ">
        <div className=" flex items-center justify-center 2xl:lg:w-3/5  lg:w-3/5 w-full xl:w-3/5 h-full">
          <video
            width={800}
            height={450}
            autoPlay
            ref={videoRef}
            className=" border-8 border-[#C1C1C1] rounded-lg transform scale-x-[-1]"
          ></video>
        </div>

        <div className=" w-2/5 h-full gap-4 flex flex-col items-center justify-center ">
          <div className="text-3xl font-medium"> Enter name</div>
          <input
            type="text"
            className="border-2 border-[#0F0F0F] rounded-md p-2 text-black px-10 w-96 "
            id="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <Link
            to={`/room?name=${name}`}
            className="p-2 border-2 rounded-md  w-96  bg-[#0F0F0F] text-white px-10"
          >
            <button
              className="w-full items-center justify-center  text-lg flex"
              onClick={() => {
                setJoined(true);
              }}
            >
              Join
            </button>
          </Link>
        </div>
      </div>
    );
  }
  return (
    <Room
      name={name}
      localAudioTrack={localAudioTrack}
      localVideoTrack={localVideoTracck}
    />
  );
}
