import { Atom, atom } from "jotai";
import { unwrap } from "jotai/utils";

export const atomWithSwr = <T>(baseAtom: Atom<T>): Atom<T | Promise<T>> => {
  const unwrappedAtom = unwrap(baseAtom, (prev) => prev);
  return atom((get) => {
    return get(unwrappedAtom) ?? get(baseAtom);
  });
};
