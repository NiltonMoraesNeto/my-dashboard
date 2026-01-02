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
import { HomeCondominio } from "./pages/Condominio/Home/home-condominio";
import { Unidades } from "./pages/Condominio/Unidades/unidades";
import { UnidadeNew } from "./pages/Condominio/Unidades/unidade-new";
import { UnidadeEdit } from "./pages/Condominio/Unidades/unidade-edit";
import { ContasPagar } from "./pages/Condominio/ContasPagar/contas-pagar";
import { Balancete } from "./pages/Condominio/Balancete/balancete";
import { Boletos } from "./pages/Condominio/Boletos/boletos";
import { Reunioes } from "./pages/Condominio/Reunioes/reunioes";
import { ReuniaoNew } from "./pages/Condominio/Reunioes/reuniao-new";
import { ReuniaoEdit } from "./pages/Condominio/Reunioes/reuniao-edit";
import { Avisos } from "./pages/Condominio/Avisos/avisos";
import { AvisoNew } from "./pages/Condominio/Avisos/aviso-new";
import { AvisoEdit } from "./pages/Condominio/Avisos/aviso-edit";
import { BoletoNew } from "./pages/Condominio/Boletos/boleto-new";
import { BoletoEdit } from "./pages/Condominio/Boletos/boleto-edit";
import { BoletosMorador } from "./pages/Boletos/boletos";
import { Moradores } from "./pages/Condominio/Moradores/moradores";
import { MoradorNew } from "./pages/Condominio/Moradores/morador-new";
import { MoradorEdit } from "./pages/Condominio/Moradores/morador-edit";

type RouterContext = {
  auth: AuthContextType;
};

const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: () => <Outlet />,
});

const getRedirectPath = (profileUser?: string) => {
  const isCondominioProfile = profileUser?.toLowerCase() === "condomínio" || profileUser?.toLowerCase() === "condominio";
  return isCondominioProfile ? "/condominio/home" : "/dashboard";
};

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: getRedirectPath(context.auth.profileUser) });
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
      throw redirect({ to: getRedirectPath(context.auth.profileUser) });
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

// Rotas do Condomínio
const condominioHomeRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "condominio/home",
  component: HomeCondominio,
});

const unidadesRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "condominio/unidades",
  component: Unidades,
});

const unidadeNewRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "condominio/unidades/new",
  component: UnidadeNew,
});

const unidadeEditRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "condominio/unidades/$id/edit",
  component: UnidadeEdit,
});

const contasPagarRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "condominio/contas-pagar",
  component: ContasPagar,
});

const balanceteRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "condominio/balancete",
  component: Balancete,
});

const boletosRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "condominio/boletos",
  component: Boletos,
});

const boletoNewRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "condominio/boletos/new",
  component: BoletoNew,
});

const boletoEditRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "condominio/boletos/$id/edit",
  component: BoletoEdit,
});

const boletosMoradorRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "boletos",
  component: BoletosMorador,
});

const reunioesRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "condominio/reunioes",
  component: Reunioes,
});

const reuniaoNewRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "condominio/reunioes/new",
  component: ReuniaoNew,
});

const reuniaoEditRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "condominio/reunioes/$id/edit",
  component: ReuniaoEdit,
});

const avisosRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "condominio/avisos",
  component: Avisos,
});

const avisoNewRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "condominio/avisos/new",
  component: AvisoNew,
});

const avisoEditRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "condominio/avisos/$id/edit",
  component: AvisoEdit,
});

const moradoresRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "condominio/moradores",
  component: Moradores,
});

const moradorNewRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "condominio/moradores/new",
  component: MoradorNew,
});

const moradorEditRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "condominio/moradores/$id/edit",
  component: MoradorEdit,
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
    condominioHomeRoute,
    unidadesRoute,
    unidadeNewRoute,
    unidadeEditRoute,
    contasPagarRoute,
    balanceteRoute,
    boletosRoute,
    boletoNewRoute,
    boletoEditRoute,
    boletosMoradorRoute,
    reunioesRoute,
    reuniaoNewRoute,
    reuniaoEditRoute,
    avisosRoute,
    avisoNewRoute,
    avisoEditRoute,
    moradoresRoute,
    moradorNewRoute,
    moradorEditRoute,
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
