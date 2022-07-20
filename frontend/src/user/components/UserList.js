import React from "react";

import UserItem from "./UserItem";
import './UserList.css'
import Card from "../../shared/components/UIElements/Card";

const UserList = (props) => {
    if(props.items.length === 0){
        return <Card><h2>No user data found!</h2></Card>
    }
   
    return (<ul className="user-list">
        {
            props.items.map((user) => 
            <UserItem 
                key={user.id}
                id={user.id}
                image={user.image}
                name={user.name}
                placeCount={user.places}
            />)
        }
    </ul>)
}

export default UserList;