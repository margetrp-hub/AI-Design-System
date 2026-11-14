import { inject, type InjectionKey } from "vue";
export interface ToastOptions {
  title: string;
  description?: string;
  tone?: "neutral" | "info" | "success" | "warning" | "danger";
  duration?: number;
}
export interface ToastApi {
  notify: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
  clear: () => void;
}
export const toastKey: InjectionKey<ToastApi> = Symbol("wiki-ui-toast");
export function useToast(): ToastApi {
  const toast = inject(toastKey);
  if (!toast) throw new Error("useToast must be used inside UiToastProvider");
  return toast;
}
