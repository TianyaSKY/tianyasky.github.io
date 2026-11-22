import React, { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Accessible modal dialog: role="dialog" + aria-modal, closes on Esc or backdrop click,
 * traps Tab / Shift+Tab focus inside the modal, and restores focus to the trigger on unmount.
 * Initial focus lands on the child marked with data-dialog-initial-focus.
 */
export default function AccessibleDialog({ overlayClassName, dialogClassName, label, onClose, children }) {
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const invoker = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const dialog = dialogRef.current;
    if (dialog) {
      const initial = dialog.querySelector('[data-dialog-initial-focus]') || dialog.querySelector(FOCUSABLE_SELECTOR);
      if (initial) {
        initial.focus();
      } else {
        dialog.tabIndex = -1;
        dialog.focus();
      }
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab') return;
      const node = dialogRef.current;
      if (!node) return;
      const focusable = [...node.querySelectorAll(FOCUSABLE_SELECTOR)].filter((el) => el.offsetParent !== null);
      if (focusable.length === 0) {
        e.preventDefault();
        node.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !node.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !node.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      invoker?.focus?.();
    };
  }, []);

  return (
    <div className={overlayClassName} onClick={() => onCloseRef.current()}>
      <div
        ref={dialogRef}
        className={dialogClassName}
        role="dialog"
        aria-modal="true"
        aria-label={typeof label === 'string' ? label : undefined}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
