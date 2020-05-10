import React from 'react';
import {gql, useMutation} from '@apollo/client';

//Style
import '../Style.css';

//Media
import RemoveImg from '../../media/remove.png';


//Remove Meme
const M_REMOVE_QUERY = gql`
    mutation RemMeme($memeID: ID!, $adminID: ID!, $adminToken: ID!) {
        removeMeme(memeID: $memeID, adminID: $adminID, adminToken: $adminToken) {
            msgInfo
        }
    }
`;


//Meme Remove
const MemeRemove = props => {
    //Props
    const {
        memeID,
        remElem,
    } = props;


    //Query
    const removeMeme = useMutation(M_REMOVE_QUERY, {onCompleted: (data) => memeRemoveCheck(data.removeMeme)});


    //Call
    const removeMemeCall = () => {
        const adminID = localStorage.getItem("userID");
        const adminToken = localStorage.getItem("userToken");
        removeMeme[0]({variables: {memeID, adminID, adminToken}});
    };


    //Check query result
    const memeRemoveCheck = (queryResult) => {
        if(queryResult.msgInfo !== "SUCCESS")
            alert(queryResult.msgInfo);
        remElem({type: 0, id: memeID});
    }


    //Return
    return (
        <img
            className="MemeAdminIcon clickable"
            src={RemoveImg}
            alt="MemeAdminRemove"
            onClick={() => {
                removeMemeCall();
            }}
        />
    );
}



export default MemeRemove;