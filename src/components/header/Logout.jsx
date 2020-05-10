import React from 'react';
import {gql, useLazyQuery} from '@apollo/client';

//Style
import '../Style.css';


//Logout query
const LOGOUT_QUERY = gql`
	query UserLogout($userID: ID!, $token: ID!) {
        userLogout(userID: $userID, token: $token) {
            msgInfo
        }
    }
`;


//Login JSX
const Login = props => {
    //Queries
    const logout = useLazyQuery(LOGOUT_QUERY);


    const logoutCall = () => {
        //Get userID and token for the query
        const userID = localStorage.getItem("userID");
        const token = localStorage.getItem("userToken");
        
        //Query logout
        logout[0]({variables: {userID, token}});

        //Delete cookies
        localStorage.removeItem("userID");
        localStorage.removeItem("userUsername");
        localStorage.removeItem("userAdmin");
        localStorage.removeItem("userBlocked");
        localStorage.removeItem("userToken");

        //Refresh Window
        window.location.reload(false);
    }

    
    //Return
    return (
        <button className="HeaderLoginOption clickable" onClick={() => logoutCall()}>Logout</button>
    );
}



export default Login;