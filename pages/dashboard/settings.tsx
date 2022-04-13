import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Layout from "components/Layout";
import { USER_TOKEN_COOKIE } from "constants/auth";
import authApiService from "services/authApiService";

const Settings: NextPage = () => {
  return (
    <>
      <Head>
        <title>Settings</title>
      </Head>
      <Layout>
        <p>Settings</p>
      </Layout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const token = context.req.cookies[USER_TOKEN_COOKIE];
  const user = await authApiService.getUserFromJWTToken(token);
  if (!user) {
    return {
      redirect: {
        destination: "/signout",
        permanent: false,
      },
    };
  }

  return {
    props: {
      preloadedState: {
        auth: {
          user,
        },
      },
    },
  };
};

export default Settings;
