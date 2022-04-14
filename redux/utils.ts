import { AnyAction, Action } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface HydrateAction extends Action {
  payload: {
    preloadedState: Partial<RootState>;
  };
}

type ResetAction = Action;

export function isHydrateAction(action: AnyAction): action is HydrateAction {
  return action.type.endsWith("hydrate");
}

export function isResetAction(action: AnyAction): action is ResetAction {
  return action.type.endsWith("reset");
}
