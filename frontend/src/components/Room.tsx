// import { useSearch } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";
export const Room = ({
  name,
  localAudioTrack,
  localVideoTrack,
}: {
  name: string;
  localAudioTrack: MediaStreamTrack | null;
  localVideoTrack: MediaStreamTrack | null;
}) => {
  // const name = useSearch({ from: "/room" });
  const URL = "http://localhost:3000";
  const [lobby, setLobby] = useState(true);
  const [socket, setSocket] = useState<null | Socket>(null);
  const [sendingPc, setSendingPc] = useState<null | RTCPeerConnection>(null);
  const [receivingPc, setReceivingPc] = useState<null | RTCPeerConnection>(
    null
  );
  const [remoteVideoTrack, setRemoteVideoTrack] =
    useState<null | MediaStreamTrack>(null);
  const [remoteAudioTrack, setRemoteAudioTrack] =
    useState<null | MediaStreamTrack>(null);

  const [remoteMediaStream, setRemoteMediaStream] =
    useState<MediaStream | null>();
  const remoteVideoRef = useRef<HTMLVideoElement>();
  const localVideoRef = useRef<HTMLVideoElement>();

  useEffect(() => {
    const socket = io(URL);
    socket.on("send-offer", async ({ roomId }) => {
      console.log("sending-offer");
      setLobby(false);
      const pc = new RTCPeerConnection();
      setSendingPc(pc);
      if (localVideoTrack) {
        pc.addTrack(localVideoTrack);
      }
      if (localAudioTrack) {
        pc.addTrack(localAudioTrack);
      }

      pc.onicecandidate = async (e) => {
        console.log("recieveing ice candidate locally ");
        if (e.candidate) {
          socket.emit("add-ice-candidate", {
            candidate: e.candidate,
            type: "sender",
            roomId,
          });
        }
      };
      pc.onnegotiationneeded = async () => {
        console.log("on negotiation needed, sending offer");
        const sdp = await pc.createOffer();
        pc.setLocalDescription(sdp);
        socket.emit("offer", {
          sdp,
          roomId,
        });
      };
    });

    socket.on("offer", async ({ roomId, sdp: remoteSdp }) => {
      setLobby(false);
      console.log(" recieved offer");
      const pc = new RTCPeerConnection();
      pc?.setRemoteDescription(remoteSdp);
      const sdp = await pc.createAnswer();
      pc.setLocalDescription(sdp);
      const stream = new MediaStream();
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
      }
      setRemoteMediaStream(stream);

      // trickle ice
      setReceivingPc(pc);

      pc.ontrack = (e) => {
        //   const { track, type } = e;
        //   if (type == "audio") {
        //     // setRemoteAudioTrack(track);
        //     // @ts-ignore
        //     remoteVideoRef.current?.srcObject.addTrack(track);
        //   } else {
        //     // setRemoteVideoTrack(track);
        //     // @ts-ignore
        //     remoteVideoRef.current?.srcObject.addTrack(track);
        //   }
        // //@ts-ignore
        //   remoteVideoRef.current?.play();
      };

      pc.onicecandidate = async (e) => {
        if (!e.candidate) {
          return;
        }
        if (e.candidate) {
          socket.emit("add-ice-candidate", {
            candidate: e.candidate,
            type: "reciever",
            roomId,
          });

          socket.emit("answer", {
            roomId,
            sdp: sdp,
          });
          setTimeout(() => {
            const track1 = pc.getTransceivers()[0].receiver.track;
            const track2 = pc.getTransceivers()[1].receiver.track;
            if (track1.kind == "video") {
              setRemoteAudioTrack(track2);
              setRemoteVideoTrack(track1);
            } else {
              setRemoteAudioTrack(track1);
              setRemoteVideoTrack(track2);
              // setRemoteVideoTrack(track);
            }
            // @ts-ignore
            remoteVideoRef.current?.srcObject.addTrack(track1);
            // @ts-ignore
            remoteVideoRef.current?.srcObject.addTrack(track2);
            //@ts-ignore
            remoteVideoRef.current.play();
            // };
          }, 2000);
        }
      };
    });

    socket.on("answer", ({ roomId, sdp: remoteSdp }) => {
      setLobby(false);
      setSendingPc((pc) => {
        pc?.setRemoteDescription(remoteSdp);
        return pc;
      });
      console.log("loop closed");
    });

    socket.on("lobby", () => {
      setLobby(true);
    });

    socket.on("add-ice-candidate", ({ candidate, type }) => {
      console.log("add ice candidate form remote side");
      console.log({ candidate, type });

      if (type == "sender") {
        setReceivingPc((pc) => {
          pc?.addIceCandidate(candidate);
          return pc;
        });
      } else {
        setSendingPc((pc) => {
          pc?.addIceCandidate(candidate);
          return pc;
        });
      }
    });

    setSocket(socket);
  }, [name]);

  useEffect(() => {
    if (localVideoRef.current) {
      if (localVideoTrack) {
        localVideoRef.current.srcObject = new MediaStream([localVideoTrack]);
        localVideoRef.current.play();
      }
    }
  }, [localVideoRef]);

  return (
    <div className="flex h-screen w-screen items-center  justify-evenly bg-zinc-100  p-2 max-lg:flex-col  max-md:flex-col  max-sm:flex-col lg:gap-4 xl:gap-4">
      <div className="flex items-center justify-center gap-4">
        <video
          autoPlay
          width={800}
          height={450}
          ref={localVideoRef}
          className="scale-x-[-1] transform rounded-lg border-8 border-[#C1C1C1]"
        />
      </div>
      {lobby ? "waiting for someone to join" : null}
      <div className="className=gap-4 flex items-center justify-center">
        <video
          autoPlay
          ref={remoteVideoRef}
          width={800}
          height={450}
          className="scale-x-[-1] transform rounded-lg border-8 border-[#C1C1C1]"
        />
      </div>
    </div>
  );
};
