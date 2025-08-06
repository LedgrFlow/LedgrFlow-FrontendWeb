import clsx from "clsx";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export function SidebarMenuItem({
  item,
  isCollapsed,
  location,
  logout,
}: {
  item: {
    label: string;
    href: string;
    icon: React.ReactNode;
    routes?: { label: string; href: string, icon: React.ReactNode }[];
  };
  isCollapsed: boolean;
  location: ReturnType<typeof useLocation>;
  logout: () => void;
}) {
  const [open, setOpen] = useState(false);

  const isActive = location.pathname === item.href;

  const toggle = () => setOpen((prev) => !prev);

  if (item.href === "/logout") {
    return (
      <button
        onClick={logout}
        className={clsx(
          "flex items-center gap-3 py-2 px-3 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 w-full text-left",
          isCollapsed && "justify-center"
        )}
      >
        {item.icon}
        {!isCollapsed && <span>{item.label}</span>}
      </button>
    );
  }

  if (item.routes) {
    return (
      <div>
        <button
          onClick={toggle}
          className={clsx(
            "flex items-center gap-3 py-2 px-3 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 w-full text-left",
            isCollapsed && "justify-center"
          )}
        >
          {item.icon}
          {!isCollapsed && (
            <>
              <span className="flex-1">{item.label}</span>
              {open ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </>
          )}
        </button>

        <AnimatePresence initial={false}>
          {!isCollapsed && open && (
            <motion.div
              key="content"
              initial="collapsed"
              animate="open"
              exit="collapsed"
              variants={{
                open: { height: "auto", opacity: 1 },
                collapsed: { height: 0, opacity: 0 },
              }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden pl-6"
            >
              <div className="relative border-l border-muted-foreground/20 ml-[10px] mt-1 space-y-1 text-sm transition duration-150">
                {item.routes.map((route) => (
                  <Link
                    key={route.href}
                    to={route.href}
                    className={clsx(
                      "block py-1 px-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 ml-3 relative flex items-center gap-2",
                      location.pathname === route.href &&
                        "bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 font-semibold"
                    )}
                  >
                    {route?.icon}
                    <span>{route.label}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <Link
      to={item.href}
      className={clsx(
        "flex items-center gap-3 py-2 px-3 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 text-[14px]",
        isCollapsed && "justify-center",
        isActive && "bg-blue-100 text-blue-600 dark:bg-blue-950/80 dark:text-blue-400 font-semibold"
      )}
    >
      {item.icon}
      {!isCollapsed && <span>{item.label}</span>}
    </Link>
  );
}
