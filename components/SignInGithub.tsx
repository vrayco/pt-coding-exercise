import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { useRouter } from "next/router";
import { signInGithub } from "redux/authSlice";
import Github from "components/commons/icons/Github";
import Spinner from "components/commons/Spinner";
import Button, { BaseColors } from "components/commons/Button";
import { SigninProviders } from "enums";

const GITHUB_CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID_GITHUB;

type Props = {
  code: string | undefined;
};

const SignInGithub = ({ code }: Props): JSX.Element => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { fetching, error } = useAppSelector((state) => state.auth);
  const user = useAppSelector((state) => state.auth.user);
  const [clicked, setClicked] = useState<boolean>(false);

  useEffect(() => {
    if (code && !fetching && !user && !error) {
      dispatch(signInGithub(code));
    }
  }, [code, dispatch, fetching, user, error]);

  const disabled = fetching !== undefined || clicked;
  const showSpinner = fetching === SigninProviders.GITHUB || clicked;

  const onHandleClick = () => {
    if (!disabled) {
      setClicked(true);
      router.replace(
        `https://github.com/login/oauth/authorize?scope=user&client_id=${GITHUB_CLIENT_ID}&redirect_uri=${location}`
      );
    }
  };

  return (
    <Button
      onClick={onHandleClick}
      baseColor={BaseColors.BLACK}
      disabled={disabled}
    >
      {showSpinner ? (
        <Spinner />
      ) : (
        <>
          <Github className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Sign in with GitHub
        </>
      )}
    </Button>
  );
};

export default SignInGithub;
