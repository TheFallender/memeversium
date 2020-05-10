import React, {useState} from 'react';
import {gql, useLazyQuery} from '@apollo/client';

//Style
import '../Style.css';


//Require Bcrypt
const bcrypt = require('bcryptjs');


//Login query
const LOGIN_QUERY = gql`
	query UserLog($typedEmail: String!, $passwordSalted: String!) {
        userLogin(email: $typedEmail, password: $passwordSalted) {
            msgInfo
            data
            user {
                _id
                user
                admin
                blocked
            }
        }
    }
`;


//Salt query
const SALT_QUERY = gql`
	query GetSalt($typedEmail: String!) {
        getSalt(email: $typedEmail) {
            msgInfo
            data
        }
    }
`;

//Login JSX
const Login = props => {
    //Props
    const {
        setBackground
    } = props;


    //Queries
    const login = useLazyQuery(LOGIN_QUERY,  {fetchPolicy: "network-only", onCompleted: (data) => loginCheck(data.userLogin)});
    const saltGet = useLazyQuery(SALT_QUERY,  {fetchPolicy: "network-only", onCompleted: (data) => sendLogin(data.getSalt)});


    //Hooks for managing the state of the typed text
    const [typedEmail, setTypedEmail] = useState("");
    const [typedPwd, setTypedPwd] = useState("");


    //Handler to call the Query
    const submitHandler = (event) => {
        //Prevent page change
        event.preventDefault();

        //Regex
        const regexToTest = /\S+@\S+\.\S+/;

        //Check if the fields are empty
        if (typedEmail === "" || typedPwd === "") {
            alert("ERROR - Cannot leave empty fields.");
            return false;
        } else if (!regexToTest.test(typedEmail)){
            alert("ERROR - Invalid Email.");
            return false;
        }

        //Lazy request the query for the salt
        saltGet[0]({variables: {typedEmail}});

        //Prevent page change
        return false;
    }


    //Send Login
    const sendLogin = (queryResult) => {
        if (queryResult.msgInfo !== "SUCCESS")
            alert(queryResult.msgInfo);
        else {
            //Encrypt using the salt
            const passwordSalted = bcrypt.hashSync(typedPwd, queryResult.data[0]);

            //Lazy request the query
            login[0]({variables: {typedEmail, passwordSalted}});
        }
    }


    //Check Login Result
    const loginCheck = (queryResult) => {
        if (queryResult.msgInfo !== "SUCCESS")
            alert(queryResult.msgInfo);
        else {
            //Create cookies
            localStorage.setItem("userID", queryResult.user[0]._id);
            localStorage.setItem("userUsername", queryResult.user[0].user);
            localStorage.setItem("userAdmin", queryResult.user[0].admin);
            localStorage.setItem("userBlocked", queryResult.user[0].blocked);
            localStorage.setItem("userToken", queryResult.data[0]);
            
            //Refresh window
            window.location.reload(false);
        }
    }


    //Return
    return (
        <div className="Login">
            <label><b>Login:</b></label>
            <button className="LoginClose" onClick={() => setBackground(null)}>X</button>
            <form className="LoginForm" onSubmit={(event) => submitHandler(event)}>
                <div className="LoginContainer">
                    <label htmlFor="username">Email:</label>
                    <input
                        className="LoginInput"
                        type="text"
                        id="username"
                        name="username"
                        placeholder="example@where.com"
                        value={typedEmail}
                        onChange={(e) => setTypedEmail(e.target.value)}/>
                </div>
                <div className="LoginContainer">
                    <label htmlFor="pass">Password:</label>
                    <input
                        className="LoginInput"
                        type="password"
                        id="pass"
                        name="password"
                        placeholder="***********"
                        value={typedPwd}
                        onChange={(e) => setTypedPwd(e.target.value)}/>
                </div>
                <button className="LoginButton clickable" type="submit">Submit</button>
                <input type="submit" hidden/>
            </form>
        </div>
    );
}



export default Login;