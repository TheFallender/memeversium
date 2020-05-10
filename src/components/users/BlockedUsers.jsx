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
    const blockedUsers = useLazyQuery(BLOCKED_USERS_QUERY,  {fetchPolicy: "network-only"});


    //Hooks
    const [users, setUsers] = useState(null);
    const [userToRemove, setUserToRemove] = useState(null);

    
    //Remove unblocked or removed user
    useEffect(() => {
        if (users)
            setUsers(users.filter(element => element.key !== userToRemove));
        // eslint-disable-next-line
    }, [userToRemove]);


    //Handler to call the Query
    useEffect(() => {
        //Get the info from the cookies
        const adminID = localStorage.getItem("userID");
        const adminToken = localStorage.getItem("userToken");

        blockedUsers[0]({variables: {adminID, adminToken}});
        // eslint-disable-next-line
    }, [])


    //Detect the change of the Login when is requested
    useEffect(() => {
        if (blockedUsers[1].data) {
            if (blockedUsers[1].data.blockedUsers.msgInfo !== "SUCCESS")
                alert(blockedUsers[1].data.blockedUsers.msgInfo);
            else {
                let usersJSX = blockedUsers[1].data.blockedUsers.user.map((element) => (
                    <User key={element._id} data={element} remUser={setUserToRemove}/>
                ))
                setUsers(usersJSX);
            }
        }
        // eslint-disable-next-line
    }, [blockedUsers])


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