import React, {useEffect, useState} from 'react';
import {gql, useLazyQuery} from '@apollo/client';

//Style
import '../Style.css';

//Media
import BestImg from '../../media/best.png';

//Best Meme
const M_BESTMEME_QUERY = gql`
	query BestMeme($memeID: ID!, $adminID: ID!, $adminToken: ID!) {
        selectAsBestMeme(memeID: $memeID, adminID: $adminID, adminToken: $adminToken) {
            msgInfo
        }
    }
`;

//User Block
const MemeSelectBest = props => {
    //Props
    const {
        memeID,
        best,
        remElem,
    } = props;

    //Query
    const bestMeme = useLazyQuery(M_BESTMEME_QUERY, {fetchPolicy: "network-only"});


    //Hooks
    const [memeBest, setMemeBest] = useState(false);


    //Run on Component mount
    useEffect(() => {
        //Set Meme best
        setMemeBest(best);
        // eslint-disable-next-line
    }, []);


    //Call
    const selectBestCall = () => {
        const adminID = localStorage.getItem("userID");
        const adminToken = localStorage.getItem("userToken");
        bestMeme[0]({variables: {memeID, adminID, adminToken}});
    };


    //Check query result
    useEffect(() => {
        if (bestMeme[1].data)
            if(bestMeme[1].data.selectAsBestMeme.msgInfo !== "SUCCESS")
                alert(bestMeme[1].data.selectAsBestMeme.msgInfo);
            else if (remElem)
                if (!memeBest)
                    remElem({type: 1, id: memeID});
        // eslint-disable-next-line
    }, [bestMeme])


    //Return
    return (
        <img 
            className={"MemeAdminIcon clickable" + (memeBest === true ? "" : " MemeBestOff")}
            src={BestImg}
            alt={"MemeBestImg"}
            onClick={() => {
                if (localStorage.getItem("userAdmin") === "true") {
                    selectBestCall();
                    setMemeBest(!memeBest);
                }
            }}
        />
    );
}



export default MemeSelectBest;