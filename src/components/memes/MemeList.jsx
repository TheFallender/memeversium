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
    const listMemes = useLazyQuery(M_LIST_QUERY, {fetchPolicy: "network-only"});
    const listBest = useLazyQuery(M_BEST_QUERY, {fetchPolicy: "network-only"});
    const listLast = useLazyQuery(M_LAST_QUERY, {fetchPolicy: "network-only"});
    const listUserMemes = useLazyQuery(M_USER_QUERY, {fetchPolicy: "network-only"});


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
    useEffect(() => {
        let memesJSX = null;

        switch(memeListType) {
            //Meme list
            case 0:
                if (listMemes[1].data)
                    memesJSX = listMemes[1].data.memeList.meme;
                break;
            //Best memes
            case 1:
                if (listBest[1].data)
                    memesJSX = listBest[1].data.bestMemesList.meme;
                break;
            //Last memes
            case 2:
                if (listLast[1].data)
                    memesJSX = listLast[1].data.lastMemesList.meme;
                break;
            //User memes
            case 3:
                if (listUserMemes[1].data)
                    if(listUserMemes[1].data.userMemes.msgInfo !== "SUCCESS")
                        alert(listUserMemes[1].data.userMemes.msgInfo);
                    else
                        memesJSX = listUserMemes[1].data.userMemes.meme;
                break;
            default:
                setMemes(null);
        }

        //Only if it has data
        if (memesJSX) {
            let userIsAdmin = localStorage.getItem("userAdmin");
            memesJSX = memesJSX.map((element) => (
                <Meme
                    key={element._id}
                    data={element}
                    isAdmin={userIsAdmin}
                    remElem={setMemeUpdated}
                    userMemes={userMemesCall}
                />
            ));
            setMemes(memesJSX);
        }
        // eslint-disable-next-line
    }, [listMemes, listBest, listLast, listUserMemes]);


    //Remove meme check
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