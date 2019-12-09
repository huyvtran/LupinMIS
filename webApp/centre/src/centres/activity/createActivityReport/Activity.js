import React, { Component }   from 'react';
import axios                  from 'axios';
import $                      from 'jquery';
import _                      from 'underscore';
import swal                   from 'sweetalert';
import moment                 from "moment";
import 'bootstrap/js/tab.js';
import 'react-table/react-table.css'; 
import validate               from 'jquery-validation';

import IAssureTable           from "../../../coreAdmin/IAssureTable/IAssureTable.jsx";
import ListOfBeneficiaries    from "../listOfBeneficiaries/ListOfBeneficiaries.js";
import BulkUpload             from "../../../centres/bulkupload/BulkUpload.js";
import "./Activity.css";

var add = 0;

class Activity extends Component{
  
  constructor(props){
    super(props);
    this.state = {
      "center_ID`"         : "",
      "centerName"        : "",
      "district"          : "-- Select --",
      "block"             : "-- Select --",
      "dateofIntervention": moment(new Date()).format('YYYY-MM-DD'),
      "village"           : "-- Select --",
      "date"              : "",
      "sector"            : "-- Select --",
      "typeofactivity"    : "-- Select --",
      "nameofactivity"    : "",
      "activity"          : "-- Select --",
      "projectName"       : "LHWRF Grant",
      "projectCategoryType" : "LHWRF Grant",
      "subactivity"       : "-- Select --",
      "unit"              : "Number",
      "unitCost"          : 0,
      "quantity"          : 0,
      "totalcost"         : 0,
      "NABARD"            : 0,
      "LHWRF"             : 0,
      "bankLoan"          : 0,
      "govtscheme"        : 0,
      "directCC"          : 0,
      "indirectCC"        : 0,
      "other"             : 0,
      "total"             : 0,
      "remark"            : "",
      type               : true,      
      shown               : true,      
      "listofDistrict"    :"",
      "listofBlocks"      :"",
      "listofVillages"    :"",
      fields              : {},
      errors              : {},
       "twoLevelHeader"   : {
        apply             : true,
        firstHeaderData   : [
                            {
                              heading : 'Activity Details',
                              mergedColoums : 13
                            },
                            {
                              heading : 'Source of Fund',
                              mergedColoums : 8
                            },
                            {
                              heading : '',
                              mergedColoums : 1
                            },
                            {
                              heading : '',
                              mergedColoums : 1
                            },]
      },
      "tableHeading"      : {

        projectCategoryType        : "Category",
        projectName                : "Project Name",
        date                       : "Date",
        place                      : "Place",
        sectorName                 : "Sector",
        activityName               : "Activity",
        subactivityName            : "Sub-Activity",
        unit                       : "Unit",
        unitCost                   : "Unit Cost",
        quantity                   : "Quantity",
        totalcost                  : "Total Cost",
        numofBeneficiaries         : "No. Of Beneficiaries",
        LHWRF                      : "LHWRF",
        NABARD                     : "NABARD",
        bankLoan                   : "Bank Loan",
        govtscheme                 : "Govt. Scheme",
        directCC                   : "Direct Community Contribution",
        indirectCC                 : "Indirect Community Contribution",
        other                      : "Other",
        total                      : "Total",
        remark                     : "Remark",
        actions                    : 'Action',
      },
      "tableObjects"               : {
        deleteMethod               : 'delete',
        apiLink                    : '/api/activityReport/',
        paginationApply            : false,
        downloadApply              : true,
        searchApply                : false,
        editUrl                    : '/activity/'
      },
      "selectedBeneficiaries"      : [],
      "startRange"                 : 0,
      "limitRange"                 : 10000,
      "editId"                     : this.props.match.params ? this.props.match.params.id : ''
    }
    this.uploadedData = this.uploadedData.bind(this);
    this.handleTotalChange = this.handleTotalChange.bind(this);
  }

  remainTotal(event){
    event.preventDefault(); 
    // console.log("event.target.name",event.target.name);

    var prevTotal = 0;
    var subTotal = 0;
    // var array = ["LHWRF","NABARD","bankLoan","govtscheme","directCC","indirectCC","other"]
    switch(event.target.name){
        case "LHWRF" : 
            prevTotal = this.state.totalcost;
            subTotal = this.state.LHWRF;
            // console.log("prevTotal = ", prevTotal);
          if(parseInt(this.state.LHWRF) < this.state.totalcost){
            if(subTotal < this.state.totalcost){
              // this.setState({ NABARD : this.state.totalcost - subTotal,"total" :subTotal}); 
              this.setState({ NABARD : this.state.totalcost - subTotal}); 
            }            
          }else{
            this.setState({ LHWRF : prevTotal}); 
          }
          break;    


          
        case "NABARD" : 
          prevTotal = this.state.totalcost - parseInt(this.state.LHWRF);
          // console.log("add", this.state.LHWRF,this.state.NABARD)
          subTotal = parseInt(this.state.LHWRF) + parseInt(this.state.NABARD);
          // console.log("prevTotal in NABARD= ", prevTotal);
          // console.log("subTotal in NABARD= ", subTotal);
          if(parseInt(this.state.NABARD) < this.state.totalcost){
            if(subTotal < this.state.totalcost){
              // this.setState({ bankLoan : this.state.totalcost - subTotal,"total" :subTotal},()=>{
              this.setState({ bankLoan : this.state.totalcost - subTotal},()=>{
                // console.log("bankLoan",this.state.bankLoan);
              }); 
            }else{
              this.setState({ NABARD : prevTotal}); 
            }
          }else{
            this.setState({ NABARD : prevTotal}); 
          }
          break;    


        case "bankLoan" : 
          // console.log("prevTotal before = ", prevTotal);
          prevTotal = this.state.totalcost - parseInt(this.state.LHWRF) - parseInt(this.state.NABARD);
          subTotal = parseInt(this.state.LHWRF) + parseInt(this.state.NABARD) + parseInt(this.state.bankLoan);
          // console.log("prevTotal after = ", prevTotal);
          if(parseInt(this.state.bankLoan) < this.state.totalcost){
            if(subTotal < this.state.totalcost){
              // this.setState({ govtscheme : this.state.totalcost - subTotal,"total" :subTotal}); 
              this.setState({ govtscheme : this.state.totalcost - subTotal}); 
            }else{
              this.setState({ bankLoan : prevTotal}); 
            }
          }else{
            this.setState({ bankLoan : prevTotal}); 
          }
          break;    


        case "govtscheme" : 
          prevTotal = this.state.totalcost - parseInt(this.state.LHWRF) - parseInt(this.state.NABARD) - parseInt(this.state.bankLoan);
          subTotal = parseInt(this.state.LHWRF) + parseInt(this.state.NABARD) + parseInt(this.state.bankLoan) + parseInt(this.state.govtscheme);
          if(parseInt(this.state.govtscheme) < this.state.totalcost){
            if(subTotal < this.state.totalcost){
              // this.setState({ directCC : this.state.totalcost - subTotal,"total" :subTotal}); 
              this.setState({ directCC : this.state.totalcost - subTotal}); 
            }else{
              this.setState({ govtscheme : prevTotal}); 
            }
          }else{
            this.setState({ govtscheme : prevTotal}); 
          }
          break;    



        case "directCC" : 
          prevTotal = this.state.totalcost - parseInt(this.state.LHWRF) - parseInt(this.state.NABARD) - parseInt(this.state.bankLoan) - parseInt(this.state.govtscheme) ;
          subTotal = parseInt(this.state.LHWRF) + parseInt(this.state.NABARD) + parseInt(this.state.bankLoan) + parseInt(this.state.govtscheme) + parseInt(this.state.directCC);
          if(parseInt(this.state.directCC) < this.state.totalcost){
            if(subTotal < this.state.totalcost){
              // this.setState({ indirectCC : this.state.totalcost - subTotal,"total" :subTotal}); 
              this.setState({ indirectCC : this.state.totalcost - subTotal}); 
            }else{
              this.setState({ directCC : prevTotal}); 
            }
          }else{
            this.setState({ directCC : prevTotal}); 
          }
          break;    



        case "indirectCC" : 
          prevTotal = this.state.totalcost - parseInt(this.state.LHWRF) - parseInt(this.state.NABARD) - parseInt(this.state.bankLoan) - parseInt(this.state.govtscheme) - parseInt(this.state.directCC) ;
          subTotal = parseInt(this.state.LHWRF) + parseInt(this.state.NABARD) + parseInt(this.state.bankLoan) + parseInt(this.state.govtscheme) + parseInt(this.state.directCC) + parseInt(this.state.indirectCC);
          if(parseInt(this.state.indirectCC) < this.state.totalcost){
            if(subTotal < this.state.totalcost){
              // this.setState({ other : this.state.totalcost - subTotal,"total" :subTotal},()=>{
              this.setState({ other : this.state.totalcost - subTotal},()=>{

              }); 
            }else{
              this.setState({ indirectCC : prevTotal}); 
            }
          }else{
            this.setState({ indirectCC : prevTotal}); 
          }
          break;   

         case "other" : 
          prevTotal = this.state.totalcost - parseInt(this.state.LHWRF) - parseInt(this.state.NABARD) - parseInt(this.state.bankLoan) - parseInt(this.state.govtscheme) - parseInt(this.state.directCC) - parseInt(this.state.indirectCC) ;
          subTotal = parseInt(this.state.LHWRF) + parseInt(this.state.NABARD) + parseInt(this.state.bankLoan) + parseInt(this.state.govtscheme) + parseInt(this.state.directCC) + parseInt(this.state.indirectCC)+ parseInt(this.state.other);
          if (parseInt(this.state.other) < this.state.totalcost) {
            if(subTotal < this.state.totalcost){
              // this.setState({ other : this.state.totalcost - subTotal,"total" :subTotal},()=>{
              // }); 
            }else{
              this.setState({ "other" : prevTotal}); 
            }
          }else{
              // this.setState({ "other" : prevTotal,"total" :subTotal}); 
              this.setState({ "other" : prevTotal}); 
          }
         break;
      }

  }

