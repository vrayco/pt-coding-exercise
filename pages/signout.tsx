import { useEffect } from "react";
import type { NextPage } from "next";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { signOut } from "redux/authSlice";
import { useRouter } from "next/router";

const Signout: NextPage = () => {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user) {
      dispatch(signOut());
    } else {
      router.replace("/");
    }
  }, [dispatch, router, user]);

  return <></>;
};

export default Signout;
