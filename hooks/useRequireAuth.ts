import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAppSelector } from "redux/hooks";

/**
 * This hook redirect the user to redirectuUrl when there is no open session.
 * If the user exits in the app state, it considers that the session is open.
 */
function useRequireAuth(redirectUrl = "/") {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (router.pathname !== redirectUrl && user === undefined) {
      router.push(redirectUrl);
    }
  }, [user, router, redirectUrl]);
}

export default useRequireAuth;
