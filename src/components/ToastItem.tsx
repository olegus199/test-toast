import React, { useEffect, useRef, useState } from 'react';
import type { Toast } from '../types/types';
import { ATTRIBUTES } from '../attributesForTests';
import { TOAST_UNMOUNT_DURATION } from '../constants';

interface ToastItemProps {
    toast: Toast;
    onRemove: (id: string) => void;
}

type Timer = NodeJS.Timeout | null;

export const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
    const [remainingTime, setRemainingTime] = useState(toast.duration || 0);

    const timer = useRef<Timer>(null);
    const startTime = useRef<number | null>(null);
    const toastRef = useRef<HTMLDivElement>(null);

    const removeToast = (): void => {
        toastRef.current?.classList.add('toast-fade-out');

        setTimeout(() => {
            onRemove(toast.id);
        }, TOAST_UNMOUNT_DURATION);
    }

    const clearTimer = (): void => {
        if (timer.current) {
            clearTimeout(timer.current);
            timer.current = null;
        }
    };

    const startTimer = (): void => {
        if (!toast.duration) {
            return;
        }

        clearTimer();
        startTime.current = Date.now();

        timer.current = setTimeout(() => {
            removeToast();
        }, remainingTime);
    };

    const handleMouseEnter = (): void => {
        if (!toast.duration) {
            return;
        }

        clearTimer();

        if (startTime.current) {
            const elapsed = Date.now() - startTime.current;

            setRemainingTime(prev => Math.max(prev - elapsed, 0));
            startTime.current = null;
        }
    };

    const handleMouseLeave = (): void => {
        if (!toast.duration) {
            return;
        }

        startTime.current = Date.now();
        startTimer();
    };

    useEffect(() => {
        if (toast.duration) {
            setRemainingTime(toast.duration);
            startTimer();
        }

        return () => {
            clearTimer();
        };
    }, [toast.duration, toast.id]);

    return (
        <div
            data-testid={`${ATTRIBUTES.toast}${toast.id}`}
            className={`toast toast-${toast.type} ${!toast.renewedToast && 'toast-fade-in'}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            ref={toastRef}
        >
            <span>{toast.message}</span>
            <button
                data-testid={`${ATTRIBUTES.toastRemoveButton}${toast.id}`}
                onClick={removeToast}
            >
                x
            </button>
        </div>
    );
};
