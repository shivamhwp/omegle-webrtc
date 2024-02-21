import { useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
export function Room() {
  const name = useSearch({ from: "/room" });
  const [socket, setSocket] = useState<null | Socket>(null);
  const URL = "http://localhost:3000";
  const [lobby, setLobby] = useState(true);
  const [lobby, setLobby] = useState(true);
  const [socket, setSocket] = useState<null | Socket>(null);
  const [sendingPc, setSendingPc] = useState<null | RTCPeerConnection>(null);
  const [receivingPc, setReceivingPc] = useState<null | RTCPeerConnection>(
    null
  );
  const [remoteVideoTrack, setRemoteVideoTrack] =
    useState<MediaStreamTrack | null>(null);
  const [localVideoTracck, setlocalVideoTracck] = useState<
    MediaStreamTrack,
    null
  >(null);
  const [remoteAudioTrack, setRemoteAudioTrack] =
    useState<MediaStreamTrack | null>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<
    MediaStreamTrack,
    null
  >(null);

  useEffect(() => {
    const socket = io(URL);
    socket.on("send-offer", async ({ roomId }) => {
      setLobby(false);
      const pc = new RTCPeerConnection();
      setSendingPc(pc);

      const sdp = await pc.createOffer();
      socket.emit("offer", {
        sdp,
        roomId,
      });
    });

    socket.on("offer", async ({ roomId, offer }) => {
      setLobby(false);
      const pc = new RTCPeerConnection();
      pc.setRemoteDescription({ sdp: offer, type: "offer" });
      const sdp = await pc.createAnswer();
      // trickle ice
      setReceivingPc(pc);
      pc.ontrack = ({ track, type }) => {
        if (type == "audio") {
          setRemoteAudioTrack(track);
        } else {
          setRemoteVideoTrack(track);
        }
      };
      socket.emit("answer", {
        roomId,
        sdp: sdp,
      });
    });

    socket.on("answer", ({ roomId, answer }) => {
      setLobby(false);
      setSendingPc((pc) => {
        pc?.setRemoteDescription({
          type: "answer",
          sdp: answer,
        });
        return pc;
      });
    });

    socket.on("lobby", () => {
      setLobby(true);
    });

    setSocket(socket);
  }, [name]);
  if (lobby) {
    return (
      <div className="flex items-center justify-center w-screen h-screen text-2xl">
        waiting to connect you to someone
      </div>
    );
  }

  return (
    <div className=" w-screen h-screen  flex flex-col items-center justify-center gap-8">
      <div className=" text-xl">hi </div>

      <div className="gap-4 flex items-center justify-center">
        <video
          width={800}
          height={450}
          className="border-2 border-black rounded-lg"
        ></video>
        <video
          width={800}
          height={450}
          className="border-2 border-black  rounded-e-lg"
        ></video>
      </div>
    </div>
  );
}
