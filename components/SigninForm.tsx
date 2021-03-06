import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import Button, { BaseColors } from "components/commons/Button";
import { signInCredentials } from "redux/authSlice";
import usersService from "services/usersService";
import useDebounce from "hooks/useDebounce";
import Input, { Types } from "components/commons/Input";
import Spinner from "components/commons/Spinner";
import { SigninProviders } from "enums";

const SignInForm = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { fetching, error } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isValidEmail, setIsValidEmail] = useState<boolean | undefined>(true);
  const debouncedEmail = useDebounce(email, 700);

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    const valid = usersService.validateEmail(email);
    if (valid) {
      dispatch(signInCredentials({ email, password }));
    } else {
      setIsValidEmail(false);
    }
  };

  useEffect(() => {
    if (debouncedEmail) {
      setIsValidEmail(usersService.validateEmail(debouncedEmail));
    }
  }, [debouncedEmail]);

  useEffect(() => {
    setIsValidEmail(undefined);
  }, [email]);

  const disabled =
    fetching !== undefined ||
    email.length === 0 ||
    password.length === 0 ||
    isValidEmail === false;

  return (
    <>
      <div className="h-6 text-center">
        <p className="text-rose-500">{error}</p>
      </div>
      <form className="space-y-6">
        <Input
          id="email"
          type={Types.EMAIL}
          name="email"
          label="Email"
          value={email}
          onHandleChange={setEmail}
          error={isValidEmail === false ? "Email not valid" : undefined}
          autoFocus
          required
          autoComplete="off"
          onBlur={() => setIsValidEmail(usersService.validateEmail(email))}
        />

        <Input
          id="password"
          type={Types.PASSWORD}
          name="password"
          label="Password"
          value={password}
          onHandleChange={setPassword}
          required
        />

        <div>
          <Button
            onClick={handleSubmit}
            disabled={disabled}
            baseColor={BaseColors.GREEN}
          >
            {fetching === SigninProviders.CREDENTIALS ? <Spinner /> : "Sign in"}
          </Button>
        </div>
      </form>
    </>
  );
};

export default SignInForm;
