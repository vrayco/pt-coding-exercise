import type { NextPage } from "next";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Layout from "components/Layout";
import { NON_SENSITIVE_INFO_USER_COOKIE } from "constants/auth";
import { NonSensitiveInfoUser } from "types";
import usersService from "services/usersService";

interface Props {
  preloadedState?: any;
}

const Dashboard: NextPage<Props> = ({ preloadedState }) => {
  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Layout>
        <p>Loading content...</p>
      </Layout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const nonSensitiveInfoUser: NonSensitiveInfoUser | undefined =
    usersService.getNonSensitiveInfoUserFromCookie(
      context.req.cookies[NON_SENSITIVE_INFO_USER_COOKIE]
    );

  return {
    props: {
      preloadedState: {
        auth: {
          user: nonSensitiveInfoUser,
        },
      },
    },
  };
};

export default Dashboard;
