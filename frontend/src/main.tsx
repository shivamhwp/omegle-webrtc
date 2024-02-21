import ReactDOM from "react-dom/client";
import "./index.css";
import router from "./App.tsx";
import { RouterProvider } from "@tanstack/react-router";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
