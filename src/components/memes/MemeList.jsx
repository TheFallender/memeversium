import React, {useState, useEffect} from 'react';
import {gql, useLazyQuery} from '@apollo/client';

//Components
import Meme from './Memes'

//Style
import '../Style.css';

//Memes query
const M_LIST_QUERY = gql`
	query {
        memeList {
            msgInfo
            meme {
                _id
                title
                image
                date
                best
                user {
                    _id
                    user
                    blocked
                }
            }
        }
    }
`;



//Best memes query
const M_BEST_QUERY = gql`
	query {
        bestMemesList {
            msgInfo
            meme {
                _id
                title
                image
                date
                best
                user {
                    _id
                    user
                    blocked
                }
            }
        }
    }
`;



//Last memes query
const M_LAST_QUERY = gql`
	query {
        lastMemesList {
            msgInfo
            meme {
                _id
                title
                image
                date
                best
                user {
                    _id
                    user
                    blocked
                }
            }
        }
    }
`;



//Best memes query
const M_USER_QUERY = gql`
	query UserMemes($userID: ID!){
        userMemes(userID: $userID) {
            msgInfo
            meme {
                _id
                title
                image
                date
                best
                user {
                    _id
                    user
                    blocked
                }
            }
        }
    }
`;

//Block User

//Meme List
const MemeList = props => {
    //Queries
    //Base memes list
    const listMemes = useLazyQuery(M_LIST_QUERY, {
        fetchPolicy: "network-only",
        onCompleted: (data) => updateMemeList(data.memeList)
    });
    //Best memes list
    const listBest = useLazyQuery(M_BEST_QUERY, {
        fetchPolicy: "network-only",
        onCompleted: (data) => updateMemeList(data.bestMemesList)
    });
    //Last memes list
    const listLast = useLazyQuery(M_LAST_QUERY, {
        fetchPolicy: "network-only",
        onCompleted: (data) => updateMemeList(data.lastMemesList)
    });
    //User list memes
    const listUserMemes = useLazyQuery(M_USER_QUERY, {
        fetchPolicy: "network-only",
        onCompleted: (data) => updateMemeList(data.userMemes)
    });


    //Hooks
    const [memeListType, setMemeListType] = useState(0);
    const [memes, setMemes] = useState(null);
    const [memeUpdated, setMemeUpdated] = useState(null);


    //First time Call
    useEffect(() => {
        listMemes[0]();
        // eslint-disable-next-line
    }, [])


    //Update when they are changed
    const updateMemeList = (queryResult) => {
        //Check that the query was successfull
        console.log("CALLED")
        if(queryResult.msgInfo !== "SUCCESS")
            alert(queryResult.msgInfo);
        else {
            let userIsAdmin = localStorage.getItem("userAdmin");
            setMemes(
                queryResult.meme.map((element) => (
                    <Meme
                        key={element._id}
                        data={element}
                        isAdmin={userIsAdmin}
                        remElem={setMemeUpdated}
                        userMemes={userMemesCall}
                    />
                ))
            )
        }
    }


    //Remove meme when requested
    useEffect(() => {
        if (memeUpdated) {
            //Meme Deleted
            if (memeUpdated.type === 0) {
                setMemes(memes.filter(element => element.key !== memeUpdated.id));
                setMemeUpdated(null);
            }
            //Meme Best removed
            else if(memeUpdated.type === 1 && memeListType === 1) {
                setMemes(memes.filter(element => element.key !== memeUpdated.id));
                setMemeUpdated(null);
            }
            //User removed
            else if(memeUpdated.type === 2) {
                setMemes(memes.filter(element => element.props.data.user._id !== memeUpdated.id));
                setMemeUpdated(null);
            }
        }
        // eslint-disable-next-line
    }, [memeUpdated])



    //User query
    const userMemesCall = (userID) => {
        setMemeListType(3);
        listUserMemes[0]({variables: {userID}});
    }


    //Return
    return (
        <div className="MemeList">
            <div className="MemeListTypes selectDisable">
                <div className={"MemeListType clickable" + (memeListType === 0 ? " MemeListSelected": "")}
                onClick={() => {setMemeListType(0); listMemes[0]();}}>
                    <b>Memes</b>
                </div>
                <div className={"MemeListType clickable" + (memeListType === 1 ? " MemeListSelected": "")}
                onClick={() => {setMemeListType(1); listBest[0]();}}>
                    <b>Best Memes</b>
                </div>
                <div className={"MemeListType clickable" + (memeListType === 2 ? " MemeListSelected": "")}
                onClick={() => {setMemeListType(2); listLast[0]();}}>
                    <b>Latest Memes</b>
                </div>
            </div>
            <div className="MemeListData">
                {memes}
            </div>
        </div>
    );
}



export default MemeList;