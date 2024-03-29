import React, {useState} from 'react';
import {gql, useMutation} from '@apollo/client';

//Style
import '../Style.css';

//Require Bcrypt
const bcrypt = require('bcryptjs');

//Register query
const REGISTER_QUERY = gql`
	mutation UserRegister($typedUser: String!, $typedEmail: String!, $passwordSalt: String!, $salt: String!) {
        addUser(user: $typedUser, email: $typedEmail, password: $passwordSalt, salt: $salt) {
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
    const register = useMutation(REGISTER_QUERY, {onCompleted: (data) => registerCheck(data.addUser)});


    //Hooks for managing the state of the typed text
    const [typedEmail, setTypedEmail] = useState("");
    const [typedUser, setTypedUser] = useState("");
    const [typedPwd, setTypedPwd] = useState("");
    

    //Handler to call the Query
    const submitHandler = (event) => {
        //Prevent page change
        event.preventDefault();

        //Regex
        const regexToTest = /\S+@\S+\.\S+/;

        //Check if the fields are empty
        if (typedEmail === "" || typedPwd === "" || typedUser === "") {
            alert("ERROR - Cannot leave empty fields.");
            return false;
        } else if (!regexToTest.test(typedEmail)){
            alert("ERROR - Invalid Email.");
            return false;
        } else if (typedPwd.length < 8) {
            alert("ERROR - Password should be of at least 8 characters.");
            return false;
        }

        //Password crypt
        const salt = bcrypt.genSaltSync()
        const passwordSalt = bcrypt.hashSync(typedPwd, salt)

        //Lazy request the query
        register[0]({variables: {typedUser, typedEmail, passwordSalt, salt}});

        //Prevent page change
        return false;
    }
    
    
    //Detect the change of the Register when is requested
    const registerCheck = (queryResult) => {
        if (queryResult.msgInfo !== "SUCCESS")
            alert(queryResult.msgInfo);
        else {
            //Refresh window
            window.location.reload(false);
        }
    }


    //Return
    return (
        <div className="Login">
            <label><b>Register:</b></label>
            <button className="LoginClose" onClick={() => setBackground(null)}>X</button>
            <form className="LoginForm" onSubmit={(event) => submitHandler(event)}>
                <div className="LoginContainer">
                    <label>Username:</label>
                    <input
                        className="LoginInput"
                        type="text"
                        placeholder="xX_Master_Xx"
                        value={typedUser}
                        onChange={(e) => setTypedUser(e.target.value)}/>
                </div>
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



export default Register;