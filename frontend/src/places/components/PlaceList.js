import React from "react";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import PlaceItem from "./PlaceItem";
import "./PlaceList.css";

const PlaceList = (props) => {
  const getNoPlaceCard = () => {
    return (
      <div className="place-list center">
        <Card>
          <div className="place-list">
            <h2>No places found. Maybe create one?</h2>
            <Button to="/places/new">Share Place</Button>
          </div>
        </Card>
      </div>
    );
  };
  const getPlacesList = () => {
    return (
      <ul className="place-list">
        {props.items.map((place) => (
          <PlaceItem
            key={place.id}
            id={place.id}
            image={place.image}
            title={place.title}
            description={place.description}
            address={place.address}
            creatorId={place.creator}
            coordinates={place.location}
            onDelete={props.onDeletePlace}
          />
        ))}
      </ul>
    );
  };
  let places;
  if (props.items.length === 0) {
    places = getNoPlaceCard();
  }else{
    places = getPlacesList();
  }

  return <>{places}</>;
};

export default PlaceList;
