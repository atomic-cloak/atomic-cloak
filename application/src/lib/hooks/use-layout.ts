import { atom, useAtom } from "jotai";
import { LAYOUT_OPTIONS } from "@/lib/constants";

const cripticLayoutAtom = atom(
  typeof window !== "undefined"
    ? localStorage.getItem("criptic-layout")
    : LAYOUT_OPTIONS.MINIMAL
);

const cripticLayoutAtomWithPersistence = atom(
  (get) => get(cripticLayoutAtom),
  (get, set, newStorage: any) => {
    set(cripticLayoutAtom, newStorage);
    localStorage.setItem("criptic-layout", newStorage);
  }
);

export function useLayout() {
  const [layout, setLayout] = useAtom(cripticLayoutAtomWithPersistence);
  return {
    layout,
    setLayout,
  };
}
