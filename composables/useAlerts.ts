import { nanoid } from "nanoid";

interface AlertOptions {
  type?: "success" | "error" | "info" | "warning";
  title?: string;
  dismissiable?: boolean;
  timeout?: number;
}
interface Alert extends AlertOptions {
  message: string;
  id: string;
}

export const useAlerts = () => {
  const alerts: Alert[] = [];

  function dismiss(idOrAlert: string | Alert) {
    console.log("dismissing");
  }

  function success(message: string, options: AlertOptions = {}) {
    window.alert("SUCCESS: " + message);
  }

  function error(message: string, options: AlertOptions = {}) {
    window.alert("ERROR: " + message);
  }

  function info(message: string, options: AlertOptions = {}) {
    window.alert("INFO: " + message);
  }

  function warning(message: string, options: AlertOptions = {}) {
    window.alert("WARNING: " + message);
  }

  return {
    success,
    info,
    warning,
    error,
    alerts,
    dismiss,
  };
};
