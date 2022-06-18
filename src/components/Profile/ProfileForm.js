import { useRef, useContext } from 'react';

import AuthContext from '../../store/auth-context';

import classes from './ProfileForm.module.css';

const ProfileForm = () => {
    const newPasswordInputRef = useRef();

    const AuthCtx = useContext(AuthContext);

    const submitHandler = event => {
        event.preventDefault();

        const enteredNewPassword = newPasswordInputRef.current.value;

        // add validation

        fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyB2zalKGx016HSuDDm0EnL9zonlpy3_uV0', {
            method: 'POST',
            body: JSON.stringify({
                idToken,
                password,
                returnSecureToken
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    };

    return (
        <form className={classes.form} onSubmit={submitHandler}>
            <div className={classes.control}>
                <label htmlFor='new-password'>New Password</label>
                <input type='password' id='new-password' ref={newPasswordInputRef} />
            </div>
            <div className={classes.action}>
                <button>Change Password</button>
            </div>
        </form>
    );
}

export default ProfileForm;
