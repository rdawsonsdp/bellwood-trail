import { startTransition, type FormEvent } from "react";

/**
 * Submit a form to a useActionState action without React's automatic form
 * reset — React clears uncontrolled fields (and the chosen file) after every
 * action, even one that comes back with a validation error.
 */
export const keepOnError = (dispatch: (fd: FormData) => void) => (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const fd = new FormData(e.currentTarget);
  startTransition(() => dispatch(fd));
};
