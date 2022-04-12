import { useAppSelector } from "redux/hooks";
import { signOut } from "redux/auth-slice";
import { useAppDispatch } from "redux/hooks";

// TODO
function useUser() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  return {
    user,
    fullname: user
      ? `${user.firstName} ${user.middleName} ${user.lastName}`
      : "",
    logout: () => dispatch(signOut()),
  };
}

export default useUser;
