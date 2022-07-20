import React, { useContext } from "react";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import { useState } from "react";
import "./PlaceItem.css";
import { AuthContext } from "../../shared/context/auth-context";
const PlaceItem = (props) => {
  const auth = useContext(AuthContext);

  const [deletePressed, setDeletePressed] = useState(false);
  const deletePressedHandler = () => {
    setDeletePressed(!deletePressed);
  };
  const confirmDeleteHandler = () => {
    console.log("This component is deleted :p ");
  };
  // console.log(deletePressed);
  const mapsApi = "https://www.google.com/maps/search/?api=1&query=";
  console.log(`${mapsApi}${props.coordinates.lat}%2C${props.coordinates.lng}`);

  const placeDescElement = (
    <div>
      <div className="place-item__image">
        <img src={props.image} alt={props.title} />
      </div>
      <div className="place-item__info">
        <h2>{props.title}</h2>
        <h3>{props.address}</h3>
        <p>{props.description}</p>
      </div>
    </div>
  );

  const getRegularButtons = () => {
    return (
      <div>
        <Button
          inverse
          href={`${mapsApi}${props.coordinates.lat}%2C${props.coordinates.lng}`}
        >
          VIEW ON MAP
        </Button>
        {auth.isLoggedIn && <Button to={`/places/${props.id}`}>EDIT</Button>}
        {auth.isLoggedIn && (
          <Button danger onClick={deletePressedHandler}>
            DELETE
          </Button>
        )}
      </div>
    );
  };
  const getDeleteButtons = () => {
    return (
      <div>
        <Button>Confirm Delete?</Button>
        <Button danger onClick={confirmDeleteHandler}>
          YES
        </Button>
        <Button inverse onClick={deletePressedHandler}>
          NO
        </Button>
      </div>
    );
  };
  const regularButtons = getRegularButtons();
  const deleteButtons = getDeleteButtons();

  const buttonsElement = deletePressed ? deleteButtons : regularButtons;
  return (
    <li className="place-item">
      <Card className="place-item__content">
        <div className="place-item__actions">
          {placeDescElement}
          {buttonsElement}
        </div>
      </Card>
    </li>
  );
};

export default PlaceItem;
