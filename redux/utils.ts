import { AnyAction, Action } from "@reduxjs/toolkit";
import { GitHubRepository, User } from "types";

export interface HydrateAction extends Action {
  payload: {
    preloadedState: {
      auth: {
        user: User;
      };
      ownRepositories: GitHubRepository[];
      publicRepositories: GitHubRepository[];
    };
  };
}

type ResetAction = Action;

export function isHydrateAction(action: AnyAction): action is HydrateAction {
  return action.type.endsWith("hydrate");
}

export function isResetAction(action: AnyAction): action is ResetAction {
  return action.type.endsWith("reset");
}