  handleChange(event){
    event.preventDefault(); 
      this.setState({      
        [event.target.name]: event.target.value
      },()=>{
    });
  }
  handleTotalChange(event){
    event.preventDefault();
    const target = event.target;
    const name   = target.name;
    this.setState({
       [name]: target.value,
    },()=>{
      if (this.state.unitCost > 0 & this.state.quantity > 0) {
        console.log("this.state.unitCost = ",this.state.unitCost);
        console.log("this.state.quantity = ",this.state.quantity);
        
         var totalcost = parseInt(this.state.unitCost) * parseInt(this.state.quantity);
         this.setState({
          "total"     : totalcost,
          "totalcost" : totalcost,
          "LHWRF"     : totalcost
         });
      }else{
         this.setState({
          "total"     : "",
          "totalcost" : "",
          "LHWRF"     : "",
         });        
      }
    });
  }
  isNumberKey(evt){
    var charCode = (evt.which) ? evt.which : evt.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57)  && (charCode < 96 || charCode > 105))
    {
    evt.preventDefault();
      return false;
    }
    else{
      return true;
    }
  }
  isTextKey(evt){
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
  uploadedData(data){
    this.getData(this.state.startRange,this.state.limitRange,this.state.center_ID)
  }
  getBeneficiaries(selectedBeneficiaries){
    this.setState({
      selectedBeneficiaries : selectedBeneficiaries
    })
  }
    
  SubmitActivity(event){
    event.preventDefault();
    // console.log("date = ", this.refs.dateofIntervention.value);
    var dateObj = new Date();
    var momentObj = moment(dateObj);
    var momentString = momentObj.format('YYYY-MM-DD');

    // if(this.refs.dateofIntervention.value == "" ){
    // if (this.validateFormReq() && this.validateForm()){
    if ($("#Academic_details").valid()){
      //     }
      // }else{
            // console.log("date",this.state.dateofIntervention);
      var activityValues= {
        "center_ID"         : this.state.center_ID,
        "centerName"        : this.state.centerName,
        "date"              : this.refs.dateofIntervention.value,
        "stateCode"         : this.state.stateCode,
        "district"          : this.refs.district.value,
        "block"             : this.refs.block.value,
        "village"           : this.refs.village.value,
        "dateofIntervention": this.refs.dateofIntervention.value,
        "sector_ID"         : this.refs.sector.value.split('|')[1],
        "sectorName"        : this.refs.sector.value.split('|')[0],
        "typeofactivity"    : this.refs.typeofactivity.value,
        "activity_ID"       : this.refs.activity.value.split('|')[1],
        "activityName"      : this.refs.activity.value.split('|')[0],
        "subactivity_ID"    : this.refs.subactivity.value.split('|')[1],
        "subactivityName"   : this.refs.subactivity.value.split('|')[0],
        "unit"              : document.getElementById('unit').innerHTML,
        "unitCost"          : this.refs.unitCost.value,
        "quantity"          : this.refs.quantity.value,
        "totalcost"         : this.state.totalcost,
        "LHWRF"             : this.refs.LHWRF.value,
        "NABARD"            : this.refs.NABARD.value,
        "bankLoan"          : this.refs.bankLoan.value,
        "govtscheme"        : this.refs.govtscheme.value,
        "directCC"          : this.refs.directCC.value,
        "indirectCC"        : this.refs.indirectCC.value,
        "other"             : this.refs.other.value,
        "total"             : this.state.total,
        "remark"            : this.refs.remark.value,
        "listofBeneficiaries" : this.state.selectedBeneficiaries,
        "projectName"         : this.state.projectName,
        "projectCategoryType" : this.state.projectCategoryType,
      };
      let fields                  = {};
      fields["district"]          = "";
      fields["block"]             = "";
      fields["village"]           = "";
      fields["dateofIntervention"]= "";
      fields["sector"]            = "";
      fields["typeofactivity"]    = "";
      fields["nameofactivity"]    = "";
      fields["activity"]          = "";
      fields["subactivity"]       = "";
      fields["unit"]              = "";
      fields["unitCost"]          = "";
      fields["quantity"]          = "";
      fields["totalcost"]         = "";
      fields["LHWRF"]             = "";
      fields["NABARD"]            = "";
      fields["bankLoan"]          = "";
      fields["govtscheme"]        = "";
      fields["directCC"]          = "";
      fields["indirectCC"]        = "";
      fields["other"]             = "";
      fields["projectName"]       = "";
      fields["projectCategoryType"]= "";
      
      // console.log("activityValues", activityValues);
      if (parseInt(this.state.total) === parseInt(this.state.totalcost)) {
        axios.post('/api/activityReport',activityValues)
          .then((response)=>{
            console.log("response", response);
            swal({
              title : response.data.message,
              text  : response.data.message,
            });
              this.getData(this.state.startRange, this.state.limitRange);  
              this.setState({
                selectedValues : this.state.selectedBeneficiaries 
              })    
            })
          .catch(function(error){       
            console.log('error',error);
            if(error.message === "Request failed with status code 401"){
              swal({
                  title : "abc",
                  text  : "Session is Expired. Kindly Sign In again."
              });
            }
          });
        this.setState({
          "projectName"            : "",
          "projectCategoryType" : "LHWRF Grant",
          "district"               : "-- Select --",
          "block"                  : "-- Select --",
          "village"                : "-- Select --",
          "dateofIntervention"     : momentString,
          "sector"                 : "-- Select --",
          "typeofactivity"         : "-- Select --",
          "nameofactivity"         : "",
          "activity"               : "-- Select --",
          "subactivity"            : "-- Select --",
          "unit"                   : "",
          "unitCost"               : "",
          "quantity"               : "",
          "totalcost"              : "",
          "LHWRF"                  : "",
          "NABARD"                 : "",
          "bankLoan"               : "",
          "govtscheme"             : "",
          "directCC"               : "",
          "indirectCC"             : "",
          "other"                  : "",
          "total"                  : "",
          "remark"                 : "",
          "fields"                 : fields,
          "selectedBeneficiaries"  : [],
          "listofBeneficiaries"    : [],
          "subActivityDetails"     : [],
          "availableActivity"      : [],
          "availableSubActivity"   : []
        },()=>{
          this.getData(this.state.startRange, this.state.limitRange, this.state.center_ID);
        });
      }else{
        swal('Total Costs are not equal! Please check');
      }
    }else{
      $("html,body").scrollTop(0)
      // $('label.error').first().focus()
    }
  }
  Update(event){
    event.preventDefault();
    // if (this.validateFormReq() && this.validateForm()) {
    var dateObj = new Date();
    var momentObj = moment(dateObj);
    var momentString = momentObj.format('YYYY-MM-DD');

    var activityValues= {
      "activityReport_ID" : this.state.editId,
      "categoryType"      : this.state.categoryType,
      "center_ID"         : this.state.center_ID,
      "centerName"        : this.state.centerName,
      "date"              : this.refs.dateofIntervention.value,
      "stateCode"         : this.state.stateCode,
      "district"          : this.refs.district.value,
      "block"             : this.refs.block.value,
      "village"           : this.refs.village.value,
      "sector_ID"         : this.refs.sector.value.split('|')[1],
      "sectorName"        : this.refs.sector.value.split('|')[0],
      "typeofactivity"    : this.refs.typeofactivity.value,
      "activity_ID"       : this.refs.activity.value.split('|')[1],
      "activityName"      : this.refs.activity.value.split('|')[0],
      "subactivity_ID"    : this.refs.subactivity.value.split('|')[1],
      "subactivityName"   : this.refs.subactivity.value.split('|')[0],
      "unit"              : document.getElementById('unit').innerHTML,
      "unitCost"          : this.refs.unitCost.value,
      "quantity"          : this.refs.quantity.value,
      "totalcost"         : this.state.totalcost,
      "LHWRF"             : this.refs.LHWRF.value,
      "NABARD"            : this.refs.NABARD.value,
      "bankLoan"          : this.refs.bankLoan.value,
      "govtscheme"        : this.refs.govtscheme.value,
      "directCC"          : this.refs.directCC.value,
      "indirectCC"        : this.refs.indirectCC.value,
      "other"             : this.refs.other.value,
      "total"             : this.state.total,
      "remark"            : this.refs.remark.value,
      "listofBeneficiaries" : this.state.selectedBeneficiaries,
      "projectName"         : this.state.projectName,
      "projectCategoryType" : this.state.projectCategoryType,
    };
    let fields                  = {};
    fields["projectName"]       = "";
    fields["projectCategoryType"]= "";
    fields["district"]          = "";
    fields["block"]             = "";
    fields["village"]           = "";
    fields["dateofIntervention"]= "";
    fields["sector"]            = "";
    fields["typeofactivity"]    = "";
    fields["nameofactivity"]    = "";
    fields["activity"]          = "";
    fields["subactivity"]       = "";
    fields["unit"]              = "";
    fields["unitCost"]          = "";
    fields["quantity"]          = "";
    fields["totalcost"]         = "";
    fields["LHWRF"]             = "";
    fields["NABARD"]            = "";
    fields["bankLoan"]          = "";
    fields["govtscheme"]        = "";
    fields["directCC"]          = "";
    fields["indirectCC"]        = "";
    fields["other"]             = "";
    fields["remark"]             = "";
    axios.patch('/api/activityReport',activityValues)
    .then((response)=>{
      // console.log("update",response);
    this.getData(this.state.startRange, this.state.limitRange, this.state.center_ID);      
      swal({
        title : response.data.message,
        text  : response.data.message,
      });
    })
    .catch(function(error){ 
      console.log("error = ",error);
    });
    this.setState({
      "projectName"        : "",
      "projectCategoryType" : "LHWRF Grant",
      "district"          : "-- Select --",
      "block"             : "-- Select --",
      "village"           : "-- Select --",
      "dateofIntervention": momentString,
      "sector"            : "-- Select --",
      "typeofactivity"    : "-- Select --",
      "nameofactivity"    : "",
      "activity"          : "-- Select --",
      "subactivity"       : "-- Select --",
      "unit"              : "",
      "unitCost"          : "0",
      "quantity"          : "0",
      "totalcost"         : "0",
      "LHWRF"             : "0",
      "NABARD"            : "0",
      "bankLoan"          : "0",
      "govtscheme"        : "0",
      "directCC"          : "0",
      "indirectCC"        : "0",
      "other"             : "0",
      "total"             : "0",
      "remark"            : "",
      "fields"            : fields,
      "selectedBeneficiaries" :[],
      "selectedValues"         : [],    
      "listofBeneficiaries": [],      
      "subActivityDetails" : [],
      "availableSectors"   : [],
      "availableActivity"  : [],
      "availableSubActivity": [],
      
    });
      this.props.history.push('/activity');
      this.setState({
        "editId"              : "",
      });
    // }
  }
  validateFormReq() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
       

      if (!fields["district"]) {
        $("html,body").scrollTop(0);
        formIsValid = false;
        errors["district"] = "This field is required.";
      }     
       if (!fields["block"]) {
        formIsValid = false;
        errors["block"] = "This field is required.";
      }     
      if (!fields["village"]) {
        formIsValid = false;
        errors["village"] = "This field is required.";
      }
    /*  if (!fields["dateofIntervention"]) {
        formIsValid = false;
        errors["dateofIntervention"] = "This field is required.";
      }*/
      if (!fields["sector"]) {
        formIsValid = false;
        errors["sector"] = "This field is required.";
      }          
      if (!fields["typeofactivity"]) {
        formIsValid = false;
        errors["typeofactivity"] = "This field is required.";
      }          
      if (!fields["activity"]) {
        formIsValid = false;
        errors["activity"] = "This field is required.";
      }          
      if (!fields["subactivity"]) {
        formIsValid = false;
        errors["subactivity"] = "This field is required.";
      }          
      if (!fields["unitCost"]) {
        formIsValid = false;
        errors["unitCost"] = "This field is required.";
      }          
      if (!fields["quantity"]) {
        formIsValid = false;
        errors["quantity"] = "This field is required.";
      }          
      if (!fields["bankLoan"]) {
        formIsValid = false;
        errors["bankLoan"] = "This field is required.";
      }          
      if (!fields["govtscheme"]) {
        formIsValid = false;
        errors["govtscheme"] = "This field is required.";
      }
      if (!fields["NABARD"]) {
        formIsValid = false;
        errors["NABARD"] = "This field is required.";
      }          
      if (!fields["LHWRF"]) {
        formIsValid = false;
        errors["LHWRF"] = "This field is required.";
      }          
      if (!fields["directCC"]) {
        formIsValid = false;
        errors["directCC"] = "This field is required.";
      }          
      if (!fields["indirectCC"]) {
        formIsValid = false;
        errors["indirectCC"] = "This field is required.";
      }          
      if (!fields["other"]) {
        formIsValid = false;
        errors["other"] = "This field is required.";
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
    // $("html,body").scrollTop(0);
    this.setState({
      errors: errors
    });
    return formIsValid;
  }

  toglehidden(){
   this.setState({
     shown: !this.state.shown
    });
  }

  edit(id){
    axios({
      method: 'get',
      url: '/api/activityReport/'+id,
    }).then((response)=> {
      var editData = response.data[0];
      console.log("editData",editData);
      console.log("editData",editData.district);
        // getAvailableCenter(center_ID)
      this.getAvailableCenter(this.state.center_ID);
      this.getBlock(this.state.stateCode, editData.district);
      this.getVillages(this.state.stateCode, editData.district, editData.block);

      this.getAvailableActivity(editData.sector_ID);
      this.getAvailableSubActivity(editData.sector_ID, editData.activity_ID)
      console.log( editData.district,editData.village,editData.block);

      this.setState({
        "editData"          : editData,
        "stateCode"         : editData.stateCode,
        "district"          : editData.district,
        "block"             : editData.block,
        "village"           : editData.village,
        "date"              : editData.date,
        "sector"            : editData.sectorName+'|'+editData.sector_ID,
        "typeofactivity"    : editData.typeofactivity,
        "activity"          : editData.activityName+'|'+editData.activity_ID,
        "subactivity"       : editData.subactivityName+'|'+editData.subactivity_ID,
        "subActivityDetails": editData.unit,
        "unitCost"          : editData.unitCost,
        "quantity"          : editData.quantity,
        "totalcost"         : editData.totalcost,
        "LHWRF"             : editData.sourceofFund.LHWRF,
        "NABARD"            : editData.sourceofFund.NABARD,
        "bankLoan"          : editData.sourceofFund.bankLoan,
        "govtscheme"        : editData.sourceofFund.govtscheme,
        "directCC"          : editData.sourceofFund.directCC,
        "indirectCC"        : editData.sourceofFund.indirectCC,
        "other"             : editData.sourceofFund.other,
        "total"             : editData.sourceofFund.total,
        "remark"            : editData.remark,
        "listofBeneficiaries" : editData.listofBeneficiaries,
        "selectedBeneficiaries" : editData.listofBeneficiaries,
        "projectCategoryType"   : editData.projectCategoryType,
        "projectName"           : editData.projectName,
      }, ()=>{
        console.log("edit", this.state.editData)
      });      
      let fields = this.state.fields;
      let errors = {};
      let formIsValid = true;
      this.setState({
        errors: errors
      });
      return formIsValid;
    })
    .catch(function (error) {
      console.log("error = ",error);
    });
    // this.setState({
    //   "editId"              : "",
    // });

  }

  getLength(center_ID){
   /* axios.get('/api/activityReport/count/'+center_ID)
    .then((response)=>{
      console.log('response', response.data);
      this.setState({
        dataCount : response.data.dataLength
      },()=>{
        console.log('dataCount', this.state.dataCount);
      })
    })
    .catch(function(error){
    });*/
  }
  getData(startRange, limitRange, center_ID){ 
   var data = {
      limitRange : limitRange,
      startRange : startRange,
    }
    axios.post('/api/activityReport/list/'+center_ID, data)
    .then((response)=>{
      console.log("response",response);
      var tableData = response.data.map((a, i)=>{
        return {
          _id                        : a._id,
          projectCategoryType        : a.projectCategoryType,
          projectName                : a.projectName,
          date                       : moment(a.date).format('YYYY-MM-DD'),
          place                      : a.place,
          sectorName                 : a.sectorName,
          typeofactivity             : a.typeofactivity,
          activityName               : a.activityName,
          subactivityName            : a.subactivityName,
          unit                       : a.unit,
          unitCost                   : a.unitCost,
          quantity                   : a.quantity,
          totalcost                  : a.totalcost,
          numofBeneficiaries         : a.numofBeneficiaries,
          LHWRF                      : a.LHWRF,
          NABARD                     : a.NABARD,
          bankLoan                   : a.bankLoan,
          govtscheme                 : a.govtscheme,
          directCC                   : a.directCC,
          indirectCC                 : a.indirectCC,
          other                      : a.other,
          total                      : a.total,
          remark                     : a.remark,
        }
      })
      this.setState({
        tableData : tableData
      })
    })
    .catch(function(error){      
      console.log("error = ",error); 
    });
  }

  componentDidMount() {
    $.validator.addMethod("regxDate", function(value, element, regexpr) { 
      return value!=='';
    }, "This field is required.");
    $("#Academic_details").validate({
      rules: {
        dateofIntervention:{
          required: true,
          regxDate: this.refs.dateofIntervention.value
        },
        district: {
          required: true,
        },
        block: {
          required: true,
        },
        village: {
          required: true,
        },
        sector: {
          required: true,
        },
        typeofactivity: {
          required: true,
        },
        activity: {
          required: true,
        },
        subactivity: {
          required: true,
        },
        unitCost: {
          required: true,
        },
        quantity: {
          required: true,
        },
      },
      errorPlacement: function(error, element) {
        if (element.attr("name") == "dateofIntervention"){
          error.insertAfter("#dateofIntervention");
        }
        if (element.attr("name") == "district"){
          error.insertAfter("#district");
        }
        if (element.attr("name") == "block"){
          error.insertAfter("#block");
        }
        if (element.attr("name") == "village"){
          error.insertAfter("#village");
        }
        if (element.attr("name") == "sector"){
          error.insertAfter("#sector");
        }
        if (element.attr("name") == "typeofactivity"){
          error.insertAfter("#typeofactivity");
        }
        if (element.attr("name") == "activity"){
          error.insertAfter("#activity");
        }
        if (element.attr("name") == "subactivity"){
          error.insertAfter("#subactivity");
        }
        if (element.attr("name") == "unitCost"){
          error.insertAfter("#unitCost");
        }
        if (element.attr("name") == "quantity"){
          error.insertAfter("#quantity");
        }
      }
    });
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
    this.getAvailableSectors();
    if(this.state.editId){      
      this.getAvailableActivity(this.state.editSectorId);
      this.edit(this.state.editId);
    }
    var editId = this.props.match.params ? this.props.match.params.id : '';
    this.setState({
      editId : editId
    })
    // var dateObj = new Date();
    // var momentObj = moment(dateObj);
    // var momentString = momentObj.format('YYYY-MM-DD');

    // this.setState({
    //   dateofIntervention :momentString,
    // })
    this.getLength();
    
    this.getBlock(this.state.stateCode, this.state.selectedDistrict);
    const center_ID = localStorage.getItem("center_ID");
    const centerName = localStorage.getItem("centerName");
    // console.log("localStorage =",localStorage.getItem('centerName'));
    // console.log("localStorage =",localStorage);
    this.setState({
      center_ID    : center_ID,
      centerName   : centerName,
    },()=>{
    this.getLength(this.state.center_ID);
    // this.getToggleValue();
    this.getAvailableProjectName();
    this.getAvailableCenter(this.state.center_ID, this.state.stateCode);
    this.getData(this.state.startRange, this.state.limitRange, this.state.center_ID);
    // console.log("center_ID =",this.state.center_ID);
    });
  }

  componentWillReceiveProps(nextProps){
    var editId = nextProps.match.params.id;
    this.getAvailableSectors();      
    this.getAvailableCenter(this.state.center_ID, this.state.stateCode);      
    this.getBlock(this.state.stateCode, this.state.selectedDistrict);
    this.setState({
      "editId" : editId,
    },()=>{
      // console.log('editId componentWillReceiveProps', this.state.editId);
      // this.getAvailableActivity(this.state.editSectorId);
      // this.getAvailableSubActivity(this.state.editSectorId);
      
    })  
    this.edit(editId);
    if(nextProps){
      this.getLength();
    }
  }
   
  getAvailableSectors(){
    axios({
      method: 'get',
      url: '/api/sectors/list',
    }).then((response)=> {
        
        this.setState({
          availableSectors : response.data
        })
    }).catch(function (error) {
      console.log('error', error);
    });
  }
  selectSector(event){
    event.preventDefault();
    this.setState({[event.target.name]:event.target.value});
    var sector_ID = event.target.value.split('|')[1];
    this.setState({
      sector_ID          : sector_ID,
      subActivityDetails : ""
    })
    this.handleChange(event);
    this.getAvailableActivity(sector_ID);
  }

  getAvailableActivity(sector_ID){
    axios({
      method: 'get',
      url: '/api/sectors/'+sector_ID,
    }).then((response)=> {
        this.setState({
          availableActivity : response.data[0].activity
        },()=>{
        })
    }).catch(function (error) {
      console.log("error = ",error);
    });
  }

  selectActivity(event){
    event.preventDefault();
    this.setState({[event.target.name]:event.target.value});
    var activity_ID = event.target.value.split('|')[1];
    this.setState({
      subActivityDetails : ""
    });
    this.handleChange(event);
    this.getAvailableSubActivity(this.state.sector_ID, activity_ID);
  }

  getAvailableSubActivity(sector_ID, activity_ID){
    axios({
      method: 'get',
      url: '/api/sectors/'+sector_ID,
    }).then((response)=> {
      var availableSubActivity = _.flatten(response.data.map((a, i)=>{
          return a.activity.map((b, j)=>{return b._id ===  activity_ID ? b.subActivity : [] });
        }))
      this.setState({
        availableSubActivity : availableSubActivity
      },()=>{
      });
    }).catch(function (error) {
      console.log("error = ",error);
    });    
  }
  selectSubActivity(event){
    event.preventDefault();
    this.setState({[event.target.name]:event.target.value});
    var subActivity_ID = event.target.value.split('|')[1];

    var subActivityDetails = _.flatten(this.state.availableSubActivity.map((a, i)=>{ return a._id === subActivity_ID ? a.unit : ""}))
    this.setState({
      subActivityDetails : subActivityDetails
    })
    this.handleChange(event);

  }

  getAvailableCenter(center_ID){
    // console.log("CID"  ,center_ID);
    axios({
      method: 'get',
      url: '/api/centers/'+center_ID,
      }).then((response)=> {
        function removeDuplicates(data, param){
            return data.filter(function(item, pos, array){
                return array.map(function(mapItem){ return mapItem[param]; }).indexOf(item[param]) === pos;
            })
        }
        var availableDistInCenter= removeDuplicates(response.data[0].villagesCovered, "district");
        // console.log('availableDistInCenter ==========',availableDistInCenter);
        this.setState({
          availableDistInCenter  : availableDistInCenter,
          // availableDistInCenter  : response.data[0].districtsCovered,
          address          : response.data[0].address.stateCode+'|'+response.data[0].address.district,
          // districtsCovered : response.data[0].districtsCovered
        },()=>{
        var stateCode =this.state.address.split('|')[0];
         this.setState({
          stateCode  : stateCode,

        },()=>{
          // console.log("stateCode", this.state.stateCode)
        // this.getDistrict(this.state.stateCode, this.state.districtsCovered);
        });
        })
    }).catch(function (error) {
      console.log("error = ",error);
    });
  }
  camelCase(str){
    return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  }

  districtChange(event){    
    event.preventDefault();
    var district = event.target.value;
    // console.log('district', district);
    this.setState({
      district: district
    },()=>{
      var selectedDistrict = this.state.district;
      // console.log("selectedDistrict",selectedDistrict);
      this.setState({
        selectedDistrict :selectedDistrict
      },()=>{
      // console.log('selectedDistrict',this.state.selectedDistrict);
      this.getBlock(this.state.stateCode, this.state.selectedDistrict);
      })
    });
    this.handleChange(event);
  }
  distChange(event){    
    event.preventDefault();
    var district = event.target.value;
     // console.log('district=', district);
    this.setState({
      district: district
    },()=>{
      var selectedDistrict = this.state.district;
      // console.log("selectedDistrict",selectedDistrict);
      this.setState({
        selectedDistrict :selectedDistrict
      },()=>{
      // console.log('selectedDistrict',this.state.selectedDistrict);
      this.getBlock(this.state.stateCode, this.state.selectedDistrict);
      })
    });
    this.handleChange(event);
  }
  getBlock(stateCode, selectedDistrict){
    console.log("stateCode",stateCode);
    axios({
      method: 'get',
      // url: 'http://locationapi.iassureit.com/api/blocks/get/list/'+selectedDistrict+'/MH/IN',
      url: 'http://locationapi.iassureit.com/api/blocks/get/list/IN/'+stateCode+'/'+selectedDistrict,
    }).then((response)=> {
        // console.log('response ==========', response.data);
        this.setState({
          listofBlocks : response.data
        },()=>{
        // console.log('listofBlocks', this.state.listofBlocks);
        })
    }).catch(function (error) {
      console.log('error', error);
    });
  }
  selectBlock(event){
    event.preventDefault();
    var block = event.target.value;
    this.setState({
      block : block
    },()=>{
      // console.log("block",block);
      this.getVillages(this.state.stateCode, this.state.selectedDistrict, this.state.block);
    });
    this.handleChange(event);
  }
  getVillages(stateCode, selectedDistrict, block){
    console.log(stateCode, selectedDistrict, block);
    axios({
      method: 'get',
      url: 'http://locationapi.iassureit.com/api/cities/get/list/IN/'+stateCode+'/'+selectedDistrict+'/'+block,
      // url: 'http://locationapi.iassureit.com/api/cities/get/list/'+block+'/'+selectedDistrict+'/'+stateCode+'/IN',
    }).then((response)=> {
        // console.log('response ==========', response.data);
        this.setState({
          listofVillages : response.data
        },()=>{
        // console.log('listofVillages', this.state.listofVillages);
        })
    }).catch(function (error) {
      console.log('error', error);
    });
  }
  selectVillage(event){
    event.preventDefault();
    var village = event.target.value;
    this.setState({
      village : village
    },()=>{
      // console.log("village",village);
    });
    this.handleChange(event);
  }
/*  getToggleValue(event){
    console.log("this.state.projectCategoryType",this.state.projectCategoryType);
    if(this.state.projectCategoryType === "LHWRF Grant"){
      this.setState({
        projectCategoryType : "Project Fund",
      },()=>{
        console.log("shown", this.state.projectCategoryType)
      })
    }else{
      this.setState({
        projectCategoryType : "Project Fund",
      },()=>{
        this.setState({
          projectName : "LHWRF Grant",
        })
        console.log("shown",this.state.shown, this.state.projectCategoryType)
      })
    }

  }*/
  
  getAvailableProjectName(){
    axios({
      method: 'get',
      url: '/api/projectMappings/list',
    }).then((response)=> {
      // console.log('responseP', response);
        
        this.setState({
          availableProjects : response.data
        })
    }).catch(function (error) {
      console.log('error', error);
    });
  }

  handleToggle(event){
      // event.preventDefault();
    this.setState({
      [event.target.name] : event.target.value
    },()=>{
      if (this.state.projectCategoryType == "LHWRF Grant") {
        this.setState({
           projectName:"-",
        })
      }
    })
  }


  render() {
    // console.log('state',this.state.total)
     var hidden = {
      display: this.state.shown ? "none" : "block"
    }
    return (
      <div className="container-fluid">
        <div className="row"> 
          <div className="formWrapper">
            <section className="content">
              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent ">
                <div className="row">
                  <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact">
                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageHeader">
                        Activity Reporting                                     
                     </div>
                    <hr className="hr-head container-flui7d row"/>
                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
                      <h4 className="col-lg-6 col-md-6 col-xs-12 col-sm-12 pageSubHeader NOpadding">Activity Details</h4>
                      <ul className="nav nav-pills col-lg-3 col-lg-offset-3 col-md-3 col-md-offset-3 col-sm-12 col-xs-12">
                        <li className="active col-lg-5 col-md-5 col-xs-5 col-sm-5 NOpadding text-center"><a data-toggle="pill"  href="#manualactivity">Manual</a></li>
                        <li className="col-lg-6 col-md-6 col-xs-6 col-sm-6 NOpadding  text-center"><a data-toggle="pill"  href="#bulkactivity">Bulk Upload</a></li>
                      </ul>
                    </div>
                  </div>
                  <div className="tab-content ">
                    <div id="manualactivity"  className="tab-pane fade in active ">
                    <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formLable" id="Academic_details">

                      <div className=" col-lg-3 col-md-3 col-sm-6 col-xs-12 valid_box " >
                        <div className="" id="projectCategoryType" >
                          <label className=" formLable">Category Type<span className="asterix">*</span></label>
                          {/*this.state.type===true ?

                           <div className="switch" onClick={this.handleToggle.bind(this)} >
                              <input type="radio" className="switch-input" name="view" value={this.state.projectCategoryType} id="week"  defaultChecked />
                              <label htmlFor="week" className="formLable switch-label switch-label-off">LHWRF Grant</label>
                              <input type="radio" className="switch-input" name="view" value={this.state.projectCategoryType} id="month"  />
                              <label htmlFor="month" className="formLable switch-label switch-label-on">Project Fund</label>
                              <span className="switch-selection"></span>
                            </div>

                            :

                             <div className="switch" onClick={this.handleToggle.bind(this)} >
                              <input type="radio" className="switch-input" name="view" value={this.state.projectCategoryType} id="week"   />
                              <label htmlFor="week" className="formLable switch-label switch-label-off">LHWRF Grant</label>
                              <input type="radio" className="switch-input" name="view" value={this.state.projectCategoryType} id="month" defaultChecked  />
                              <label htmlFor="month" className="formLable switch-label switch-label-on">Project Fund</label>
                              <span className="switch-selection" ></span>
                            </div>
                        
                          */}
                          <div className="switch" >
                            <input type="radio" className="switch-input pull-left" name="projectCategoryType" checked={this.state.projectCategoryType === "LHWRF Grant"} onChange={this.handleToggle.bind(this)} value="LHWRF Grant" id="week" />
                            <label htmlFor="week" className="formLable switch-label switch-label-off">LHWRF Grant</label>
                            <input type="radio" className="switch-input pull-right" name="projectCategoryType" checked={this.state.projectCategoryType === "Project Fund"} onChange={this.handleToggle.bind(this)} value="Project Fund" id="month"  />
                            <label htmlFor="month" className="formLable switch-label switch-label-on">Project Fund</label>
                            <span className="switch-selection"></span>
                          </div>
                        </div>
                       
                      </div>
                        {console.log("projectCategoryType",this.state.projectCategoryType)}
                      {
                        this.state.projectCategoryType =="Project Fund" ? 

                        <div className=" col-lg-3 col-md-3 col-sm-6 col-xs-12 valid_box">
                          <label className="formLable">Project Name</label>
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="projectName" >
                              <select className="custom-select form-control inputBox" ref="projectName" name="projectName"  value={this.state.projectName} onChange={this.handleChange.bind(this)} >
                                <option  className="hidden" >-- Select --</option>
                                {
                                  this.state.availableProjects && this.state.availableProjects.length > 0  ? 
                                  this.state.availableProjects.map((data, index)=>{
                                    return(
                                      <option key={index} value={(data.projectName)}>{(data.projectName)}</option>
                                    );
                                  })
                                  :
                                  null
                                }  
                              </select>
                            </div>
                            <div className="errorMsg">{this.state.errors.block}</div>
                        </div>
                        : ""
                      } 
                      <br/>
                      
                      <div className="row">
                        <div className=" col-lg-12 col-sm-12 col-xs-12 formLable boxHeight ">
                          
                          <div className="  col-lg-3 col-md-3 col-sm-12 col-xs-12  ">
                            <label className="formLable">Date of Intervention</label>
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="dateofIntervention" >
                              <input type="date" className="form-control inputBox toUpper" name="dateofIntervention" ref="dateofIntervention" value={this.state.dateofIntervention} onChange={this.handleChange.bind(this)} required/>
                            </div>
                            <div className="errorMsg">{this.state.errors.dateofIntervention}</div>
                          </div>
                          <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12  ">
                              <label className="formLable">District</label>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="district" >
                                <select className="custom-select form-control inputBox" ref="district" name="district" value={this.state.district} onChange={this.distChange.bind(this)} >
                                  <option disabled="disabled" selected="true" >-- Select --</option>
                                  {
                                    this.state.availableDistInCenter && this.state.availableDistInCenter.length > 0 ? 
                                    this.state.availableDistInCenter.map((data, index)=>{
                                      // console.log('dta', data);
                                      return(
                                        <option key={index} value={(data.district.split('|')[0])}>{this.camelCase(data.district.split('|')[0])}</option>
                                      );
                                    })
                                    :
                                    null
                                  }
                                </select>
                              </div>
                              <div className="errorMsg">{this.state.errors.district}</div>
                            </div>
                          <div className="  col-lg-3 col-md-3 col-sm-12 col-xs-12  ">
                            <label className="formLable">Block</label>
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="block" >
                              <select className="custom-select form-control inputBox" ref="block" name="block"  value={this.state.block} onChange={this.selectBlock.bind(this)} >
                                <option disabled="disabled" selected="true">-- Select --</option>
                                {
                                  this.state.listofBlocks && this.state.listofBlocks.length > 0  ? 
                                  this.state.listofBlocks.map((data, index)=>{
                                    return(
                                      <option key={index} value={this.camelCase(data.blockName)}>{this.camelCase(data.blockName)}</option>
                                    );
                                  })
                                  :
                                  null
                                }  
                              </select>
                            </div>
                            <div className="errorMsg">{this.state.errors.block}</div>
                          </div>
                         <div className="  col-lg-3 col-md-3 col-sm-12 col-xs-12 ">
                            <label className="formLable">Village</label>
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="village" >
                              <select className="custom-select form-control inputBox" ref="village" name="village" value={this.state.village} onChange={this.selectVillage.bind(this)} >
                                <option disabled="disabled" selected="true">-- Select --</option>
                                {
                                  this.state.listofVillages && this.state.listofVillages.length > 0  ? 
                                  this.state.listofVillages.map((data, index)=>{
                                    return(
                                      <option key={index} value={this.camelCase(data.cityName)}>{this.camelCase(data.cityName)}</option>
                                    );
                                  })
                                  :
                                  null
                                } 
                              </select>
                            </div>
                            <div className="errorMsg">{this.state.errors.village}</div>
                          </div>
                        </div> 
                      </div><br/>
                      <div className="row">
                        <div className=" col-lg-12 col-sm-12 col-xs-12  boxHeight ">
                          <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12 ">
                            <label className="formLable">Sector </label>
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sector" >
                              <select className="custom-select form-control inputBox" ref="sector" name="sector" value={this.state.sector} onChange={this.selectSector.bind(this)} >
                                <option disabled="disabled" selected="true">-- Select --</option>
                                {
                                  this.state.availableSectors && this.state.availableSectors.length >0 ?
                                  this.state.availableSectors.map((data, index)=>{
                                    return(
                                      <option key={data._id} value={data.sector+'|'+data._id}>{data.sector}</option>
                                    );
                                  })
                                  :
                                  null
                                }
                              </select>
                            </div>
                            <div className="errorMsg">{this.state.errors.sector}</div>
                          </div>

                          <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12  ">
                            <label className="formLable">Activity</label>
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="activity" >
                              <select className="custom-select form-control inputBox" ref="activity" name="activity" value={this.state.activity}  onChange={this.selectActivity.bind(this)} >
                                <option disabled="disabled" selected="true">-- Select --</option>
                                {
                                  this.state.availableActivity && this.state.availableActivity.length >0 ?
                                  this.state.availableActivity.map((data, index)=>{
                                    if(data.activityName ){
                                      return(
                                        <option key={data._id} value={data.activityName+'|'+data._id}>{data.activityName}</option>
                                      );
                                    }
                                  })
                                  :
                                  null
                                }
                              </select>
                            </div>
                            <div className="errorMsg">{this.state.errors.activity}</div>
                          </div>


                           <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12  ">
                            <label className="formLable">Sub-Activity</label>
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="subactivity" >
                              <select className="custom-select form-control inputBox" ref="subactivity" name="subactivity"  value={this.state.subactivity} onChange={this.selectSubActivity.bind(this)} >
                                <option disabled="disabled" selected="true">-- Select --</option>
                                  {
                                    this.state.availableSubActivity && this.state.availableSubActivity.length >0 ?
                                    this.state.availableSubActivity.map((data, index)=>{
                                      if(data.subActivityName ){
                                        return(
                                          <option className="" key={data._id} value={data.subActivityName+'|'+data._id} >{data.subActivityName} </option>
                                        );
                                      }
                                    })
                                    :
                                    null
                                  }
                                  
                              </select>
                            </div>
                            <div className="errorMsg">{this.state.errors.subactivity}</div>
                          </div>   



                          <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12  ">
                            <label className="formLable">Activity Type</label>
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="typeofactivity" >
                              <select className="custom-select form-control inputBox" ref="typeofactivity" name="typeofactivity" value={this.state.typeofactivity} onChange={this.handleChange.bind(this)} >
                                <option disabled="disabled" selected="true">-- Select --</option>
                                <option>Common Level Activity</option>
                                 <option>Family Level Activity</option>
                              </select>
                            </div>
                            <div className="errorMsg">{this.state.errors.typeofactivity}</div>
                          </div>




                        </div> 
                      </div><br/>
                      <div className="row ">
                        <div className=" col-lg-12 col-sm-12 col-xs-12  boxHeight ">
                          <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                            <div className=""  >
                              <label className="formLable">Unit of Measurement</label>
                                <div className="form-control inputBox inputBox-main unit">
                                  {this.state.subActivityDetails ? 
                                      <label className="formLable" id="unit">{this.state.subActivityDetails}</label>
                                    :
                                      null
                                  }
                                </div>
                            </div>
                            <div className="errorMsg">{this.state.errors.unit}</div>
                          </div>
                          {/*<div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                            <div className=""  >
                              <label className="formLable">Unit :</label>
                              <input type="text" className="form-control inputBox inputBox-main" id="unit" name="unit " placeholder="" ref="unit" onKeyDown={this.isNumberKey.bind(this)} value={this.state.subActivityDetails ? this.state.subActivityDetails: ""} disabled />
                            </div>
                            <div className="errorMsg">{this.state.errors.unit}</div>
                          </div>*/}
                          <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12 ">
                            <label className="formLable">Unit Cost</label>
                            <div className="col-lg-12 col-sm-12 col-xs-12  input-group inputBox-main" id="unitCost" >
                              <input type="text"   className="form-control inputBox" name="unitCost" placeholder="" ref="unitCost" value={this.state.unitCost} onKeyDown={this.isNumberKey.bind(this)}  onChange={this.handleTotalChange.bind(this)}/>
                            </div>
                            <div className="errorMsg">{this.state.errors.unitCost}</div>
                          </div>
                          <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                            <label className="formLable">Quantity</label>
                            <div className=" col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="quantity" >
                              <input type="text" className="form-control inputBox" name="quantity" placeholder="" ref="quantity" onKeyDown={this.isNumberKey.bind(this)} value={this.state.quantity}  onChange={this.handleTotalChange.bind(this)}/>
                            </div>
                            <div className="errorMsg">{this.state.errors.quantity}</div>
                          </div>
                           <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12 ">
                            <div className=" " id="PassoutYear" >

                              <label className="formLable">Total Cost of Activity :</label>
                            
                              <input type="text" className="form-control inputBox inputBox-main" name="totalcost " placeholder="" ref="totalcost" onKeyDown={this.isNumberKey.bind(this)} value={this.state.totalcost} disabled />
                              
                            </div>
                            <div className="errorMsg">{this.state.errors.totalcost}</div>
                          </div>
                        </div> 
                      </div>
                      <div className="col-lg-12 boxHeightother">
                        <label className="formLable">Remark</label>
                            <div className="col-lg-12 col-sm-12 col-xs-12  input-group inputBox-main" id="remark" >
                              <input type="text"   className="form-control inputBox" name="remark" placeholder="" ref="remark" value={this.state.remark}   onChange={this.handleChange.bind(this)}/>
                            </div>
                            <div className="errorMsg">{this.state.errors.remark}</div>
                      </div>
                      <div className="col-lg-12 ">
                         <hr className=""/>
                      </div>
                      <div className="col-lg-12 ">
                         <div className="pageSubHeader">Sources of Fund</div>
                      </div>
                      <div className="row">
                        <div className=" col-lg-12 col-sm-12 col-xs-12  boxHeight ">
                          <div className=" col-md-4 col-sm-6 col-xs-12 ">
                            <label className="formLable">LHWRF</label>
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="LHWRF" >
                              <input type="text"  className="form-control inputBox " name="LHWRF" placeholder="" ref="LHWRF" onKeyDown={this.isNumberKey.bind(this)} value={this.state.LHWRF}    onChange={this.handleChange.bind(this)} onBlur={this.remainTotal.bind(this)}/>
                            </div>
                            <div className="errorMsg">{this.state.errors.LHWRF}</div>
                          </div>
                          <div className=" col-md-4 col-sm-6 col-xs-12 ">
                            <label className="formLable">NABARD</label>
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="NABARD" >
                              
                              <input type="text" className="form-control inputBox " name="NABARD" placeholder=""ref="NABARD"  onKeyDown={this.isNumberKey.bind(this)} value={this.state.NABARD}  onChange={this.handleChange.bind(this)} onBlur={this.remainTotal.bind(this)}/>
                            </div>
                            <div className="errorMsg">{this.state.errors.NABARD}</div>
                          </div><div className=" col-md-4 col-sm-6 col-xs-12 ">
                            <label className="formLable">Bank Loan</label>
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="bankLoan" >
                              <input type="text" className="form-control inputBox " name="bankLoan" placeholder=""ref="bankLoan"  onKeyDown={this.isNumberKey.bind(this)} value={this.state.bankLoan}  onChange={this.handleChange.bind(this)} onBlur={this.remainTotal.bind(this)}/>
                            </div>
                            <div className="errorMsg">{this.state.errors.bankLoan}</div>
                          </div>
                        </div> 
                      </div><br/>
                      <div className="row">
                        <div className=" col-lg-12 col-sm-12 col-xs-12  boxHeight ">
                          <div className=" col-md-4 col-sm-6 col-xs-12 ">
                            <label className="formLable">Govt. Schemes</label>
                            <div className="col-lg-12 col-sm-12 col-xs-12  input-group inputBox-main" id="govtscheme" >
                              <input type="text"   className="form-control inputBox " name="govtscheme" placeholder="" ref="govtscheme"  value={this.state.govtscheme}  onKeyDown={this.isNumberKey.bind(this)}  onChange={this.handleChange.bind(this)} onBlur={this.remainTotal.bind(this)}/>
                            </div>
                            <div className="errorMsg">{this.state.errors.govtscheme}</div>
                          </div>
                          <div className=" col-md-4 col-sm-6 col-xs-12 ">
                            <label className="formLable">Direct Community Contribution</label>
                            <div className=" col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="directCC" >
                              <input type="text" className="form-control inputBox" name="directCC" placeholder=""ref="directCC"  value={this.state.directCC} onKeyDown={this.isNumberKey.bind(this)} onChange={this.handleChange.bind(this)} onBlur={this.remainTotal.bind(this)}/>
                            </div>
                            <div className="errorMsg">{this.state.errors.directCC}</div>
                          </div>
                          <div className=" col-md-4 col-sm-6 col-xs-12 ">
                            <label className="formLable">Indirect Community Contribution</label>
                            <div className=" col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="indirectCC" >
                              <input type="text" className="form-control inputBox " name="indirectCC" placeholder=""ref="indirectCC"  value={this.state.indirectCC} onKeyDown={this.isNumberKey.bind(this)} onChange={this.handleChange.bind(this)} onBlur={this.remainTotal.bind(this)}/>
                            </div>
                            <div className="errorMsg">{this.state.errors.indirectCC}</div>
                          </div>
                        </div> 
                      </div><br/>
                      <div className="row">
                        <div className=" col-lg-12 col-sm-12 col-xs-12  boxHeight ">
                          <div className=" col-md-4 col-sm-6 col-xs-12 ">
                            <label className="formLable">Other</label>
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="other" >
                              <input type="text"   className="form-control inputBox" name="other" placeholder="" ref="other"  value={this.state.other} onKeyDown={this.isNumberKey.bind(this)} onChange={this.handleChange.bind(this)} onBlur={this.remainTotal.bind(this)}/>
                            </div>
                            <div className="errorMsg">{this.state.errors.other}</div>
                          </div>
                          <div className=" col-md-4 col-sm-6 col-xs-12 ">
                            <div className="" id="total" >
                              <label className="formLable">Total :</label>                            
                               
                                  <div className="form-control inputBox inputBox-main unit">
                                    {this.state.total ? 
                                        <label className="formLable" id="total">{this.state.total}</label>
                                      :
                                      0
                                    }
                                  </div>
                              
                              {/*<label className="formLable">&nbsp;{this.state.total ?  this.state.total : " 0"}</label>
                        */}    </div>
                            <div className="errorMsg">{this.state.errors.total}</div>
                          </div>
                        </div> 
                      </div><br/>
                      <div className="col-lg-12  col-md-12 col-sm-12 col-xs-12 ">
                         <hr className=""/>
                      </div>
                  
                      <div className="tableContainrer">
                        <ListOfBeneficiaries 
                          getBeneficiaries={this.getBeneficiaries.bind(this)}
                          selectedValues={this.state.selectedValues}
                          sendBeneficiary={this.state.selectedBeneficiaries}
                        />
                      </div>
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                        <br/>
                        {
                          this.state.editId ? 
                          <button className=" col-lg-2 btn submit mt pull-right" onClick={this.Update.bind(this)}> Update </button>
                          :
                          <button className=" col-lg-2 btn submit mt pull-right" onClick={this.SubmitActivity.bind(this)}> Submit </button>
                        }
                      </div> 
                      <div className="col-lg-12  col-md-12 col-sm-12 col-xs-12 ">
                        <hr className=""/>
                      </div>
                    </form>
                  </div>
                   <div id="bulkactivity" className="tab-pane fade in ">
                      <BulkUpload url="/api/activityReport/bulk_upload_activities" data={{"centerName" : this.state.centerName, "center_ID" : this.state.center_ID}} uploadedData={this.uploadedData} fileurl="https://iassureitlupin.s3.ap-south-1.amazonaws.com/bulkupload/Activity+Submission.xlsx"/>
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt">
                    <IAssureTable 
                      tableName = "Activity Report"
                      id = "activityReport"
                      tableHeading={this.state.tableHeading}
                      twoLevelHeader={this.state.twoLevelHeader} 
                      dataCount={this.state.dataCount}
                      tableData={this.state.tableData}
                      getData={this.getData.bind(this)}
                      tableObjects={this.state.tableObjects}
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
export default Activity