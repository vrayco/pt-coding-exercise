import { useAppSelector } from "redux/hooks";
import { signOut } from "redux/authSlice";
import { useAppDispatch } from "redux/hooks";

// TODO
function useUser() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  return {
    user,
    fullname: user ? user.name : "",
    logout: () => dispatch(signOut()),
  };
}

export default useUser;
