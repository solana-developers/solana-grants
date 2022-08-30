import React from "react";

type ModalProps = {
  setpreview: (preview: boolean) => void;
  classNameForModalBoxStyling?: string;
  showCloseButton: boolean;
  children: any;
  id: string;
};

export default function Modal({
  setpreview,
  classNameForModalBoxStyling,
  showCloseButton,
  id,
  children,
}: ModalProps) {
  return (
    <>
      <div className="modal " id={id}>
        <div className={`modal-box ${classNameForModalBoxStyling || ""}`}>
          {showCloseButton && (
            <button
              className="btn btn-sm btn-circle absolute right-2 top-2"
              onClick={() => setpreview(false)}
            >
              ✕
            </button>
          )}
          {children}
        </div>
      </div>
    </>
  );
}
