import { useEffect, useId, useRef, type MouseEvent, type ReactNode } from "react";

import "../styles/modal.css";

interface ModalProps {
    title: string;
    onClose: () => void;
    children: ReactNode;
}

export default function Modal({ title, onClose, children }: ModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const titleId = useId();

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (!dialog.open) {
            dialog.showModal();
            
            dialog.focus();
        }
        dialog.addEventListener("close", onClose);

        return () => {
            dialog.removeEventListener("close", onClose);
        };
    }, [onClose]);

    function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
        if (event.target === dialogRef.current) dialogRef.current?.close();
    }

    return (
        <dialog
            ref={dialogRef}
            className="modal"
            tabIndex={-1}
            aria-labelledby={titleId}
            onClick={handleBackdropClick}
        >
            <header className="modal__header">
                <h2 id={titleId} className="modal__title">
                    {title}
                </h2>
                <button
                    type="button"
                    className="modal__close"
                    onClick={() => dialogRef.current?.close()}
                    aria-label="Close"
                >
                    &times;
                </button>
            </header>

            {children}
        </dialog>
    );
}
