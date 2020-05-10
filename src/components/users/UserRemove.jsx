import React, {useEffect} from 'react';
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
    const removeUser = useMutation(U_REMOVE_QUERY);

    //Call
    const removeUserCall = () => {
        const adminID = localStorage.getItem("userID");
        const adminToken = localStorage.getItem("userToken");
        removeUser[0]({variables: {userID, adminID, adminToken}});
    };

    //Check query result
    useEffect(() => {
        if (removeUser[1].data) {
            if(removeUser[1].data.removeUser.msgInfo !== "SUCCESS")
                alert(removeUser[1].data.removeUser.msgInfo);
            else if (remElem) {
                if (memeID)
                    remElem({type: 2, id: userID});
                else
                    remElem(userID);
            }
        }
        // eslint-disable-next-line
    }, [removeUser])


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