import { useSyncExternalStore } from "react";
import { getServerSnapshot, getSnapshot, subscribe } from "@/lib/localChanges";

/** Re-renders the component whenever a local add/edit/delete happens. */
export default function useLocalChanges() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
