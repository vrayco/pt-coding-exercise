import { useEffect } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAppSelector } from "redux/hooks";

import Github from "../components/commons/icons/Github";
import SignInForm from "../components/SigninForm";
import { AppHydrationStatus } from "enums";

const Home: NextPage = () => {
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();

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
              <button
                type="button"
                className="flex w-full justify-center rounded-md border border-transparent bg-neutral-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2"
              >
                <Github className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Sign in with GitHub
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
