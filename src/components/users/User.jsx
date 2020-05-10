import React from 'react';

//Components
import UserBlock from './UserBlock';
import UserRemove from './UserRemove';


//Style
import '../Style.css';

//Login JSX
const User = props => {
    //Props
    const {
        _id,
        user,
        blocked,
    } = props.data;

    //Return
    return (
        <div className="User">
            <label style={{marginRight: "5px"}}><b>{user}</b></label>
            <UserBlock userID={_id} remElem={props.remUser} blocked={blocked}/>
            <UserRemove userID={_id} remElem={props.remUser}/>
        </div>
    );
}



export default User;