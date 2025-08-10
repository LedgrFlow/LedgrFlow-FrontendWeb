import {
  LayoutDashboard,
  FilePlus,
  FileText,
  BookOpenCheck,
  ClipboardList,
  Pencil,
  Settings,
  HelpCircle,
  FormInputIcon,
  ChartBar,
  LogIn,
  LogOut,
  TreeDeciduous,
  User,
  UserPlus,
} from "lucide-react";
import type { JSX } from "react";

const size_icons = "w-5 h-5";
const min_size_icons = "w-4 h-4";

/**
 * This object contains the paths of the menu and general items
 */
const rootPaths = {
  menu: {
    darhboard: {
      label: "Dashboard",
      href: "/",
      icon: <LayoutDashboard className={size_icons} />,
    },
    // analytics: {
    //   label: "Analiticas",
    //   href: "/analytics",
    //   icon: <ChartBar className={size_icons} />,
    // },
    register: {
      label: "Registros",
      href: "/register",
      icon: <FilePlus className={size_icons} />,
      routes: {
        journal: {
          label: "Diario",
          href: "/register/journal",
          icon: <FileText className={min_size_icons} />,
        },
        results: {
          label: "Resultados",
          href: "/register/results",
          icon: <BookOpenCheck className={min_size_icons} />,
        },
        balance: {
          label: "Balance",
          href: "/register/balance",
          icon: <ClipboardList className={min_size_icons} />,
        },
        balance_detail: {
          label: "Balance detallado",
          href: "/register/balance-detail",
          icon: <TreeDeciduous className={min_size_icons} />,
        },
        // form: {
        //   label: "Formulario",
        //   href: "/register/form",
        //   icon: <FormInputIcon className={min_size_icons} />,
        // },
      },
    },
    editor: {
      label: "Editor",
      href: "/editor",
      icon: <Pencil className={size_icons} />,
    },
  },
  general: {
    Settings: {
      label: "Configuración",
      href: "/settings",
      icon: <Settings className={size_icons} />,
    },
    Help: {
      label: "Ayuda",
      href: "/help",
      icon: <HelpCircle className={size_icons} />,
    },
  },

  auth: {
    login: {
      label: "Iniciar sesión",
      href: "/login",
      icon: <LogIn className={size_icons} />,
    },
    register: {
      label: "Tablas",
      href: "/register",
      icon: <UserPlus className={size_icons} />,
    },
    logout: {
      label: "Cerrar sesión",
      href: "/logout",
      icon: <LogOut className={size_icons} />,
    },
  },

  index: {
    profile: {
      label: "Perfil",
      href: "/profile",
      icon: <User className={size_icons} />,
    },
  },

  // Rutas de prueba aun no terminadas
  test: {
    prefix: "/testing",
    notion: {
      label: "Notion",
      href: "notion",
      icon: <ClipboardList className={size_icons} />,
    },
  },
};

/**
 * This function transforms the menu object into an array of objects with the same structure
 * @param menuSection
 * @returns
 */
function transformRenderItems(
  menuSection: Record<
    string,
    {
      label: string;
      href: string;
      icon: JSX.Element;
      routes?: Record<
        string,
        {
          label: string;
          href: string;
          icon: JSX.Element;
        }
      >;
    }
  >
) {
  return Object.values(menuSection).map((item) => {
    const result: any = {
      label: item.label,
      href: item.href,
      icon: item.icon,
    };

    if (item.routes) {
      result.routes = Object.values(item.routes).map((subItem) => ({
        label: subItem.label,
        href: subItem.href,
        icon: subItem.icon,
      }));
    }

    return result;
  });
}

const renderItems = {
  menu: transformRenderItems(rootPaths.menu),
  general: transformRenderItems(rootPaths.general),
};

export const RoutesConfig = { rootPaths, renderItems };
