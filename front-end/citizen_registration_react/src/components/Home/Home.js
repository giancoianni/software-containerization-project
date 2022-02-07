import React,{ useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useLocation, withRouter } from 'react-router-dom';
import { ACCESS_TOKEN_NAME, API_BASE_URL } from '../../constants/apiConstants';
import axios from 'axios'
// help source: https://stackoverflow.com/questions/60664773/how-to-fetch-an-api-response-in-react
// https://medium.com/swlh/a-simple-comparative-analysis-of-functional-and-class-component-in-react-f91919b0499f
function Home(props) {
    const jsonValue = {
        email : "",
        password : "",
        name : "",
        dob : "",
        address: "",
        mobile : ""
    }
    const useStyles = makeStyles({
  table: {
    minWidth: 650,
      borderCollapse: 'separate',
    borderSpacing: '0px 4px'
  },
  tr: {
    cursor: "pointer",
    borderLeft: "8px solid #9a031e",
    marginTop: "8px"
  },
  td: {
    marginTop: "8px"
  },
        th: {
    marginTop: "8px"
  }
});
    const [respData,setRespData ] = useState([jsonValue])
    // const [current, setCurrent] = useState(0)
    const location = useLocation()
    useEffect(() => {
        axios.get(API_BASE_URL+'/details/'+location.state, { headers: { 'token': localStorage.getItem(ACCESS_TOKEN_NAME) }})
            // https://stackoverflow.com/questions/44121069/how-to-pass-params-with-history-push-link-redirect-in-react-router-v4
        .then(function (response) {
            if(response.status !== 200){
                console.log("Response status - " + response.status)
              redirectToLogin()
            }
            else{
                console.log("Landed successfully in home page!");
                console.log(response.data);
                //this.setState({ value: response.data, error: null })
                setRespData(response.data)
                console.log("Response after set - " + respData[0].email);
            }
        })
        .catch(function (error) {
            console.log("Response status in exception - " + error)
          redirectToLogin()
        });
      }, [location])
    function redirectToLogin() {
    props.history.push('/login');
    }
    const classes = useStyles();
    return(

        <div className="mt-2" id="container"><br/><br/>
            Details of the current logged-in user is listed below:
<br/>
        <br/> <br/>
        <table className={classes.table} aria-label="result table">
          <thead>
            <tr>
              <th style={{color: "red"}}>Email-Address</th>
              <th style={{color: "red"}} scope="col">Name</th>
              <th style={{color: "red"}} scope="col">DOB</th>
                <th style={{color: "red"}} scope="col">Address</th>
                <th style={{color: "red"}} scope="col">Mobile number</th>
            </tr>
          </thead>
          <tbody>
            {(JSON.stringify(respData) !== '{}') ? (
              <tr>
                <td style={{scope: "col"}}>{respData[0].email}</td>
                <td style={{scope: "col"}}>{respData[0].name}</td>
                <td style={{scope: "col"}}>{respData[0].dob}</td>
                  <td style={{scope: "col"}}>{respData[0].address}</td>
                  <td style={{scope: "col"}}>{respData[0].mobile}</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    )
}

export default withRouter(Home);