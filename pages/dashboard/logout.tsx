import { useEffect } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Layout from "components/Layout";
import useUser from "hooks/useUser";

const Logout: NextPage = () => {
  const { logout } = useUser();

  useEffect(() => {
    logout();
  });

  return (
    <>
      <Head>
        <title>Logout</title>
      </Head>
      <Layout>
        <p>Loging out...</p>
      </Layout>
    </>
  );
};

export default Logout;
