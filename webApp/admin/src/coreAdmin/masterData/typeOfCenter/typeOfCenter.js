import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import validate               from 'jquery-validation';
import swal                   from 'sweetalert';
import {withRouter}    from 'react-router-dom';
// import _                      from 'underscore';
import IAssureTable           from "../../IAssureTable/IAssureTable.jsx";
import "./typeOfCenter.css";

axios.defaults.baseURL = 'http://qalmisapi.iassureit.com';
axios.defaults.headers.post['Content-Type'] = 'application/json';

class typeOfCenter extends Component{
  
  constructor(props){
    super(props);
    this.state = {
      "typeofCenter"        :"",
      "user_ID"             :"",
      "typeofCenter_id"     :"",
      fields                : {},
      errors                : {},
      "tableHeading"        : {
        typeofCenter        : "Type Of Center",
        actions             : 'Action',
      },
      "tableObjects"        : {
        deleteMethod        : 'delete',
        apiLink             : '/api/typeofcenters/',
        editUrl             : '/type-center/',
        paginationApply     : false,
        searchApply         : false,
      },
      "dataCount"           : 0,
      "startRange"          : 0,
      "limitRange"          : 10000,
      "editId"              : props.match.params ? props.match.params.typeofCenterId : ''
    }
  }
 
  handleChange(event){
    event.preventDefault();
    this.setState({
     "typeofCenter"   : this.refs.typeofCenter.value,  
    });
  
  }

  isTextKey(evt) {
   var charCode = (evt.which) ? evt.which : evt.keyCode
   if (charCode!==189 && charCode > 32 && (charCode < 65 || charCode > 90) )
   {
    evt.preventDefault();
      return false;
    }
    else{
      return true;
    }
 
  }

  SubmitType_Center(event){
    event.preventDefault();
    if($('#typeofCenterDetails').valid()){
    // if (this.validateFormReq() && this.validateForm()) {
    var typeofCenterValues= {
    "typeofCenter"      :this.refs.typeofCenter.value,
    "user_ID"          : this.state.user_ID,
    };

      let fields            = {};
      fields["typeofCenter"] = "";
   
     console.log("typeofCenterValues",typeofCenterValues );
    axios.post('/api/typeofcenters',typeofCenterValues)
      .then((response)=>{
        this.getData(this.state.startRange, this.state.limitRange);
        swal({
          title : response.data.message,
          text  : response.data.message
        });
      })
      .catch(function(error){
        console.log("error = ",error);
      });
      this.setState({
        "typeofCenter"  :"",
        fields    :fields
      });
    } 
  }


  updateType_Center(event){
    event.preventDefault();
    // if(this.refs.typeofCenter.value ==="") {
    //   // console.log('state validation');
    //   if (this.validateFormReq() && this.validateForm()) {
    //   }
    // }else{
      // if (this.validateFormReq() && this.validateForm()) {
    if($('#typeofCenterDetails').valid()){
      var typeofCenterValues= {
        "ID"               : this.state.editId,
        "typeofCenter"     : this.refs.typeofCenter.value,
        "user_ID"          : this.state.user_ID,
      };

      
      axios.patch('/api/typeofcenters/update',typeofCenterValues, this.state.editId)
        .then((response)=>{
          console.log("response",response );
          if(response.data){
            this.getData(this.state.startRange, this.state.limitRange);
              this.props.history.push('/type-center');
            // window.location = '/type-center'
            swal({
              title : response.data.message,
              text  : response.data.message
            });
            this.setState({
              editId : '',
              "typeofCenter"  :"",
              fields         :fields
            },()=>{
            })
          }
        })
        .catch(function(error){
          console.log("error = ",error);
        });
        let fields            = {};
        fields["typeofCenter"] = "";
    }   
    // }  
  }

  componentWillReceiveProps(nextProps){
    // console.log('componentWillReceiveProps');
    var editId = nextProps.match.params.typeofCenterId;
    if(nextProps.match.params.typeofCenterId){
      this.setState({
        editId : editId
      },()=>{
        this.edit(this.state.editId);

      })
    }
    if(nextProps){
      this.getLength();
    }
  }
  
