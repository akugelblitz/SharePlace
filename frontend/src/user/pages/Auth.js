import React, { useState, useContext } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "./Auth.css";
import { useForm } from "../../shared/hooks/form-hook";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

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
          image: undefined,
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
          image: {
            value: null,
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
    console.log(formState.inputs);
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

        auth.login(responseData.userId, responseData.token);
      } catch (err) {}
    } else {
      try {
        const formData = new FormData();
        formData.append("email", formState.inputs.email.value);
        formData.append("name", formState.inputs.name.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("image", formState.inputs.image.value);
        const responseData = await sendRequest(
          "http://localhost:5000/api/users/signup",
          "POST",
          formData
        );

        auth.login(responseData.userId, responseData.token);
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
  const getLoginHeader = () => {
    return (
      <div className="authentication__header">
        <h2>Welcome Back</h2>
        <p>Log into your account</p>
      </div>
    );
  };
  const getSignupHeader = () => {
    return (
      <div className="authentication__header">
        <h2>Welcome</h2>
        <p>Create a new account</p>
      </div>
    );
  };
  const nameElement = getNameElement();
  const loginHeader = getLoginHeader();
  const signupHeader = getSignupHeader();

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        {authMode && loginHeader}
        {!authMode && signupHeader}
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!authMode && nameElement}
          {!authMode && (
            <ImageUpload
              id="image"
              onInput={inputHandler}
              errorText="Please provide an image"
            />
          )}

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
