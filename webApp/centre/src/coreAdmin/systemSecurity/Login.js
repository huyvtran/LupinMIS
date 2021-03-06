import React, { Component } from 'react';
import { Link} from 'react-router-dom';
// import {browserHistory} from 'react-router-dom';
import { Redirect } from 'react-router';
import swal from 'sweetalert';
import $ from "jquery";
import validate               from 'jquery-validation';

import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SignUp.css';

import axios from 'axios';


class Login extends Component {

  constructor(){
      super();
        this.state = {           
          loggedIn : false,
          auth: {
                email           : '',
                pwd             : '',
            }
        }
  }
  componentDidMount(){
    $("#login").validate({
      rules: {
        loginusername: {
          required: true,
        },
        loginpassword: {
          required: true,
        }
      },
      errorPlacement: function(error, element) {
        if (element.attr("name") === "loginusername"){
          error.insertAfter("#loginusernameErr");
        }
        if (element.attr("name") === "loginpassword"){
          error.insertAfter("#loginpasswordErr");
        }
      }
    });
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
    
  }
  userlogin(event){
    event.preventDefault();
    if($("#login").valid()){
      // console.log("in login mode",this.state.auth);
      var auth= {
        email       : this.refs.loginusername.value,
        password    : this.refs.loginpassword.value,
        roles       : ['MIS Coordinator','Center Incharge']
      }

      // console.log("auth value",auth);

      axios 
      .post('/api/users/login',auth)
      .then((response)=> {
        console.log("-------userData------>>",response);
        axios.defaults.headers.common['Authorization'] = 'Bearer '+response.data.token;

      
        if(axios.defaults.headers.common.Authorization){
          // console.log("axios.defaults.headers.common.Authorization",axios.defaults.headers.common.Authorization);
         /* alert("Authorization check ",);*/
          if(response.data.status==="Blocked"){
              swal("Invalid Email or Password","User is Blocked, Please contact with Admin");
              // console.log("blocked user")
          }else{
            this.props.history.push("/dashboard");
            if(localStorage===null){
              swal("Invalid Email or Password","Please Enter valid email and password");
            }else{
              localStorage.setItem("user_ID",response.data.user_ID);
              localStorage.setItem("token",response.data.token);
              localStorage.setItem("emailId",response.data.emailId);
              localStorage.setItem("center_ID",response.data.center_ID);
              localStorage.setItem("centerName",response.data.centerName);
              localStorage.setItem("fullName",response.data.fullName);
              localStorage.removeItem('emailotp')
              localStorage.removeItem('email')
              window.location.reload();
              this.setState({
                  loggedIn  :   true
              },()=>{
                // console.log("loggedIn", this.state.loggedIn);
              })
            }
          }
        }
      })
      .catch(function (error) {
        if(error.response&&error.response.status===401){
          swal("Invalid Email or Password","Email ID does not exists");
        }else if(error.response&&error.response.status===409){
          swal("Invalid Email or Password","Please Enter a valid password");
        }else{
          swal("Invalid Email or Password","Please try again");
        }
          // console.log(error);
        // if(localStorage!==null){
        //   swal("Invalid Email or Password","Please Enter valid email and password");
        // }
      });
    }
  }
  showSignPass(){
      $('.showPwd').toggleClass('showPwd1');
      $('.hidePwd').toggleClass('hidePwd1');
      return $('.inputTextPass').attr('type', 'text');
  }
  hideSignPass(){
      $('.showPwd').toggleClass('showPwd1');
      $('.hidePwd').toggleClass('hidePwd1');
      return $('.inputTextPass').attr('type', 'password');
  }
  // handleChange(event){
  //   event.preventDefault()
  //   if(event.currentTarget.value){
  //     $(event.currentTarget).siblings('.floating-label').css('top','-16px')
  //   }else{
  //     $(event.currentTarget).siblings('.floating-label').css('top','-16px')
  //   }
  // }
  render(){
    var y = 360;
    var h = y + 'px';

    var x = $(window).height();   
    var z = 0;
    var winHeight =(x-z) + 'px';
    var winHeight1 =(x-z) ;
    // console.log('x',$(window).height());
    // console.log('winHeight',winHeight1);

    var innerheight = winHeight1-160 + 'px';
    var innerheight1 = winHeight1-160 ;
   
    var margin = parseInt( innerheight1-y );
    var margint = (margin/2);
    // console.log('margint',margint);
    // console.log('margin',margin);
    var windowWidth = $(window).width();
    // console.log('ww',windowWidth);
    if(windowWidth>=320&&windowWidth<=992){
    var backImage = "visible-xs col-xs-12 visible-sm col-sm-12 noBackImage"
    }else{
    var backImage = "signUpBackground hidden-xs hidden-sm"
    }
    if(this.state.loggedIn===true){
      return <div></div>
    }

    return(
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 middlepo middlebord pull-right" id="contentsroll" style={{"height": innerheight}}>
          <div className="row">
              <div id="scrollcont" className={backImage} style={{"height": winHeight}}>
                <div className="col-lg-12 systemHeader   ">
                  <div className="col-lg-6 col-md-6 col-sm-6 ">
                    <img className="lupinImage" src="images/lupin.png" height="70px"/>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-6 text-center logoName">
                    Center <br/>Management Information System
                  </div>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 signUpWrapper">   
                  <div className="col-lg-4 col-lg-offset-4 col-md-4 col-md-offset-4 col-sm-12 signupPadding signUpFormWrap " style={{ "marginTop": margint , "height": h}}>
                  
{/*                  <div className="col-lg-4 col-lg-offset-7 col-md-4 col-md-offset-7 col-sm-12 signupPadding signUpFormWrap " style={{"height": divHeight}}>
*/}                    <div className="divLoginInWrap">

                     {/* <div className="col-lg-4 col-lg-offset-4  ">
                        <img className="logoImage" src="images/lupin.png" height="70px"/>
                        </div>
*/}
                      <form id="login" className="" onSubmit={this.userlogin.bind(this)}>
                        <br/>
                        <div className="col-lg-4 col-lg-offset-4 ">
                       {/* <h3> hhhh</h3>*/}
                     {/*blue, white top new pink skyblue redyellow jerkin new jaket*/}
                        {<h4 className="signInNameTitle mb35"><span className="bordbt">SIGN IN</span></h4>
                        }</div>
                        <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12 emailHeight">
                          <div className="inputContent">
                            <span className="blocking-span noIb" id="loginusernameErr">
                              <input type="email" className="col-lg-12 col-md-1col-lg-12 col-md-12 col-sm-12 oesSignUpForm tmsLoginTextBox" onChange={this.handleChange} ref="loginusername" id="loginusername" name="loginusername" placeholder="" required/>
                              <span className="floating-label"><i className="fa fa-envelope signupIconFont" aria-hidden="true"/>Email ID<label className="sign asterix">*</label></span>   
                            </span>
                          </div>
                        </div>
                        <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <div className="form-group1 fltlft input-group col-lg-12 col-md-12 col-sm-12 inputContent ">     
                            <span id="loginpasswordErr" className="blocking-span noIb">
                              <input type="password" className="form-control border3 pass oesSignUpForm confirmbtm inputTextPass tmsLoginTextBox" ref="loginpassword" name="loginpassword" required/>
                              <span className="floating-label1 lbfloatpass"><i className="fa fa-lock" aria-hidden="true"></i> Password<label className="sign asterix">*</label></span>                 
                            </span>
                         
                          <div className="showHideSignDiv">
                            <i className="fa fa-eye showPwd showEyeupSign" aria-hidden="true" onClick={this.showSignPass.bind(this)}></i>
                            <i className="fa fa-eye-slash hidePwd hideEyeSignup " aria-hidden="true" onClick={this.hideSignPass.bind(this)}></i>
                          </div> 
                            <span className="focus-border">
                              <i></i>
                            </span>
                          </div>
                        </div>
                        <div className="col-lg-12 col-md-12 col-sm-12">
                          <input id="logInBtn" type="submit" className="btn col-lg-12 col-md-12 col-xs-12 col-sm-12 UMloginbutton hvr-sweep-to-right" value="Sign In"/>
                        </div>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  customFl pdcls ">
                          <div className="col-lg-6 col-md-6 col-sm-6">
                            <Link to='/signup' className="UMGreyy UMGreyy_l pull-left"> <u>Sign Up</u></Link>
                          </div>
                          <div className="col-lg-6 col-md-6 col-sm-6 ">
                            <Link to='/forgot-pwd' className="UMGreyy UMGreyy_l pull-right">
                              <u>Forgot Password?</u>
                            </Link>
                          </div>
                        </div>
                        <div className="col-lg-12 col-md-12 col-sm-12 pdcls btn">
                        {/*  <div className="col-lg-12 col-md-12 col-sm-12 ">
                            <Link to='/verify-account' className="UMGreyy UMGreyy_l forgotpass emailverify col-lg-12 col-md-12 col-xs-12 col-sm-12">
                              OTP Verification
                            </Link>
                          </div>*/}
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
    );
  }
}
export default Login;