import React, {useState} from 'react';
import axios from 'axios';
import { withRouter } from "react-router-dom";
import {API_BASE_URL, ACCESS_TOKEN_NAME} from '../../constants/apiConstants';
import './RegistrationForm.css';

function RegistrationForm(props) {
  const [state , setState] = useState({
        email : "",
        password : "",
        confirmPassword: "",
        name : "",
        dob : "",
        address: "",
        mobile : ""
    })
    const handleChange = (e) => {
        const {id , value} = e.target
        setState(prevState => ({
            ...prevState,
            [id] : value
        }))
    }
    const handleSubmitClick = (e) => {
        e.preventDefault();
        if(state.password === state.confirmPassword) {
            sendDetailsToServer()
        } else {
            props.showError('Passwords do not match');
        }
    }
    const sendDetailsToServer = () => {
        if(state.email.length && state.password.length && state.confirmPassword && state.name.length && state.dob.length
            && state.address.length && state.mobile.length) {
            props.showError(null);
            const payload={
                "email":state.email,
                "password":state.password,
                "name":state.name,
                "dob":state.dob,
                "address":state.address,
                "mobile":state.mobile
            }
            axios.post(API_BASE_URL+'/register', payload)
                .then(function (response) {
                    if(response.status === 200){
                        setState(prevState => ({
                            ...prevState,
                            'successMessage' : 'Registration successful. Redirecting to home page..'
                        }))
                        localStorage.setItem(ACCESS_TOKEN_NAME,response.data.token);
                        redirectToHome();
                        // props.payload = payload;
                        props.showError(null)
                    }
                    else if(response.status === 202){
                    props.showError("An account with the entered email-address and password is already registered!");
                }
                    else{
                        props.showError("The entered values in the form are not recognised!");
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        } else {
            props.showError('Please enter valid details in the registration page!')
        }

    }
    const redirectToHome = () => {
        props.updateTitle('Home')
        props.history.push('/details', state.email, {email: state.email});
    }
    const redirectToLogin = () => {
        props.updateTitle('Login')
        props.history.push('/login');
    }

    return(
        <div className="card col-12 col-lg-4 login-card mt-2 hv-center">
            <form>
                <div className="form-group text-left">
                <label htmlFor="exampleInputEmail1">Email address</label>
                <input type="email"
                       className="form-control"
                       id="email"
                       aria-describedby="emailHelp"
                       placeholder="Enter email"
                       value={state.email}
                       onChange={handleChange}
                />
                <small id="emailHelp" className="form-text text-muted">We'll never share your personal data with anyone else.</small>
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <input type="password"
                        className="form-control"
                        id="password"
                        placeholder="Password"
                           value={state.password}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputPassword1">Confirm Password</label>
                    <input type="password"
                        className="form-control"
                        id="confirmPassword"
                        placeholder="Confirm Password"
                           value={state.confirmPassword}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleName">Name</label>
                    <input type="text"
                        className="form-control"
                        id="name"
                        placeholder="Firstname Lastname"
                           value={state.name}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleDOB">Date Of Birth</label>
                    <input type="date"
                           min="1920-01-01"
                           max="2021-02-02"
                        className="form-control"
                        id="dob"
                        // placeholder="Firstname Lastname"
                           value={state.dob}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleAddress">Address</label>
                    <input type="text"
                        className="form-control"
                        id="address"
                        placeholder="House No, Street, City, Postal Code, State/Province, Country"
                           value={state.address}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleMobile">Mobile / Contact Number</label>
                    <input type="text"
                        className="form-control"
                        id="mobile"
                        placeholder="+0 1234567890"
                           value={state.mobile}
                        onChange={handleChange}
                    />
                </div>
                <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={handleSubmitClick}
                >
                    Register
                </button>
            </form>
            <div className="alert alert-success mt-2" style={{display: state.successMessage ? 'block' : 'none' }} role="alert">
                {state.successMessage}
            </div>
            <div className="mt-2">
                <span>Already have an account? </span>
                <span className="loginText" onClick={() => redirectToLogin()}>Login here</span>
            </div>
        </div>
    )
}

export default withRouter(RegistrationForm);