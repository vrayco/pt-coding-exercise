import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import Button, { BaseColors } from "components/commons/Button";
import { signInCredentials } from "redux/authSlice";
import usersService from "services/usersService";
import useDebounce from "hooks/useDebounce";
import Input, { Types } from "./commons/Input";

const SignInForm = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { fetching, error } = useAppSelector((state) => state.auth); // TODO custom selectors instead of this?
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const debouncedEmail = useDebounce(email, 700);
  const [isValidEmail, setIsValidEmail] = useState<boolean | undefined>(
    undefined
  );

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    dispatch(signInCredentials({ email, password }));
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
    isValidEmail !== true;

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
            Sign in
          </Button>
        </div>
      </form>
    </>
  );
};

export default SignInForm;
