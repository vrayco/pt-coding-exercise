import type { NextPage } from "next";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Layout from "components/Layout";
import { User } from "types";
import usersApiService from "services/usersApiService";
import { USER_COOKIE, USER_TOKEN_COOKIE } from "constants/auth";
import authApiService from "services/authApiService";
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

export default Dashboard;
