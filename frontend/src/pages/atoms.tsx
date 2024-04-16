import { atom } from "jotai";
import { atomFamily } from "jotai/utils";
import { User } from "@/types/user.type";

export const pageTitleAtom = atom("");
export const dialogOpenedAtomFamily = atomFamily(() => atom(false));

const user = {
  id: "1",
  name: "Tom Cook",
  email: "tom@example.com",
  imageUrl:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};

export const userAtom = atom<User>(user);
