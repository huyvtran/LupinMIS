import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import swal                   from 'sweetalert';
import {withRouter}    from 'react-router-dom';
// import _                      from 'underscore';
import IAssureTable           from "../../../../IAssureTable/IAssureTable.jsx";
import "./Sector.css";


class Sector extends Component{
  
  constructor(props){
    super(props);
    this.state = {
      "sector"              :"",
      "user_ID"             :"",
      "sector_id"           :"",
      fields                : {},
      errors                : {},
      "tableHeading"        : {
        sector              : "Name of Sector",
        actions             : 'Action',
      },
      "tableObjects"        : {
        deleteMethod        : 'delete',
        apiLink             : '/api/sectors/delete/',
        editUrl             : '/sector-and-activity/',
        paginationApply     : false,
        searchApply         : false,
      },
      "dataCount"           : 0,
      "startRange"          : 0,
      "limitRange"          : 10000,
      "editId"              : props.match.params ? props.match.params.sectorId : ''
    }
  }
 
  handleChange(event){
    event.preventDefault();
    this.setState({
     "sector"   : this.refs.sector.value,  
    });
    let fields = this.state.fields;
    fields[event.target.name] = event.target.value;
    this.setState({
      fields
    });
    if (this.validateForm()) {
      let errors = {};
      errors[event.target.name] = "";
      this.setState({
        errors: errors
      });
    }
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

  SubmitSector(event){
    event.preventDefault();
    if (this.validateFormReq() && this.validateForm()) {
    var sectorValues= {
    "sector"      :this.refs.sector.value,
    "user_ID"     : this.state.user_ID,
    };

    
    axios.post('/api/sectors',sectorValues)
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
      let fields       = {};
      fields["sector"] = "";
   
      this.setState({
        "sector"  :"",
        fields    :fields
      });
    } 
  }


  updateSector(event){
    event.preventDefault();
    if(this.refs.sector.value ==="") {
      // console.log('state validation');
      if (this.validateFormReq() && this.validateForm()) {
      }
    }else{
      var sectorValues= {
        "sector_ID"   :this.state.editId,
        "sector"      :this.refs.sector.value,
        "user_ID"     : this.state.user_ID,
      };

      
      axios.patch('/api/sectors/update',sectorValues, this.state.editId)
        .then((response)=>{
          this.getData(this.state.startRange, this.state.limitRange);
          swal({
            title : response.data.message,
            text  : response.data.message
          });
          this.setState({
            editId : ''
          })
          this.props.history.push('/sector-and-activity');
        })
        .catch(function(error){
          console.log("error = ",error);
        });
        let fields = {};
        fields["sector"] = "";
   
      this.setState({
        "sector"  :"",
        fields:fields
      });
    }     
  }
  validateFormReq() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    $("html,body").scrollTop(0);
      if (!fields["sector"]) {
        formIsValid = false;
        errors["sector"] = "This field is required.";
      }     
      this.setState({
        errors: errors
      });
      return formIsValid;
  }

  validateForm() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
      if (typeof fields["sector"] !== "undefined") {
        // if (!fields["beneficiaryID"].match(/^(?!\s*$)[-a-zA-Z0-9_:,.' ']{1,100}$/)) {
        if (!fields["sector"].match(/^[_A-z]*((-|\s)*[_A-z])*$|^$/)) {
          formIsValid = false;
          errors["sector"] = "Please enter valid Sector Name.";
        }
      }
    $("html,body").scrollTop(0);
      this.setState({
        errors: errors
      });
      return formIsValid;
  }

  componentWillReceiveProps(nextProps){
  // console.log('componentWillReceiveProps');
    var editId = nextProps.match.params.sectorId;
    if(nextProps.match.params.sectorId){
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
  // console.log('componentDidMount', this.state.tableData);
    var editId = this.props.match.params.sectorId;
    if(editId){      
      this.edit(editId);
    }
    this.getLength();
    this.getData(this.state.startRange, this.state.limitRange);
  }

  edit(id){
    axios({
      method: 'get',
      url: '/api/sectors/'+id,
    }).then((response)=> {
      var editData = response.data[0];      
      this.setState({
        "sector"                :editData.sector,
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
     axios.post('/api/sectors/list',data)
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
    axios.get('/api/sectors/count')
    .then((response)=>{
      // console.log('response', response.data);
      this.setState({
        dataCount : response.data.dataLength
      },()=>{
        // console.log('dataCount', this.state.dataCount);
      })
    })
    .catch(function(error){
      console.log("error = ",error);
    });
  }
  componentWillMount(){
    console.log('componentWillMount');
    this.getLength();
  }
  getSearchText(searchText, startRange, limitRange){
      this.setState({
          tableData : []
      });
  }
  componentWillUnmount(){
    this.setState({
      "sector" :"",
      "editId" : ""
    })
  }

  render() {
  // console.log('render');
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="formWrapper">
            <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formLable mt" id="sectorDetails">
              <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 addLoc ">
                <span className="perinfotitle mgtpprsnalinfo"><i className="fa fa-map-marker" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;Add Sector</span>
              </div>
              <div className="marginBottom col-lg-12 col-md-12 col-sm-12 col-xs-12"></div>
              <div className="row">
                <div className=" col-lg-12 col-sm-12 col-xs-12 formLable valid_box ">
                  <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 ">
                    <label className="formLable">Name of Sector</label><span className="asterix">*</span>
                    <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="sector" >
                     
                      <input type="text" className="form-control inputBox"  placeholder=""ref="sector" name="sector" value={this.state.sector} onKeyDown={this.isTextKey.bind(this)} onChange={this.handleChange.bind(this)} />
                    </div>
                    <div className="errorMsg">{this.state.errors.sector}</div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    {
                      this.state.editId ? 
                      <button className=" col-lg-4 btn submit pull-right marginT18" onClick={this.updateSector.bind(this)}> Update</button>
                      :
                      <button className=" col-lg-4 btn submit pull-right marginT18" onClick={this.SubmitSector.bind(this)}> Submit</button>
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
      </div>
    );

  }

}
export default withRouter(Sector);