  componentDidMount(){
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
    var editId = this.props.match.params.typeofCenterId;
    // console.log('editId', editId);
    if(editId){      
      this.edit(editId);
    }
    this.getLength();
    this.getData(this.state.startRange, this.state.limitRange);
    $.validator.addMethod("regxtypeofCenter", function(value, element, regexpr) {         
      return regexpr.test(value);
    }, "Please enter valid Type of Center.");

    $("#typeofCenterDetails").validate({
      rules: {
        typeofCenter: {
          required: true,
          regxtypeofCenter: /^[_A-z]*((-|\s)*[_A-z])*$|^$/,
        },
      },
      errorPlacement: function(error, element) {
        if (element.attr("name") == "typeofCenter"){
          error.insertAfter("#typeofCenterErr");
        }
      }
    });
  }

  edit(id){
    axios({
      method: 'get',
      url: '/api/typeofcenters/'+id,
    }).then((response)=> {
      var editData = response.data[0];   
        // console.log("editData",editData,id);   
      this.setState({
        "typeofCenter"     :editData.typeofCenter,
      },()=>{
        
      });
      let fields = this.state.fields;
      let errors = {};
      let formIsValid = true;
      this.setState({
        errors: errors
      });
      return formIsValid;
    }).catch(function (error) {
        console.log("error = ",error);
      });
  }
  getData(startRange, limitRange){
    var data = {
      limitRange : limitRange,
      startRange : startRange,
    }
    // console.log('data', data);
     axios.get('/api/typeofcenters/list',data)
    .then((response)=>{
      // console.log('tableData', response.data);
      this.setState({
        tableData : response.data
      })
    })
    .catch(function(error){
      console.log("error = ",error);
    });
  }
  getLength(){
   /* axios.get('/api/typeofcenters/count')
    .then((response)=>{
      // console.log('response', response.data);
      this.setState({
        dataCount : response.data.dataLength
      },()=>{
        // console.log('dataCount', this.state.dataCount);
      })
    })
    .catch(function(error){
      
    });*/
  }
  componentWillMount(){
    // console.l-og('componentWillMount');
    this.getLength();
  }
  getSearchText(searchText, startRange, limitRange){
      this.setState({
          tableData : []
      });
  }
  componentWillUnmount(){
    this.setState({
      "typeofCenter" :"",
      "editId"      : ""
    })
  }

  render() {
  // console.log('render');
    return (
        <div className="container-fluid">
          <div className="row">
            <div className="formWrapper">
              <section className="content">
                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent ">
                  <div className="row">
                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact">
                      <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageHeader">
                          Master Data                                     
                       </div>
                      <hr className="hr-head container-fluid row"/>
                    </div>
                    <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formLable " id="typeofCenterDetails">
                      <div className="col-lg-12 ">
                        <h4 className="pageSubHeader">Type of Center</h4>
                      </div>
                      <div className="row">
                        <div className=" col-lg-12 col-sm-12 col-xs-12 formLable valid_box ">
                          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 ">
                            <label className="formLable"> Type of Center</label><span className="asterix">*</span>
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="typeofCenterErr" >
                             
                              <input type="text" className="form-control inputBox"  placeholder=""ref="typeofCenter" name="typeofCenter" value={this.state.typeofCenter} onKeyDown={this.isTextKey.bind(this)} onChange={this.handleChange.bind(this)} />
                            </div>
                            <div className="errorMsg">{this.state.errors.typeofCenter}</div>
                          </div>
                          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                            {
                              this.state.editId ? 
                              <button className=" col-lg-4 btn submit pull-right marginT18" onClick={this.updateType_Center.bind(this)}> Update</button>
                              :
                              <button className=" col-lg-4 btn submit pull-right marginT18" onClick={this.SubmitType_Center.bind(this)}> Submit</button>
                            }
                          </div> 
                        </div> 
                      </div><br/>
                    </form>    
                    <div className="col-lg-12 ">
                       <hr className=""/>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                      <IAssureTable 
                        tableHeading={this.state.tableHeading}
                        dataCount={this.state.dataCount}
                        tableData={this.state.tableData}
                        getData={this.getData.bind(this)}
                        tableObjects={this.state.tableObjects}
                        // getSearchText={this.getSearchText.bind(this)}
                      />
                    </div>              
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
    );

  }

}
export default withRouter(typeOfCenter);
