import { AnyAction, Action } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface HydrateAction extends Action {
  payload: {
    preloadedState: Partial<RootState>;
  };
}

export function isHydrateAction(action: AnyAction): action is HydrateAction {
  return action.type.endsWith("hydrate");
}
