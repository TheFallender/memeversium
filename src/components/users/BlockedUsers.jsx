import React, {useState, useEffect} from 'react';
import {gql, useLazyQuery} from '@apollo/client';

//Components
import User from './User';


//Style
import '../Style.css';


//Login query
const BLOCKED_USERS_QUERY = gql`
	query UserLog($adminID: ID!, $adminToken: ID!) {
        blockedUsers(adminID: $adminID, adminToken: $adminToken) {
            msgInfo
            user {
                _id
                user
                admin
                blocked
            }
        }
    }
`;


//Login JSX
const BlockedUsers = props => {
    //Props
    const {
        setBackground
    } = props;


    //Queries
    //Get blocked users
    const blockedUsers = useLazyQuery(BLOCKED_USERS_QUERY,  {
        fetchPolicy: "network-only",
        onCompleted: (data) => blockedUsersCheck(data.blockedUsers)
    });


    //Hooks
    const [users, setUsers] = useState(null);
    const [userToRemove, setUserToRemove] = useState(null);


    //Call on Start
    useEffect(() => {
        //Get the info from the cookies
        const adminID = localStorage.getItem("userID");
        const adminToken = localStorage.getItem("userToken");

        //Query
        blockedUsers[0]({variables: {adminID, adminToken}});
        // eslint-disable-next-line
    }, [])


    //Remove unblocked or removed user
    useEffect(() => {
        if (users)
            setUsers(users.filter(element => element.key !== userToRemove));
        // eslint-disable-next-line
    }, [userToRemove]);


    //Query for the Blocked Users done
    const blockedUsersCheck = (queryResult) => {
        if(queryResult.msgInfo !== "SUCCESS")
            alert(queryResult.msgInfo);
        else {
            let usersJSX = queryResult.user.map((element) => (
                <User key={element._id} data={element} remUser={setUserToRemove}/>
            ))
            setUsers(usersJSX);
        }
    }


    //Return
    return (
        <div className="Login">
            <label><b>Blocked Users List:</b></label>
            <button className="LoginClose" onClick={() => setBackground(null)}>X</button>
            {users}
        </div>
    );
}



export default BlockedUsers;