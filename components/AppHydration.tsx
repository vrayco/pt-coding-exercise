import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { hydrate } from "redux/appSlice";
import { AppGlobalStatus, AppHydrationStatus } from "enums";
import { RootState } from "redux/store";

type Props = {
  children: JSX.Element;
  preloadedState: Partial<RootState>;
};

const AppHydration = ({ preloadedState, children }: Props): JSX.Element => {
  const { hydrated, globalStatus } = useAppSelector((state) => state.app);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (
      hydrated === AppHydrationStatus.PENDING &&
      globalStatus === AppGlobalStatus.READY
    ) {
      dispatch(hydrate({ preloadedState }));
    }
  }, [hydrated, globalStatus, dispatch, preloadedState]);

  if (hydrated !== AppHydrationStatus.HYDRATED) {
    return <></>;
  }

  return <>{children}</>;
};

export default AppHydration;
