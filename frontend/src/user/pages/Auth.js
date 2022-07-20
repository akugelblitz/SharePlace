import React, { useState, useContext } from "react";
import "./Auth.css";
import { useForm } from "../../shared/hooks/form-hook";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
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
  const authSubmitHandler = (event) => {
    event.preventDefault();
    console.log(formState.inputs);
    auth.login();
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
    <Card className="authentication">
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
          validators={[VALIDATOR_MINLENGTH(4), VALIDATOR_MAXLENGTH(21)]}
          errorText="Password should be 4 to 21 characters long"
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
  );
};

export default Auth;
