const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../util/location");
let DUMMY_PLACES = [
  {
    id: "p1",
    title: "Stella Maris inter",
    description: "My first school",
    location: {
      lat: 14.7888818,
      lng: 56.8989898,
    },
    address: "fi",
    creator: "u1",
  },
  {
    id: "p2",
    title: "Burj Khalifa",
    description: "tallest building",
    location: {
      lat: 15.1414151,
      lng: 89.9898989,
    },
    address: "samp",
    creator: "u2",
  },
];

const getPlaceById = (req, res, next) => {
  const pid = req.params.pid;
  const place = DUMMY_PLACES.find((p) => {
    return p.id == pid;
  });
  if (!place) {
    return next(new HttpError("No place with this id", 404));
  }
  res.json({ place });
};

const getPlacesByUserId = (req, res, next) => {
  const uid = req.params.uid;
  const places = DUMMY_PLACES.filter((p) => {
    return p.creator == uid;
  });
  if (!places || places.length === 0) {
    return next(new HttpError("No place for this user id", 404));
  }
  res.json({ places });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Invalid inputs passed", 422));
  }

  const { title, description, address, creator } = req.body;
  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }
  const createdPlace = {
    id: uuidv4(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };
  DUMMY_PLACES.push(createdPlace);

  res.status(201).json({ place: createdPlace });
};

const updatePlace = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Invalid inputs passed", 422));
  }

  const { title, description } = req.body;
  const pid = req.params.pid;
  const updatedPlace = {
    ...DUMMY_PLACES.find((place) => {
      return place.id == pid;
    }),
  };

  const placeIndex = DUMMY_PLACES.findIndex((place) => {
    return place.id == pid;
  });
  updatedPlace.title = title;
  updatedPlace.description = description;

  DUMMY_PLACES[placeIndex] = updatedPlace;

  res.status(200).json({ place: updatedPlace });
};

// const updatePlace = (req, res, next) => {
//     // const
// }

const deletePlace = (req, res, next) => {
  const pid = req.params.pid;
  if (!DUMMY_PLACES.find((p) => pid === p.id)) {
    return next(new HttpError("place doesnt exist", 404));
  }
  DUMMY_PLACES = DUMMY_PLACES.filter((p) => pid !== p.id);
  res.status(200).json({ message: "place deleted" });
};
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
