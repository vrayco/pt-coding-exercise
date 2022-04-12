import { AnyAction, Action } from "@reduxjs/toolkit";
import { RootSate } from "./store";

interface HydrateAction extends Action {
  payload: {
    preloadedState: Partial<RootSate>;
  };
}

export function isHydrateAction(action: AnyAction): action is HydrateAction {
  return action.type.endsWith("hydrate");
}
