import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from 'vitest';
import { act, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render as rtlRender } from "@testing-library/react";
import { ToastProvider } from '../context/ToastContext';
import App from '../App';
import { ATTRIBUTES } from '../attributesForTests';
import { ERROR_TOAST_DURATION } from '../constants';

function render() {
    return rtlRender(getApp(), {
        wrapper: ({ children }) => <ToastProvider>{children}</ToastProvider>,
    });
}

export function getApp() {
    return (
        <App />
    );
}

const {
    buttonError,
    buttonSuccess,
    buttonWarning,
    toast,
    toastRemoveButton,
} = ATTRIBUTES;

describe('Main tests', () => {
    it('Renders simple toast', async () => {
        render();

        await userEvent.click(screen.getByTestId(buttonSuccess));

        const toastElement = screen.getByTestId((id) => id.startsWith(toast));

        expect(toastElement).toBeInTheDocument();
    });

    it('Removes simple toast on X click', async () => {
        vi.useFakeTimers();

        render();

        fireEvent.click(screen.getByTestId(buttonSuccess));

        const closeButton = screen.getByTestId((id) => id.startsWith(toastRemoveButton));

        fireEvent.click(closeButton);

        act(() => {
            vi.runAllTimers();
        })

        expect(screen.queryByTestId((id) => id.startsWith(toast))).not.toBeInTheDocument();

        vi.useRealTimers();
    });

    it('Does not render multiple toasts if type and message are the same', async () => {
        render();

        await userEvent.click(screen.getByTestId(buttonSuccess));

        await userEvent.click(screen.getByTestId(buttonSuccess));

        const toastElements = screen.getAllByTestId((id) => id.startsWith(toast));

        expect(toastElements).toHaveLength(1);
    });

    it('Renders multiple toasts if types are different', async () => {
        render();

        await userEvent.click(screen.getByTestId(buttonSuccess));

        await userEvent.click(screen.getByTestId(buttonWarning));

        const toastElements = screen.getAllByTestId((id) => id.startsWith(toast));

        expect(toastElements).toHaveLength(2);
    });

    describe('Toasts with duration tests', () => {
        beforeEach(() => {
            vi.useFakeTimers();
        });

        afterEach(() => {
            vi.runOnlyPendingTimers()
            vi.useRealTimers()
        });

        it('Unmounts toast with duration after passed duration', async () => {
            render();

            fireEvent.click(screen.getByTestId(buttonError));

            act(() => {
                vi.runAllTimers();
            })

            expect(screen.queryByTestId((id) => id.startsWith(toast))).not.toBeInTheDocument();
        });

        it('Pauses timer on mouseOver and continues after mouseLeave', async () => {
            render();

            fireEvent.click(screen.getByTestId(buttonError));

            act(() => {
                vi.advanceTimersByTime(ERROR_TOAST_DURATION - 100);
            })

            const toastElement = screen.getByTestId((id) => id.startsWith(toast));

            expect(toastElement).toBeInTheDocument();

            fireEvent.mouseOver(toastElement);

            act(() => {
                vi.runAllTimers();
            })

            expect(toastElement).toBeInTheDocument();

            fireEvent.mouseLeave(toastElement);

            act(() => {
                vi.runAllTimers();
            })

            expect(screen.queryByTestId((id) => id.startsWith(toast))).not.toBeInTheDocument();
        });
    });
});
