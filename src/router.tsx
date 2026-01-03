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
import { MovimentacaoNew } from "./pages/Condominio/Balancete/movimentacao-new";
import { MovimentacaoEdit } from "./pages/Condominio/Balancete/movimentacao-edit";
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
  const isCondominioProfile =
    profileUser?.toLowerCase() === "condomínio" ||
    profileUser?.toLowerCase() === "condominio";
  const isMoradorProfile = profileUser?.toLowerCase() === "morador";

  if (isCondominioProfile) {
    return "/condominio/home";
  }
  if (isMoradorProfile) {
    return "/home";
  }
  return "/dashboard";
};

const isCondominioProfile = (profileUser?: string) => {
  return (
    profileUser?.toLowerCase() === "condomínio" ||
    profileUser?.toLowerCase() === "condominio"
  );
};

const isMoradorProfile = (profileUser?: string) => {
  return profileUser?.toLowerCase() === "morador";
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
  beforeLoad: ({ context }) => {
    const profile = context.auth.profileUser;
    if (isMoradorProfile(profile) || isCondominioProfile(profile)) {
      throw redirect({ to: getRedirectPath(profile) });
    }
  },
});

const dashboardRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "dashboard",
  component: Dashboard,
  beforeLoad: ({ context }) => {
    const profile = context.auth.profileUser;
    if (isMoradorProfile(profile) || isCondominioProfile(profile)) {
      throw redirect({ to: getRedirectPath(profile) });
    }
  },
});

const userRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "user",
  component: User,
  beforeLoad: ({ context }) => {
    const profile = context.auth.profileUser;
    if (isMoradorProfile(profile) || isCondominioProfile(profile)) {
      throw redirect({ to: getRedirectPath(profile) });
    }
  },
});

const userNewRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "user/new",
  component: UserNew,
  beforeLoad: ({ context }) => {
    const profile = context.auth.profileUser;
    if (isMoradorProfile(profile) || isCondominioProfile(profile)) {
      throw redirect({ to: getRedirectPath(profile) });
    }
  },
});

const userEditRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "user/$id/edit",
  component: UserEdit,
  beforeLoad: ({ context }) => {
    const profile = context.auth.profileUser;
    if (isMoradorProfile(profile) || isCondominioProfile(profile)) {
      throw redirect({ to: getRedirectPath(profile) });
    }
  },
});

// Rotas do Condomínio
const condominioHomeRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "condominio/home",
  component: HomeCondominio,
  beforeLoad: ({ context }) => {
    const profile = context.auth.profileUser;
    if (!isCondominioProfile(profile)) {
      throw redirect({ to: getRedirectPath(profile) });
    }
  },
});

const unidadesRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "condominio/unidades",
  component: Unidades,
  beforeLoad: ({ context }) => {
    const profile = context.auth.profileUser;
    if (!isCondominioProfile(profile)) {
      throw redirect({ to: getRedirectPath(profile) });
    }
  },
});

const unidadeNewRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "condominio/unidades/new",
  component: UnidadeNew,
  beforeLoad: ({ context }) => {
    const profile = context.auth.profileUser;
    if (!isCondominioProfile(profile)) {
      throw redirect({ to: getRedirectPath(profile) });
    }
  },
});

const unidadeEditRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "condominio/unidades/$id/edit",
  component: UnidadeEdit,
  beforeLoad: ({ context }) => {
    const profile = context.auth.profileUser;
    if (!isCondominioProfile(profile)) {
      throw redirect({ to: getRedirectPath(profile) });
    }
  },
});

const contasPagarRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "condominio/contas-pagar",
  component: ContasPagar,
  beforeLoad: ({ context }) => {
    const profile = context.auth.profileUser;
    if (!isCondominioProfile(profile)) {
      throw redirect({ to: getRedirectPath(profile) });
    }
  },
});

const balanceteRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "condominio/balancete",
  component: Balancete,
  beforeLoad: ({ context }) => {
    const profile = context.auth.profileUser;
    if (!isCondominioProfile(profile)) {
      throw redirect({ to: getRedirectPath(profile) });
    }
  },
});

const movimentacaoNewRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "condominio/balancete/movimentacoes/new",
  component: MovimentacaoNew,
  beforeLoad: ({ context }) => {
    const profile = context.auth.profileUser;
    if (!isCondominioProfile(profile)) {
      throw redirect({ to: getRedirectPath(profile) });
    }
  },
});

const movimentacaoEditRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "condominio/balancete/movimentacoes/$id/edit",
  component: MovimentacaoEdit,
  beforeLoad: ({ context }) => {
    const profile = context.auth.profileUser;
    if (!isCondominioProfile(profile)) {
      throw redirect({ to: getRedirectPath(profile) });
    }
  },
});

const boletosRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "condominio/boletos",
  component: Boletos,
  beforeLoad: ({ context }) => {
    const profile = context.auth.profileUser;
    if (!isCondominioProfile(profile)) {
      throw redirect({ to: getRedirectPath(profile) });
    }
  },
});

const boletoNewRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "condominio/boletos/new",
  component: BoletoNew,
  beforeLoad: ({ context }) => {
    const profile = context.auth.profileUser;
    if (!isCondominioProfile(profile)) {
      throw redirect({ to: getRedirectPath(profile) });
    }
  },
});

const boletoEditRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "condominio/boletos/$id/edit",
  component: BoletoEdit,
  beforeLoad: ({ context }) => {
    const profile = context.auth.profileUser;
    if (!isCondominioProfile(profile)) {
      throw redirect({ to: getRedirectPath(profile) });
    }
  },
});

const boletosMoradorRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "boletos",
  component: BoletosMorador,
  beforeLoad: ({ context }) => {
    const profile = context.auth.profileUser;
    if (!isMoradorProfile(profile)) {
      throw redirect({ to: getRedirectPath(profile) });
    }
  },
});

const reunioesRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "condominio/reunioes",
  component: Reunioes,
  beforeLoad: ({ context }) => {
    const profile = context.auth.profileUser;
    if (!isCondominioProfile(profile)) {
      throw redirect({ to: getRedirectPath(profile) });
    }
  },
});

const reuniaoNewRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "condominio/reunioes/new",
  component: ReuniaoNew,
  beforeLoad: ({ context }) => {
    const profile = context.auth.profileUser;
    if (!isCondominioProfile(profile)) {
      throw redirect({ to: getRedirectPath(profile) });
    }
  },
});

const reuniaoEditRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "condominio/reunioes/$id/edit",
  component: ReuniaoEdit,
  beforeLoad: ({ context }) => {
    const profile = context.auth.profileUser;
    if (!isCondominioProfile(profile)) {
      throw redirect({ to: getRedirectPath(profile) });
    }
  },
});

const avisosRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "condominio/avisos",
  component: Avisos,
  beforeLoad: ({ context }) => {
    const profile = context.auth.profileUser;
    if (!isCondominioProfile(profile)) {
      throw redirect({ to: getRedirectPath(profile) });
    }
  },
});

const avisoNewRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "condominio/avisos/new",
  component: AvisoNew,
  beforeLoad: ({ context }) => {
    const profile = context.auth.profileUser;
    if (!isCondominioProfile(profile)) {
      throw redirect({ to: getRedirectPath(profile) });
    }
  },
});

const avisoEditRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "condominio/avisos/$id/edit",
  component: AvisoEdit,
  beforeLoad: ({ context }) => {
    const profile = context.auth.profileUser;
    if (!isCondominioProfile(profile)) {
      throw redirect({ to: getRedirectPath(profile) });
    }
  },
});

const moradoresRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "condominio/moradores",
  component: Moradores,
  beforeLoad: ({ context }) => {
    const profile = context.auth.profileUser;
    if (!isCondominioProfile(profile)) {
      throw redirect({ to: getRedirectPath(profile) });
    }
  },
});

const moradorNewRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "condominio/moradores/new",
  component: MoradorNew,
  beforeLoad: ({ context }) => {
    const profile = context.auth.profileUser;
    if (!isCondominioProfile(profile)) {
      throw redirect({ to: getRedirectPath(profile) });
    }
  },
});

const moradorEditRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "condominio/moradores/$id/edit",
  component: MoradorEdit,
  beforeLoad: ({ context }) => {
    const profile = context.auth.profileUser;
    if (!isCondominioProfile(profile)) {
      throw redirect({ to: getRedirectPath(profile) });
    }
  },
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
    movimentacaoNewRoute,
    movimentacaoEditRoute,
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
    auth: {
      isAuthenticated: false,
      profileUser: "",
      dataUser: undefined,
      login: async () => ({ success: false, message: "" }),
      logout: async () => {},
    },
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
