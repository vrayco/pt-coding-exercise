import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import Button from "components/commons/Button";
import { signIn } from "redux/authSlice";
import findByCredentials from "services/usersService";
import useDebounce from "hooks/useDebounce";
import Input, { Types } from "./commons/Input";

const SignInForm = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { fetching, error } = useAppSelector((state) => state.auth); // TODO custom selectors instead of this?
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const debouncedEmail = useDebounce(email, 700);
  const [validEmail, setValidEmail] = useState<boolean | undefined>(undefined);

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    dispatch(signIn({ email, password }));
  };

  useEffect(() => {
    if (debouncedEmail && debouncedEmail.length > 0) {
      setValidEmail(findByCredentials.validateEmail(debouncedEmail));
    }
  }, [debouncedEmail]);

  useEffect(() => {
    setValidEmail(undefined);
  }, [email]);

  const submitButtonEnable: boolean =
    !fetching && email.length > 0 && password.length > 0 && validEmail === true;

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
          error={validEmail === false ? "Email not valid" : undefined}
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
            label={"Sign in"}
            onClick={handleSubmit}
            disabled={!submitButtonEnable}
          />
        </div>
      </form>
    </>
  );
};

export default SignInForm;
