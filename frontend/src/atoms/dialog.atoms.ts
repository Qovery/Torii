import { atom } from "jotai";
import { atomFamily } from "jotai/utils";

export const dialogOpenedAtomFamily = atomFamily(() => atom(false));
