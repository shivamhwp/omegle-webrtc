import { useSearch } from "@tanstack/react-router";
import { useEffect } from "react";
export function Room() {
  const name = useSearch({ from: "/room" });
  //   console.log(name);

  useEffect(() => {
    //logiv for init user in the room
  }, [name]);
  return (
    <div className=" w-screen h-screen  flex flex-col items-center justify-center gap-8">
      <div className=" text-xl">hi</div>
      <div className="flex gap-2">
        <button className="p-2 border-2 border-black rounded-full bg-black text-white px-10">
          Start
        </button>
        <button className="p-2 border-2 border-black rounded-full  bg-black text-white px-10">
          Stop
        </button>
      </div>
    </div>
  );
}
