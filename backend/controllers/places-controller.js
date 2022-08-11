const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../util/location");
const mongoose = require("mongoose")
const Place = require('../models/place')
const User = require('../models/user');
const user = require("../models/user");


const getPlaceById = async (req, res, next) => {
  const pid = req.params.pid;
  let place;
  try{
    place = await Place.findById(pid)
  }
  catch(err){
    const error = new HttpError('something went wrong', 500)
    return next(error)
  }

  if (!place) {
    return next(new HttpError("No place with this id", 404));
  }
  res.json({ place: place.toObject( {getters: true} ) });
};

const getPlacesByUserId = async (req, res, next) => {
  const uid = req.params.uid;
  let userWithPlaces;
  try{
    userWithPlaces = await User.findById(uid).populate('places');
  }
  catch(err){
    const error = new HttpError('could not find places regarding this user', 500)
    return next(error)
  }

  if (!userWithPlaces) {
    return next(new HttpError("No place for this user id", 404));
  }
  res.json({ places: userWithPlaces.places.map(place => place.toObject({getters: true})) });
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
  const createdPlace = new Place({
    title,
    description,
    image: req.file.path,
    address,
    location: coordinates,
    creator
  })
  let user;
  try{
    user = await User.findById(creator)
  }
  catch(err){
    console.log(err)
    return next(new HttpError('Creating place failed, try again', 500))
  }

  if(!user){
    return next(new HttpError('No user with this id', 500))
  }
  console.log(user)
  try{
    const sess = await mongoose.startSession()
    sess.startTransaction();
    await createdPlace.save({session: sess})
    user.places.push(createdPlace)
    await user.save({session: sess})
    await sess.commitTransaction();
  }
  catch(err){
    const error = new HttpError('Creating place failed, please try again', 500)
    return next(error)
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Invalid inputs passed", 422));
  }

  const { title, description } = req.body;
  const pid = req.params.pid;
  let place;
  try{
    place = await Place.findById(pid);
  }
  catch(err){
    const error = new HttpError('Something wrong could not update', 500)
    return next(error)
  }

  if(place.creator.toString() !== req.userData.userId){
    const error = new HttpError('You are not allowed to do this', 401)
    return next(error)
  }
  
  place.title = title;
  place.description = description;
  
  try{
    await place.save();
  }
  catch(err){
    const error = new HttpError('Something went wrong while updating place', 500)
    return next(error)
  }

  res.status(200).json({ place: place.toObject({getter: true}) });
};


const deletePlace = async(req, res, next) => {
  const pid = req.params.pid;
  let place;
  try{
    place = await Place.findById(pid).populate('creator');
  }
  catch(err){
    const error = new HttpError('Something wrong, could not delete', 500)
    return next(error)
  }
  if(!place){
    return next(new HttpError("Could not find place with this id", 404))
  }

  if(place.creator.id !== req.userData.userId){
    return next(new HttpError("You are not allowed to do this", 401))
  }
  try {
    const sess = await mongoose.startSession()
    sess.startTransaction()
    await place.remove({session: sess})
    place.creator.places.pull(place)
    await place.creator.save({sesssion: sess})
    await sess.commitTransaction({session: sess})
  }
  catch(err){
    const error = new HttpError('Something wrong, could not delete', 500)
    return next(error)
  }
  res.status(200).json({ message: "place deleted" });
};
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
