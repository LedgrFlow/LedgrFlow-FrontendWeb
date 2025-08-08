import toast from "react-hot-toast";
import type { JSX } from "react";
import type { ToastOptions } from "react-hot-toast";

type ToastType = "success" | "error" | "loading" | "default";
type ToastCustomComponent = string | JSX.Element | (() => JSX.Element) | null;

// 🎯 Clase global para todos los toast
const defaultOptions: ToastOptions = {
  duration: 4000,
  position: "top-right",

  style: {
    background: "var(--background)",
    color: "var(--foreground)",
  }
};

function notify(
  message: string,
  type: ToastType = "default",
  options?: ToastOptions
) {
  const opts: ToastOptions = {
    ...defaultOptions,
    ...options,
    className: [defaultOptions.className, options?.className]
      .filter(Boolean)
      .join(" "),
  };

  switch (type) {
    case "success":
      toast.success(message, opts);
      break;
    case "error":
      toast.error(message, opts);
      break;
    case "loading":
      toast.loading(message, opts);
      break;
    default:
      toast(message, opts);
  }
}

function notifyPromise<T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((err: unknown) => string);
  },
  options?: ToastOptions
) {
  const opts: ToastOptions = {
    ...defaultOptions,
    ...options,
    className: [defaultOptions.className, options?.className]
      .filter(Boolean)
      .join(" "),
  };

  return toast.promise(
    promise,
    {
      loading: messages.loading,
      success: (data) =>
        typeof messages.success === "function"
          ? messages.success(data)
          : messages.success,
      error: (err) =>
        typeof messages.error === "function"
          ? messages.error(err)
          : messages.error,
    },
    opts
  );
}

function notifyCustom(component: ToastCustomComponent, options?: ToastOptions) {
  const opts: ToastOptions = {
    ...defaultOptions,
    ...options,
    className: [defaultOptions.className, options?.className]
      .filter(Boolean)
      .join(" "),
  };

  return toast.custom(component, opts);
}

function dismiss(toastId?: string) {
  toast.dismiss(toastId);
}

export const useAppToast = {
  notify,
  notifyPromise,
  notifyCustom,
  dismiss,
};
