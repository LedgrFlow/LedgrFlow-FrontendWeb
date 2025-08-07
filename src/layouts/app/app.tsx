import { Link, useLocation } from "react-router-dom";
import NotificationDropdown from "@/components/dropdown/notification";
import { useAuth } from "@/contexts/AuthContext";
import { Loading } from "@/components/ui/loading";
import { RoutesConfig } from "@/config/routes.config";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import clsx from "clsx";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useFiles } from "@/contexts/FilesContext";
import { SearchFiles } from "@/components/inputs/search";
import { ButtonUploadFile } from "@/components/buttons/button-upload-file";
import { SidebarMenuItem } from "@/layouts/components/slider-menu";
import { LogOut, User, Settings } from "lucide-react";
import LOGO from "@/assets/logo.png";
import { APP_NAME } from "@/constants/app";
import { useUI } from "@/contexts/UIContext";
const { renderItems, rootPaths } = RoutesConfig;

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  // Si está cargando, mostrar loading
  if (isLoading) {
    return <Loading message="Cargando aplicación..." />;
  }

  // Si no está autenticado, no mostrar el layout
  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </SidebarProvider>
  );
}

export const UploadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path d="M16 8l-4-4-4 4" stroke="currentColor" strokeWidth="2" />
    <path d="M12 4v12" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const DownloadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path d="M16 12l-4 4-4-4" stroke="currentColor" strokeWidth="2" />
    <path d="M12 4v12" stroke="currentColor" strokeWidth="2" />
  </svg>
);

function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const { logout, user } = useAuth();
  const { dataFiles, handleSelect, currentFile, handleUploadFiles } =
    useFiles();
  const location = useLocation();
  const { state } = useSidebar();

  const isCollapsed = state === "collapsed";

  return (
    <div className="w-full h-screen flex bg-cover bg-center bg-no-repeat relative">
      {/* Sidebar */}
      <Sidebar
        collapsible="icon"
        className="bg-transparent border-none min-w-[80px]"
      >
        <SidebarHeader className="py-5">
          <div
            className={clsx(
              "flex items-center gap-3 p-3",
              isCollapsed ? "justify-center" : "justify-start"
            )}
          >
            {/* <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-purple-500 shrink-0" /> */}
            <img
              src={LOGO}
              alt="Logo"
              className="w-10 h-10 rounded-full shrink-0"
            />
            {!isCollapsed && (
              <p className="font-bold text-foregroundtext-lg whitespace-nowrap">
                {APP_NAME}
              </p>
            )}
          </div>
        </SidebarHeader>

        <SidebarContent>
          <div className="px-4 pb-2 space-y-2">
            <div className="space-y-1">
              <p
                className={clsx("text-sm text-muted", isCollapsed && "sr-only")}
              >
                Menu
              </p>

              {renderItems.menu.map((item) => (
                <SidebarMenuItem
                  key={item.href}
                  item={item as any}
                  isCollapsed={isCollapsed}
                  location={location}
                  logout={logout}
                />
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-1">
              <p
                className={clsx("text-sm text-muted", isCollapsed && "sr-only")}
              >
                General
              </p>
              {renderItems.general.map((item) => (
                <SidebarMenuItem
                  key={item.href}
                  item={item}
                  isCollapsed={isCollapsed}
                  location={location}
                  logout={logout}
                />
              ))}
            </div>
          </div>
        </SidebarContent>

        <SidebarFooter>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={clsx(
                  "flex items-center w-full p-3 rounded-lg transition-colors hover:bg-neutral-200 hover:dark:bg-neutral-800/70 cursor-pointer",
                  isCollapsed ? "justify-center p-2" : "justify-start gap-3"
                )}
              >
                <Avatar className="w-10 h-10 flex items-center justify-center">
                  <AvatarImage
                    src={user?.avatar_url}
                    alt="Laura"
                    className="rounded-md object-cover"
                  />
                  <AvatarFallback>
                    {user?.first_name?.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>

                {!isCollapsed && (
                  <div className="flex flex-col text-left overflow-hidden">
                    <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200 truncate">
                      {user?.first_name} {user?.last_name}
                    </span>
                    <span className="text-xs text-neutral-500 truncate">
                      {user?.email}
                    </span>
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              side="top"
              className="w-60 p-1 rounded-md shadow-md bg-white dark:bg-black/80"
            >
              <DropdownMenuSeparator />

              <DropdownMenuItem className="px-3 py-2 hover:bg-neutral-100 hover:dark:bg-neutral-800/70 rounded cursor-pointer flex items-center">
                <Link
                  className="w-full flex items-center gap-2"
                  to={rootPaths?.index.profile.href}
                >
                  <User className="w-4 h-4 mr-2" />
                  Perfil
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem className="px-3 py-2 hover:bg-neutral-100 hover:dark:bg-neutral-800/70 rounded cursor-pointer flex items-center">
                <Link
                  className="w-full flex items-center gap-2"
                  to={rootPaths?.general.Settings.href}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Configuración
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="px-3 py-2 hover:bg-red-100 hover:dark:bg-neutral-900 text-red-500 dark:text-red-400/70 bg-red-500/40 border-top border-red-500 rounded cursor-pointer flex items-center"
                onClick={logout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>

      {/* Main Content */}
      <div className="w-full h-full m-auto overflow-y-auto px-8 py-4">
        <div className="w-full max-w-[1600px] m-auto rounded-2xl flex justify-between items-center pt-5">
          <div className="flex items-center gap-4 mr-2">
            <SidebarTrigger className="bg-white dark:bg-black" />
          </div>

          <div className="w-full flex justify-between items-center">
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              {currentFile?.name || "Select a file"}{" "}
              <span className="text-[12px] dark:text-neutral-400 font-normal">
                {currentFile?.file_extension}
              </span>
            </h1>
          </div>

          <div
            className={clsx(
              "w-full max-w-[500px] flex justify-end items-center gap-2"
            )}
          >
            <div className="max-w-[400px] w-full">
              <SearchFiles
                onSelect={(value) => {
                  handleSelect(value);
                }}
                files={dataFiles}
              />
            </div>
            <ButtonUploadFile
              onChange={(formFiles) => {
                if (formFiles) handleUploadFiles(formFiles);
              }}
            />
            <NotificationDropdown />
          </div>
        </div>

        <main className="w-full max-w-[1600px] m-auto min-h-screen rounded-2xl mt-4 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
