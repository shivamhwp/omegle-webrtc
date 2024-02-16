import { useState } from "react";
import { Link } from "@tanstack/react-router";

export function Landing() {
  const [name, setName] = useState("");

  return (
    <div className="p-2 flex felx-col h-screeen w-screen items-center justify-center gap-4">
      <input
        type="text"
        className="border-2 border-black rounded-lg p-2 text-black px-10"
        id="name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <Link
        to={`/room?name=${name}`}
        className="p-2 border-2 border-black rounded-full fill-black bg-black text-white px-10"
      >
        Join
      </Link>
    </div>
  );
}
