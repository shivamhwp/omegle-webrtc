import {
  Outlet,
  Link,
  createRouter,
  createRoute,
  createRootRoute,
} from "@tanstack/react-router";
import { Landing } from "./components/Landing";
import { Room } from "./components/Room";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>
        <Link to="/room" className="[&.active]:font-bold">
          Room
        </Link>
      </div>
      <hr />
      <Outlet />
    </>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Landing,
});

const roomRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/room",
  component: Room,
});

const routeTree = rootRoute.addChildren([indexRoute, roomRoute]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default router;
