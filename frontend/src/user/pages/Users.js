import React from "react";
import UserList from "../components/UserList";

const Users = () => {
    const USERS=[
        {id: 'u1', name: 'Aditya', image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.yFCR6QwAkTwxB-KgLlIX1AHaFj%26pid%3DApi&f=1', places: 73},
        {id: 'u2', name: 'Paarth', image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.EMcf0oL_iwVyIy4tfu3mzwHaE6%26pid%3DApi&f=1', places: 24},
        {id: 'u3', name: 'Tapu', image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.ayObikxrtHq6PwqXxUCB0AHaFk%26pid%3DApi&f=1', places: 56},
    ]

    return (<div className="center">
        <UserList items={USERS}/>
        </div>);
};

export default Users