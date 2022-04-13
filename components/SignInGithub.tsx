import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { signInGithub } from "redux/authSlice";
import Github from "components/commons/icons/Github";
import Spinner from "./commons/Spinner";
import Button, { BaseColors } from "./commons/Button";
import { useRouter } from "next/router";
import { SigninProviders } from "enums";

type Props = {
  code: string | undefined;
};

const SignInGithub = ({ code }: Props): JSX.Element => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const fetching = useAppSelector((state) => state.auth.fetching); // TODO custom selectors instead of this?
  const [clicked, setClicked] = useState<boolean>(false);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (code && !fetching && !user) {
      dispatch(signInGithub(code));
    }
  }, [code, dispatch, fetching, user]);

  const disabled = fetching !== undefined || clicked;
  const showSpinner = fetching === SigninProviders.GITHUB || clicked;

  const onHandleClick = () => {
    if (!disabled) {
      setClicked(true);
      router.replace(
        `https://github.com/login/oauth/authorize?scope=user&client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&redirect_uri=${location}`
      );
    }
  };

  return (
    <>
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
    </>
  );
};

export default SignInGithub;
