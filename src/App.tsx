import type { FC } from 'react';
import './App.css';
import { ToastItem } from './components/ToastItem';
import { useToastContext } from './context/ToastContext';
import { ATTRIBUTES } from './attributesForTests';
import { ERROR_TOAST_DURATION } from './constants';

const TriggerButtons = () => {
    const { addToast } = useToastContext();

    return (
        <div className="card">
            <h2>Test Controls</h2>
            <div className="buttons-grid">
                <button
                    data-testid={ATTRIBUTES.buttonSuccess}
                    className="btn-success"
                    onClick={() => addToast({ message: 'Успех!', type: 'success' })}
                >
                    Success Toast
                </button>

                <button
                    data-testid={ATTRIBUTES.buttonError}
                    className="btn-error"
                    onClick={() => addToast({ message: 'Ошибка!', type: 'error', duration: ERROR_TOAST_DURATION })}
                >
                    Error (2s)
                </button>

                <button
                    data-testid={ATTRIBUTES.buttonWarning}
                    className="btn-warning"
                    onClick={() => addToast({ message: 'Предупрежение', type: 'warning' })}
                >
                    Warning
                </button>

                <button
                    className="btn-info"
                    onClick={() => addToast({ message: 'Информация', type: 'info' })}
                >
                    Info
                </button>
            </div>
            <p style={{ marginTop: 20, color: '#888' }}>
                Наведите курсор на тост, чтобы приостановить таймер.
            </p>
        </div>
    );
};

const ToastsList: FC = () => {
    const { removeToast, toasts } = useToastContext();

    return (
        <div className="toast-list">
            {toasts.map((toast) => (
                <ToastItem
                    key={toast.id}
                    onRemove={removeToast}
                    toast={toast}
                />
            ))}
        </div>
    );
};

function App() {
    return (
        <div className="app-layout">
            <header className="header">
                <h1>Система управления тостами</h1>
            </header>

            <main className="content">
                <TriggerButtons />
            </main>

            <ToastsList />
        </div>
    );
}

export default App;
