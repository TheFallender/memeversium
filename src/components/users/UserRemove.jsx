import React from 'react';
import {gql, useMutation} from '@apollo/client';

//Style
import '../Style.css';

//Media
import userRemoveImg from '../../media/userRemove.png'

//Remove User
const U_REMOVE_QUERY = gql`
    mutation BlockUser($userID: ID!, $adminID: ID!, $adminToken: ID!) {
        removeUser(userID: $userID, adminID: $adminID, adminToken: $adminToken) {
            msgInfo
        }
    }
`;

//User Remove
const UserRemove = props => {
    //Props
    const {
        userID,
        memeID,
        remElem,
    } = props;

    
    //Query
    const removeUser = useMutation(U_REMOVE_QUERY, {onCompleted: (data) => userRemovedCheck(data.removeUser)});


    //Call
    const removeUserCall = () => {
        //Get admin tokens
        const adminID = localStorage.getItem("userID");
        const adminToken = localStorage.getItem("userToken");

        //Remove the user
        removeUser[0]({variables: {userID, adminID, adminToken}});
    };


    //Query check for the Removed User 
    const userRemovedCheck = (queryResult) => {
        if(queryResult.msgInfo !== "SUCCESS")
            alert(queryResult.msgInfo);
        else {
            if (memeID)
                remElem({type: 2, id: userID});
            else
                remElem(userID);
        }
    }


    //Return
    return (
        <img
            className="MemeAdminIcon clickable"
            src={userRemoveImg}
            alt="Remove User"
            onClick={() => removeUserCall()}
        />
    );
}



export default UserRemove;