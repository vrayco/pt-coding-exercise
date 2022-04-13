import { useEffect } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import SignInForm from "components/SigninForm";
import SignInGithub from "components/SignInGithub";
import useUser from "hooks/useUser";

const Home: NextPage = () => {
  const router = useRouter();
  const { query } = useRouter();
  const { code } = query;
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [router, user]);

  return (
    <>
      <Head>
        <title>Sign in</title>
      </Head>
      <div className="flex h-screen bg-slate-100">
        <div className="m-auto">
          <div className="w-96 divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
            <h1 className="text py-3 px-4 text-lg">Sign in</h1>
            <div className="px-4 py-5">
              <SignInForm />
            </div>
            <div className="px-4 py-5">
              <SignInGithub code={code as string} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
