import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAppSelector } from "redux/hooks";

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
