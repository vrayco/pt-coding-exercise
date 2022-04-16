import { useEffect } from "react";
import type { NextPage } from "next";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Layout from "components/Layout";
import { USER_TOKEN_COOKIE } from "constants/auth";
import authApiService from "services/authApiService";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { fetchOwnRepositories } from "redux/dataSlice";
import Alert, { AlertType } from "components/commons/Alert";
import Spinner from "components/commons/Spinner";
import RepositoryGrid from "components/RepositoryGrid";

interface Props {}

// This constant is true when SSR (Server Side Rendering), false othewise.
const noSSR = !!(
  typeof window !== "undefined" &&
  window.document &&
  window.document.createElement
);

const Settings: NextPage<Props> = () => {
  const { fetching, error, ownRepositories } = useAppSelector(
    (state) => state.data
  );
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  // Fetch the repositories if the component is rendered by the browser (noSSR)
  // and there is no repositories data yet.
  useEffect(() => {
    if (
      noSSR &&
      user &&
      user.githubUsername &&
      fetching !== true &&
      error === undefined &&
      ownRepositories === undefined
    ) {
      dispatch(fetchOwnRepositories());
    }
  }, [dispatch, error, fetching, ownRepositories, user]);

  let showSignInGithubAlert = <></>;
  if (user === undefined || user.githubUsername === undefined) {
    showSignInGithubAlert = (
      <Alert variant={AlertType.INFO}>
        <p>Sign in with your GitHub account is required for this section.</p>
      </Alert>
    );
  }

  const showErrorAlert = error ? (
    <Alert>
      <p>{error}</p>
    </Alert>
  ) : (
    <></>
  );

  let showEmptyContentAlert = <></>;
  if (fetching === false && ownRepositories && ownRepositories.length === 0) {
    showEmptyContentAlert = (
      <Alert variant={AlertType.INFO}>
        <p>Ouch! There is not available data to show.</p>
      </Alert>
    );
  }

  return (
    <>
      <Head>
        <title>Settings</title>
      </Head>
      <Layout>
        {showSignInGithubAlert}
        {showErrorAlert}
        {fetching ? <Spinner /> : <></>}
        {showEmptyContentAlert}
        {!fetching && ownRepositories && ownRepositories.length > 0 ? (
          <RepositoryGrid data={ownRepositories} />
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

export default Settings;
