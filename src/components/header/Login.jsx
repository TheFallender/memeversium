import React, {useState, useEffect} from 'react';
import {gql, useLazyQuery} from '@apollo/client';

//Style
import '../Style.css';


//Login query
const LOGIN_QUERY = gql`
	query UserLog($typedEmail: String!, $typedPwd: String!) {
        userLogin(email: $typedEmail, password: $typedPwd) {
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


//Login JSX
const Login = props => {
    //Props
    const {
        setBackground
    } = props;


    //Queries
    const login = useLazyQuery(LOGIN_QUERY);


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

        //Lazy request the query
        login[0]({variables: {typedEmail, typedPwd}});

        //Prevent page change
        return false;
    }


    //Detect the change of the Login when is requested
    useEffect(() => {
        if (login[1].data) {
            if (login[1].data.userLogin.msgInfo !== "SUCCESS")
                alert(login[1].data.userLogin.msgInfo);
            else {
                //Create cookies
                localStorage.setItem("userID", login[1].data.userLogin.user[0]._id);
                localStorage.setItem("userUsername", login[1].data.userLogin.user[0].user);
                localStorage.setItem("userAdmin", login[1].data.userLogin.user[0].admin);
                localStorage.setItem("userBlocked", login[1].data.userLogin.user[0].blocked);
                localStorage.setItem("userToken", login[1].data.userLogin.data[0]);
                
                //Refresh window
                window.location.reload(false);
            }
        }
    }, [login])


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