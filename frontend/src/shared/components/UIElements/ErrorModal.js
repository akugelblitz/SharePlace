import React from "react";

import Button from "../FormElements/Button";
import Card from "./Card";

const ErrorModal = (props) => {
  const getErrorCard = () => {
    return (
      <Card className={"error"}>
        <p>{props.error}</p>
      </Card>
    );
  };
  const errorCard = getErrorCard();
  const val = props.error !== null;
  return (
    <>
    {val && errorCard}
    </>
  )
};

export default ErrorModal;
