import React, { useEffect, useState } from 'react';
import MemeSelectBest from './MemeSelectBest';
import MemeRemove from './MemeRemove';
import UserBlock from '../users/UserBlock';
import UserRemove from '../users/UserRemove';

//Style
import '../Style.css';


//Meme
const Meme = props => {
    const {
        _id,
        title,
        image,
        date,
        best,
        user,
    } = props.data;


    //Hooks
    const [dateFormated, setDateFormated] = useState("");


    //Run on Component mount
    useEffect(() => {
        const dateFormat = new Date(Number(date));
        const dateFormated = 
            dateFormat.getFullYear() + "/" +
            (dateFormat.getMonth() + 1) + "/" +
            dateFormat.getDate() + " " +
            dateFormat.getHours() + ":" +
            dateFormat.getMinutes();
        setDateFormated(dateFormated);
        // eslint-disable-next-line
    }, []);


    //Return
    return (
        <div className="Meme">
            <div className="MemeInfo">
                <label style={{marginLeft: "10px"}}><b>{title}</b></label>
                <label> by </label>
                <label className="clickable" onClick={() => props.userMemes(user._id)}><u><b>{user.user}</b></u></label>
                <div className="MemeIcons">
                    <MemeSelectBest memeID={_id} best={best} remElem={props.remElem}/>
                    {props.isAdmin === "true" ? 
                        <MemeRemove memeID={_id} remElem={props.remElem}/>
                    : null}
                </div>
                {props.isAdmin === "true" ? 
                    <span className="MemeAdminUser">
                        <UserBlock userID={user._id} blocked={user.blocked}/>
                        <UserRemove userID={user._id} memeID={_id} remElem={props.remElem}/>
                    </span>
                : null}
                <label style={{position: "absolute", right: "1%", top: "1%"}}>{dateFormated}</label>
            </div>
            <div style={{width: "100%", padding: "20px", boxSizing: "border-box"}}>
                <img className="MemeImg" src={image} alt={"MemeImg" + title}/>
            </div>
        </div>
    );
}

export default Meme;