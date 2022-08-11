import React, { useContext } from "react";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import { useState } from "react";
import "./PlaceItem.css";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const PlaceItem = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);

  const [deletePressed, setDeletePressed] = useState(false);
  const deletePressedHandler = () => {
    setDeletePressed(!deletePressed);
  };
  const confirmDeleteHandler = async () => {
    try {
      // clearError()
      await sendRequest(
        `http://localhost:5000/api/places/${props.id}`,
        "DELETE", null, {
          Authorization: 'Bearer ' + auth.token
        }
      );
      props.onDelete(props.id);
    } catch (err) {}
  };
  // console.log(deletePressed);
  // const mapsApi = "https://www.google.com/maps/search/?api=1&query=";
  // console.log(`${mapsApi}${props.coordinates.lat}%2C${props.coordinates.lng}`);

  const placeDescElement = (
    <div>
      <div className="place-item__image">
        <img src={`http://localhost:5000/${props.image}`} alt={props.title} />
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
          href={props.location}
        >
          VIEW ON MAP
        </Button>
        {auth.userId === props.creatorId && <Button to={`/places/${props.id}`}>EDIT</Button>}
        {auth.userId === props.creatorId && (
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
    <>
      <ErrorModal error={error} onClear={clearError}></ErrorModal>
      <li className="place-item">
        <Card className="place-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="place-item__actions">
            {placeDescElement}
            {buttonsElement}
          </div>
        </Card>
      </li>
    </>
  );
};

export default PlaceItem;
