import React, { useState, useContext } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "./Auth.css";
import { useForm } from "../../shared/hooks/form-hook";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MAXLENGTH,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import "../../places/pages/PlaceForm.css";

const Auth = () => {
  const auth = useContext(AuthContext);
  const [authMode, setAuthMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const switchModeHandler = () => {
    if (!authMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
        },
        false
      );
    }
    setAuthMode(!authMode);
  };
  const authSubmitHandler = async (event) => {
    event.preventDefault();
    if (authMode) {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/users/login",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),

          { "Content-Type": "application/json" }
        );

        auth.login(responseData.user.id);
      } catch (err) {}
    } else {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/users/signup",
          "POST",
          JSON.stringify({
            name: formState.inputs.name.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),

          { "Content-Type": "application/json" }
        );

        auth.login(responseData.user.id);
      } catch (err) {}
    }
  };
  const getNameElement = () => {
    return (
      <div>
        <Input
          id="name"
          element="input"
          type="text"
          label="Name"
          validators={[VALIDATOR_MAXLENGTH(50), VALIDATOR_REQUIRE()]}
          errorText="Fix your name bro"
          onInput={inputHandler}
        />
      </div>
    );
  };
  const nameElement = getNameElement();

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2 className="authentication__header">Login Required</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!authMode && nameElement}
          <Input
            id="email"
            element="input"
            type="email"
            label="Email"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email address"
            onInput={inputHandler}
          />
          <Input
            id="password"
            element="input"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(6), VALIDATOR_MAXLENGTH(21)]}
            errorText="Password should be 6 to 21 characters long"
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {authMode ? "LOGIN" : "SIGNUP"}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          {!authMode ? "LOGIN" : "SIGNUP"}
        </Button>
      </Card>
    </>
  );
};

export default Auth;
