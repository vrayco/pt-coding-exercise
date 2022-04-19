import { useEffect } from "react";
import type { NextPage } from "next";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import Layout from "components/Layout";
import { USER_TOKEN_COOKIE } from "constants/auth";
import authApiService from "services/authApiService";
import {
  fetchRepositories,
  repositoriesSelectors,
} from "redux/publicRespositoriesSlice";
import Alert, { AlertType } from "components/commons/Alert";
import Spinner from "components/commons/Spinner";
import RepositoryGrid from "components/RepositoryGrid";
import { AppHydrationStatus } from "enums";

interface Props {}

// This constant is true when SSR (Server Side Rendering), false othewise.
const noSSR = !!(
  typeof window !== "undefined" &&
  window.document &&
  window.document.createElement
);

const Dashboard: NextPage<Props> = () => {
  const { user } = useAppSelector((state) => state.auth);
  const repositories = useAppSelector(repositoriesSelectors.selectAll);
  const { fetching, error, hydrated } = useAppSelector(
    (state) => state.publicRepositories
  );
  const dispatch = useAppDispatch();

  // Fetch the repositories if the component is rendered by the browser (noSSR)
  // and there is no repositories data yet.
  useEffect(() => {
    if (
      noSSR &&
      user &&
      !hydrated &&
      fetching === undefined &&
      error === undefined
    ) {
      dispatch(fetchRepositories());
    }
  }, [dispatch, error, fetching, hydrated, repositories, user]);

  const showErrorAlert = error ? (
    <Alert>
      <>{error}</>
    </Alert>
  ) : (
    <></>
  );

  let showEmptyContentAlert = <></>;
  if (fetching !== true && repositories && repositories.length === 0) {
    showEmptyContentAlert = (
      <Alert variant={AlertType.INFO}>
        <>Ouch! There is not available data to show.</>
      </Alert>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Layout>
        {showErrorAlert}
        {fetching ? <Spinner /> : <></>}
        {showEmptyContentAlert}
        {!fetching && repositories && repositories.length > 0 ? (
          <RepositoryGrid data={repositories} />
        ) : (
          <></>
        )}
      </Layout>
    </>
  );
};

/**
 * Verifies the user session and returns the data the app will use to hydrate
 * the app state.
 */
export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookie = context.req.cookies[USER_TOKEN_COOKIE];
  return await authApiService.SSRVerifySessionAndHydrate(cookie);
};

export default Dashboard;
