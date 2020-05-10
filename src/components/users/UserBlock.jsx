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
    const blockUser = useLazyQuery(U_BLOCK_QUERY, {fetchPolicy: "network-only"});


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

    //Check query result
    useEffect(() => {
        if (blockUser[1].data) {
            if(blockUser[1].data.blockUser.msgInfo !== "SUCCESS")
                alert(blockUser[1].data.blockUser.msgInfo);
            else {
                if (remElem)
                    remElem(userID);
                setUserBlocked(!userBlocked);
            }
        }
        // eslint-disable-next-line
    }, [blockUser])

    
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