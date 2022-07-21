import React from 'react';

type ModalProps = {
  setpreview: (preview: boolean) => {};
  classNameForModalBoxStyling?: string;
  showCloseButton: boolean;
  children: any;
}

export default function Modal({ setpreview, classNameForModalBoxStyling, showCloseButton, children }: ModalProps) {
    return (
      <>
        <div className="modal" id="my-modal-2">
          <div className={`modal-box ${classNameForModalBoxStyling || ""}`}>
            {showCloseButton && 
              <a 
                href="#my-modal-2"
                className="btn btn-sm btn-circle absolute right-2 top-2"
                onClick={() => setpreview(false)}
              >
                ✕
              </a>
            }
            {children}
          </div>
        </div>
      </>
    );
}