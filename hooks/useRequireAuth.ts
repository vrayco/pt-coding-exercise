import { useEffect } from "react";
import { useAppSelector } from "redux/hooks";
import { useRouter } from "next/router";

// TODO
function useRequireAuth(redirectUrl = "/") {
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();

  useEffect(() => {
    if (router.pathname !== redirectUrl && user === undefined) {
      router.push(redirectUrl);
    }
  }, [user, router, redirectUrl]);
}

export default useRequireAuth;
