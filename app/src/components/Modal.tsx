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
        <div className="modal" id="create-grant">
          <div className={`modal-box ${classNameForModalBoxStyling || ""}`}>
            {showCloseButton && 
              <a 
                href="#"
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