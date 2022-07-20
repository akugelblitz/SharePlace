import React from 'react';
import { useParams } from 'react-router-dom';
import PlaceList from '../components/PlaceList';

const DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Stella Maris Inter College',
    description: 'The school I attended!',
    imageUrl: 'https://lh5.googleusercontent.com/p/AF1QipPYGtbZYCkTySBCve_QrZKUmCZWmjzZrFV_-CYJ=w408-h306-k-no',
    address: 'QWV4+Q6M, Kanpur - Lucknow Rd, Sector H, LDA Colony, Lucknow, Uttar Pradesh 226012',
    location: {
      lat: 26.794640966778843,
      lng: 80.90553686896723
    },
    creator: 'u1'
  },
  {
    id: 'p2',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers in the world!',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
    address: '20 W 34th St, New York, NY 10001',
    location: {
      lat: 40.7484405,
      lng: -73.9878584
    },
    creator: 'u2'
  }
];

const UserPlaces = () => {
  const uid = useParams().uid;
  const loadedPlaces = DUMMY_PLACES.filter(place => place.creator === uid)
  return <PlaceList items={loadedPlaces} />;
};

export default UserPlaces;