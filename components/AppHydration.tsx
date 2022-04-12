import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { hydrate } from "redux/appSlice";
import { AppHydrationStatus } from "enums";
import { RootSate } from "redux/store";

type Props = {
  children: JSX.Element;
  preloadedState: Partial<RootSate>;
};

const AppHydration = ({ preloadedState, children }: Props): JSX.Element => {
  const status = useAppSelector<AppHydrationStatus>(
    (state) => state.app.hydrated
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (status === AppHydrationStatus.PENDING) {
      dispatch(hydrate({ preloadedState }));
    }
  }, [status, dispatch, preloadedState]);

  if (status !== AppHydrationStatus.HYDRATED && !preloadedState) {
    return <></>;
  }

  return <>{children}</>;
};

export default AppHydration;
