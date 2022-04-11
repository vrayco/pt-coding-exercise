import type { NextPage } from "next";
import { signOut } from "redux/auth-slice";
import { useAppDispatch } from "redux/hooks";

const Dashboard: NextPage = () => {
  const dispatch = useAppDispatch();
  return (
    <>
      <a onClick={() => dispatch(signOut())}>logout</a>
      <h1>Dashboard</h1>
    </>
  );
};

export default Dashboard;
