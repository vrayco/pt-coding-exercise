import type { NextPage } from "next";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Layout from "components/Layout";
import { User } from "types";
import usersApiService from "services/usersApiService";
import { USER_COOKIE } from "constants/auth";
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
  const user: User | undefined = usersApiService.getUserFromCookie(
    context.req.cookies[USER_COOKIE]
  );

  return {
    props: {
      preloadedState: {
        auth: {
          ...(user && { user }),
        },
      },
    },
  };
};

export default Dashboard;
