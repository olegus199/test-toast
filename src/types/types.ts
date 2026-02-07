export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    duration?: number;
    id: string;
    message: string;
    renewedToast?: boolean;
    type: ToastType;
}

export interface ToastContextValue {
    addToast: (toast: NewToast) => void;
    removeToast: (id: string) => void;
    toasts: Toast[];
}

export type NewToast = Omit<Toast, 'id'>;
