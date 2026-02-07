import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { NewToast, Toast, ToastContextValue } from '../types/types';
import { nanoid } from 'nanoid';

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = (toast: NewToast): void => {
        const existingToastIndex = toasts.findIndex(
            (item) => item.message === toast.message && item.type === toast.type
        );

        if (existingToastIndex !== -1) {
            // If found and has duration, rerender existing toast
            if (toasts[existingToastIndex].duration) {
                setToasts((prev) => {
                    const updatedToasts = [...prev];

                    updatedToasts[existingToastIndex] = {
                        ...updatedToasts[existingToastIndex],
                        id: nanoid(),
                        duration: toast.duration ?? updatedToasts[existingToastIndex].duration,
                        renewedToast: true,
                    };

                    return updatedToasts;
                });
            }
        } else {
            // Push new toast if it was not found
            setToasts((prev) => {
                return [...prev, { ...toast, id: nanoid() }];
            });
        }
    };

    const removeToast = (id: string): void => {
        setToasts((prev) => prev.filter((item) => item.id !== id));
    };

    return (
        <ToastContext.Provider value={{
            addToast,
            removeToast,
            toasts,
        }}>
            {children}
        </ToastContext.Provider>
    );
};

export const useToastContext = (): ToastContextValue => {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error(
            'useToastContext must be used within a ToastContextProvider',
        );
    }

    return context;
};

