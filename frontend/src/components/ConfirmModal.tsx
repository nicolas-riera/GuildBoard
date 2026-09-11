import { useState, type ReactNode } from "react";

import Modal from "./Modal";

interface ConfirmModalProps {
    title: string;
    message: ReactNode;
    question: string;
    pendingLabel: string;
    onConfirm: () => Promise<void>;
    onClose: () => void;
}

export default function ConfirmModal({
    title,
    message,
    question,
    pendingLabel,
    onConfirm,
    onClose,
}: ConfirmModalProps) {
    const [pending, setPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleConfirm() {
        if (pending) return;

        setPending(true);
        setError(null);
        try {
            await onConfirm();
        } catch (err) {
            setError((err as Error).message);
            setPending(false);
        }
    }

    return (
        <Modal title={title} onClose={onClose}>
            <div className="modal__body">
                {error && <p className="modal__error">{error}</p>}

                <p className="modal__message">{message}</p>

                <p className="modal__message modal__message--ask">{question}</p>

                <div className="modal__actions">
                    <button
                        type="button"
                        className="btn"
                        onClick={handleConfirm}
                        disabled={pending}
                    >
                        {pending ? pendingLabel : "Yes"}
                    </button>
                    <button type="button" className="btn" onClick={onClose} disabled={pending}>
                        No
                    </button>
                </div>
            </div>
        </Modal>
    );
}
