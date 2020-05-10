import React, { useState } from 'react';

//Components
import Login from './Login';
import Register from './Register';
import Logout from './Logout';
import AddMeme from '../memes/AddMeme'
import BlockedUsers from '../users/BlockedUsers'

//Style
import '../Style.css';


//Media
import logo from '../../media/logo.png'
import git from '../../media/github.png'


//Header
const Header = props => {
    //Hook for showing the background when needed
    const [popUp, setPopUp] = useState(null);

    
    //Show popUp with background
    let popUpJSX = null;
    if (popUp)
        popUpJSX =
            <div>
                <div className="PopUpBackground" onClick={() => setPopUp(null)}/>
                {popUp}
            </div>;


    //Logged or not menu
    let logMenuJSX =
        <div className="HeaderLogin">
            <div><b>Hi there, you can do the following:</b></div>
            <div className="HeaderLoginOptions">
                <button className="HeaderLoginOption clickable" onClick={() => setPopUp(
                        <Login setBackground={setPopUp}/>
                )}>Login</button>
                <button className="HeaderLoginOption clickable" onClick={() => setPopUp(
                        <Register setBackground={setPopUp}/>
                )}>Register</button>
            </div>
        </div>;
    if (localStorage.getItem("userID"))
        logMenuJSX =
            <div className="HeaderLogin">
                <label><b>Welcome back {localStorage.getItem("userUsername")}</b></label>
                <div className="HeaderLoginOptions">
                    <button className="HeaderLoginOption clickable" onClick={() => setPopUp(
                        <AddMeme setBackground={setPopUp}/>
                    )}>Add Meme</button>
                    {localStorage.getItem("userAdmin") === "true" ?
                        <button className="HeaderLoginOption clickable" onClick={() => setPopUp(
                            <BlockedUsers setBackground={setPopUp}/>
                        )}>Blocked Users</button>
                    : null}
                    <Logout/>
                </div> 
            </div>;

    
    //Return
    return (
        <div className="Header">
            <div className="HeaderBack">
                <a href="." className="HeaderBanner noDec">
                    <img className="HeaderLogo" src={logo} alt={"logo-pic"}/>
                    <h1 className="HeaderText"onClick={(e) => {props.updateResponse(""); props.clickedOnVideo("")}}>Memeversium</h1>
                </a>
                <a className="HeaderGithub" href="https://github.com/TheFallender" style={{height: "100%"}}>
                    <img className="HeaderLogo" src={git} alt={"git-pic"}/>
                </a>
            </div>
            {logMenuJSX}
            {popUpJSX}
        </div>
    );
}

export default Header;