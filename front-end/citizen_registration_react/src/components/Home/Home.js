import React,{ useEffect, useState } from 'react';
import { useLocation, withRouter } from 'react-router-dom';
import { ACCESS_TOKEN_NAME, API_BASE_URL } from '../../constants/apiConstants';
import axios from 'axios'
// help source: https://stackoverflow.com/questions/60664773/how-to-fetch-an-api-response-in-react
function Home(props) {
    const [state , setState] = useState({
        email : "",
        password : "",
        name : "",
        dob : "",
        address: "",
        mobile : ""
    })
    const location = useLocation()
    useEffect(() => {
        axios.get(API_BASE_URL+'/details/'+location.state, { headers: { 'token': localStorage.getItem(ACCESS_TOKEN_NAME) }})
            // https://stackoverflow.com/questions/44121069/how-to-pass-params-with-history-push-link-redirect-in-react-router-v4
        .then(function (response) {
            if(response.status !== 200){
              redirectToLogin()
            }
            else{
                console.log(response.data);
                // this.setState({ state: response.data, error: null })
                // state => setState(response.data)
            }
        })
        .catch(function (error) {
          redirectToLogin()
        });
      }, [location])
    function redirectToLogin() {
    props.history.push('/login');
    }
    return(
        <div className="mt-2" id="container">
            Home page

        <table>
          <thead>
            <tr>
              <th>Email-Address</th>
              <th>Name</th>
              <th>DOB</th>
                <th>Address</th>
                <th>Mobile number</th>
            </tr>
          </thead>
          <tbody>
            {(state !== null) ? item => (
              <tr>
                <td>{item.email}</td>
                <td>{item.name}</td>
                <td>{item.dob}</td>
                  <td>{item.address}</td>
                  <td>{item.mobile}</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    )
}

export default withRouter(Home);