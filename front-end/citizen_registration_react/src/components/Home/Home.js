import React,{ useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
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
    useEffect(() => {
        axios.get(API_BASE_URL+'/details', { headers: { 'token': localStorage.getItem(ACCESS_TOKEN_NAME) }})
        .then(function (response) {
            if(response.status !== 200){
              redirectToLogin()
            }
            else{
                console.log(response.data);
                this.setState({ state: response.data, error: null })
            }
        })
        .catch(function (error) {
          redirectToLogin()
        });
      })
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
            {/*{(state !== null) ? state.map(item => (*/}
            {/*  <tr key={item.id}>*/}
            {/*    <td>{item.email}</td>*/}
            {/*    <td>{item.name}</td>*/}
            {/*    <td>{item.dob}</td>*/}
            {/*      <td>{item.address}</td>*/}
            {/*      <td>{item.mobile}</td>*/}
            {/*  </tr>*/}
            {/*)) : null}*/}
          </tbody>
        </table>
      </div>
    )
}

export default withRouter(Home);