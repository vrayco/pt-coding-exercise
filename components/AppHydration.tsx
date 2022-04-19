import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { AppHydrationStatus } from "enums";
import { RootState } from "redux/store";
import { hydrate } from "redux/appSlice";
import { HydrateAction } from "redux/utils";

type Props = {
  children: JSX.Element;
  preloadedState: HydrateAction["payload"]["preloadedState"];
};

const AppHydration = ({ preloadedState, children }: Props): JSX.Element => {
  const { hydrated } = useAppSelector((state) => state.app);
  const dispatch = useAppDispatch();

  /**
   * Dispatch the hydrate action when the app is rendered the first time.
   */
  useEffect(() => {
    if (hydrated === AppHydrationStatus.PENDING) {
      dispatch(hydrate({ preloadedState }));
    }
  }, [hydrated, dispatch, preloadedState]);

  if (hydrated !== AppHydrationStatus.HYDRATED) {
    return <></>;
  }

  return children;
};

export default AppHydration;
