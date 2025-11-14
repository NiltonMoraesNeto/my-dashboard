import {
  RouterProvider,
  Outlet,
  createRoute,
  createRootRouteWithContext,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { AuthenticatedLayout } from "./components/authenticated-layout";
import { LoginPage } from "./components/login-page";
import { useAuth } from "./contexts/auth-context";
import type { AuthContextType } from "./model/auth-context-model";
import { Dashboard } from "./pages/Dashboard/dashboard";
import { HomePage } from "./pages/Home/home";
import { NotFoundPage } from "./pages/NotFound/not-found";
import { Profile } from "./pages/Profile/profile";
import { User } from "./pages/User/user";
import { UserEdit } from "./pages/User/user-edit";
import { UserNew } from "./pages/User/user-new";

type RouterContext = {
  auth: AuthContextType;
};

const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: () => <Outlet />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: "/dashboard" });
    }
    throw redirect({ to: "/login" });
  },
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: "/dashboard" });
    }
  },
});

const authenticatedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "authenticated",
  component: AuthenticatedLayout,
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
});

const homeRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "home",
  component: HomePage,
});

const profileRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "profile",
  component: Profile,
});

const dashboardRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "dashboard",
  component: Dashboard,
});

const userRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "user",
  component: User,
});

const userNewRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "user/new",
  component: UserNew,
});

const userEditRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "user/$id/edit",
  component: UserEdit,
});

const authenticatedNotFoundRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "*",
  component: NotFoundPage,
});

const publicNotFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "*",
  component: NotFoundPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  publicNotFoundRoute,
  authenticatedRoute.addChildren([
    homeRoute,
    profileRoute,
    dashboardRoute,
    userRoute,
    userNewRoute,
    userEditRoute,
    authenticatedNotFoundRoute,
  ]),
]);

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  context: {
    auth: undefined!,
  },
  defaultNotFoundComponent: NotFoundPage,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export function AppRouter() {
  const auth = useAuth();
  return <RouterProvider router={router} context={{ auth }} />;
}
