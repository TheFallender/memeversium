import React, {useEffect, useState} from 'react';
import {gql, useLazyQuery} from '@apollo/client';

//Style
import '../Style.css';

//Media
import blockImg from '../../media/block.png'

//Block User
const U_BLOCK_QUERY = gql`
    query BlockUser($userID: ID!, $adminID: ID!, $adminToken: ID!) {
        blockUser(userID: $userID, adminID: $adminID, adminToken: $adminToken) {
            msgInfo
        }
    }
`;

//User Block
const UserBlock = props => {
    //Props
    const {
        userID,
        blocked,
        remElem,
    } = props;

    //Query
    //Toogle blocked user
    const blockUser = useLazyQuery(U_BLOCK_QUERY, {
        fetchPolicy: "network-only",
        onCompleted: (data) => blockedUserCheck(data.blockUser)
    });


    //Hooks
    const [userBlocked, setUserBlocked] = useState(false);


    //Run on Component mount
    useEffect(() => {
        //Set Meme best
        setUserBlocked(blocked);
        // eslint-disable-next-line
    }, []);


    //Call
    const blockUserCall = () => {
        const adminID = localStorage.getItem("userID");
        const adminToken = localStorage.getItem("userToken");
        blockUser[0]({variables: {userID, adminID, adminToken}});
    };


    //Query for the Blocked User done
    const blockedUserCheck = (queryResult) => {
        if(queryResult.msgInfo !== "SUCCESS")
            alert(queryResult.msgInfo);
        else {
            if (remElem)
                remElem(userID);
            setUserBlocked(!userBlocked);
        }
    }
    
    
    //Return
    return (
        <img 
            className={"MemeAdminIcon clickable" + (userBlocked === true ? "" : " MemeBestOff")}
            src={blockImg}
            alt="Block User"
            onClick={() => {blockUserCall(); }}
        />
    );
}



export default UserBlock;