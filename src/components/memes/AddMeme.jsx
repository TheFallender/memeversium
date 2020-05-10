import React, {useState, useEffect} from 'react';
import {gql, useMutation} from '@apollo/client';

//Style
import '../Style.css';


//Register query
const ADD_MEME = gql`
	mutation AddMeme($typedTitle: String!, $userID: ID!, $typedImage: String!, $token: ID!) {
        addMeme(title: $typedTitle, userID: $userID, image: $typedImage, token: $token) {
            msgInfo
        }
    }
`;


//Login JSX
const Register = props => {
    //Props
    const {
        setBackground
    } = props;


    //Queries
    const addMeme = useMutation(ADD_MEME);


    //Hooks for managing the state of the typed text
    const [typedTitle, setTypedTitle] = useState("");
    const [typedImage, setTypedImage] = useState("");
    

    //Handler to call the Query
    const submitHandler = (event) => {
        //Prevent page change
        event.preventDefault();

        //Check if the user is blocked
        const blocked = localStorage.getItem("userBlocked");
        if (blocked === "true"){
            alert("ERROR - You are blocked. If you think this is an error contact an administrator.");
            return false;
        }

        //Regex
        const regexToTest = /\.(jpeg|jpg|gif|png)$/;

        //Check if the fields are empty
        if (typedTitle === "" || typedImage === "") {
            alert("ERROR - Cannot leave empty fields.");
            return false;
        } else if (!regexToTest.test(typedImage)){
            alert("ERROR - Invalid Image.");
            return false;
        }

        //Get the info from the cookies
        const userID = localStorage.getItem("userID");
        const token = localStorage.getItem("userToken");

        //Lazy request the query
        addMeme[0]({variables: {typedTitle, userID, typedImage, token}});

        //Prevent page change
        return false;
    }

    
    //Detect the change of the Register when is requested
    useEffect(() => {
        if (!addMeme[1].loading && addMeme[1].called) {
            if (addMeme[1].data) {
                if (addMeme[1].data.addMeme.msgInfo !== "SUCCESS")
                    alert(addMeme[1].data.addMeme.msgInfo);
                else {
                    //Refresh window
                    window.location.reload(false);
                }
            }
        }
        // eslint-disable-next-line
    }, [addMeme])


    //Return
    return (
        <div className="Login">
            <label><b>Add a meme:</b></label>
            <button className="LoginClose" onClick={() => setBackground(null)}>X</button>
            <form className="LoginForm" onSubmit={(event) => submitHandler(event)}>
                <div className="LoginContainer">
                    <label>Title:</label>
                    <input
                        className="LoginInput"
                        type="text"
                        placeholder="Titletle"
                        value={typedTitle}
                        onChange={(e) => setTypedTitle(e.target.value)}/>
                </div>
                <div className="LoginContainer">
                    <label>Image URL:</label>
                    <input
                        className="LoginInput"
                        type="text"
                        placeholder="url.com/img.png"
                        value={typedImage}
                        onChange={(e) => setTypedImage(e.target.value)}/>
                </div>
                <button className="LoginButton clickable" type="submit">Submit</button>
                <input type="submit" hidden/>
            </form>
        </div>
    );
}



export default Register;