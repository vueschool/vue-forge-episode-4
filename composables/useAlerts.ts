import { nanoid } from "nanoid";

interface AlertOptions {
  type?: "success" | "error" | "info" | "warning";
  title?: string;
  dismissible?: boolean;
  timeout?: number;
}
interface Alert extends AlertOptions {
  message: string;
  id: string;
}

const TIMEOUT = 5000; 

export const useAlerts = () => {
  const alerts: Ref<Alert[]> = useState('alerts', () => []);

  function dismiss(idOrAlert: string | Alert) {
    const id = typeof idOrAlert === "object" ? idOrAlert.id : idOrAlert;

    alerts.value = alerts.value.filter((alert) => alert.id !== id);
  }

  function addAlert(message: string, options: AlertOptions = {}) {
    const id = nanoid();

    const alert: Alert = {
      id,
      message,
      type: options.type || 'info',
      dismissible: options.dismissible || true,
      timeout: options.timeout || TIMEOUT,
      title: options.title,
    };

    alerts.value.push(alert);

    if (alert.timeout) {
      setTimeout(() => dismiss(alert.id), alert.timeout);
    }
  }

  function success(message: string, options: AlertOptions = {}) {
    addAlert(message, { ...options, type: 'success' });
  }

  function error(message: string, options: AlertOptions = {}) {
    addAlert(message, { ...options, type: 'error' });
  }

  function info(message: string, options: AlertOptions = {}) {
    addAlert(message, { ...options, type: 'info' });
  }

  function warning(message: string, options: AlertOptions = {}) {
    addAlert(message, { ...options, type: 'warning' });
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
