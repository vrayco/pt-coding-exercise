import { useEffect } from "react";
import type { NextPage } from "next";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Layout from "components/Layout";
import { USER_TOKEN_COOKIE } from "constants/auth";
import authApiService from "services/authApiService";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { fetchPublicRepositories } from "redux/dataSlice";
import Alert, { AlertType } from "components/commons/Alert";
import Spinner from "components/commons/Spinner";
import RepositoryGrid from "components/RepositoryGrid";

interface Props {}

const noSSR = !!(
  typeof window !== "undefined" &&
  window.document &&
  window.document.createElement
);

const Dashboard: NextPage<Props> = () => {
  const { fetching, error, publicRepositories } = useAppSelector(
    (state) => state.data
  );
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Only if the client is rendering (not by SSR Server Side Rendering).
    if (
      noSSR &&
      user &&
      fetching !== true &&
      error === undefined &&
      publicRepositories === undefined
    ) {
      dispatch(fetchPublicRepositories());
    }
  }, [dispatch, error, fetching, publicRepositories, user]);

  const showErrorAlert = error ? (
    <Alert>
      <p>{error}</p>
    </Alert>
  ) : (
    <></>
  );

  const showEmptyContentAlert =
    fetching === false &&
    publicRepositories &&
    publicRepositories.length === 0 ? (
      <Alert variant={AlertType.INFO}>
        <p>Ouch! There is not available data to show.</p>
      </Alert>
    ) : (
      <></>
    );

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Layout>
        {showErrorAlert}
        {fetching ? <Spinner /> : <></>}
        {showEmptyContentAlert}
        {!fetching && publicRepositories && publicRepositories.length > 0 ? (
          <RepositoryGrid data={publicRepositories} />
        ) : (
          <></>
        )}
      </Layout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookie = context.req.cookies[USER_TOKEN_COOKIE];
  return await authApiService.handleSessionInSSR(cookie);
};

export default Dashboard;
