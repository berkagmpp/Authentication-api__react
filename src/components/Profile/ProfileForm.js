import { useRef, useContext } from 'react';

import { useHistory } from 'react-router-dom';

import AuthContext from '../../store/auth-context';

import classes from './ProfileForm.module.css';

const ProfileForm = () => {
    const history = useHistory();

    const newPasswordInputRef = useRef();

    const authCtx = useContext(AuthContext);

    const submitHandler = event => {
        event.preventDefault();

        const enteredNewPassword = newPasswordInputRef.current.value;

        // add validation

        fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyB2zalKGx016HSuDDm0EnL9zonlpy3_uV0', {
            method: 'POST',
            body: JSON.stringify({
                idToken: authCtx.token,
                password: enteredNewPassword,
                returnSecureToken: false
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.ok) {
                alert('Your password changed successfully.');
                history.replace('/');
            } else {
                return res.json().then((data) => {
                    let errorMessage = 'Authentication failed!';
                    throw new Error(errorMessage);
                });
            }
        }).catch(err => {
            alert(err);
        });
    };

    return (
        <form className={classes.form} onSubmit={submitHandler}>
            <div className={classes.control}>
                <label htmlFor='new-password'>New Password</label>
                <input type='password' id='new-password' minLength='7' ref={newPasswordInputRef} />
            </div>
            <div className={classes.action}>
                <button>Change Password</button>
            </div>
        </form>
    );
}

export default ProfileForm;
