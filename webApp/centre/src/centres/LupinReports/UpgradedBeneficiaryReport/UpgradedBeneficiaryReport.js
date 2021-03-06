import React, { Component } from 'react';
import $                    from 'jquery';
import axios                from 'axios';
import swal                 from 'sweetalert';
import moment               from 'moment';
import IAssureTable         from "../../../coreAdmin/IAssureTable/IAssureTable.jsx";
import Loader               from "../../../common/Loader.js";

import "./UpgradedBeneficiaryReport.css"
import "../../Reports/Reports.css";
class UpgradedBeneficiaryReport extends Component{
  constructor(props){
    super(props);
    this.state = {
        'currentTabView'    : "Monthly",
        'tableDatas'        : [],
        'reportData'        : {},
        'tableData'         : [],
        "startRange"        : 0,
        "limitRange"        : 10000,
        "district"          : "all",
        "selectedDistrict"  : "all",
        "projectCategoryType": "all",
        "beneficiaryType"    : "all",
        "projectName"        : "all",
        "upgraded"           : "all",
        "twoLevelHeader"    : {
            apply           : false,
            firstHeaderData : [
                {
                    heading : 'Beneficiary Details',
                    mergedColoums : 7,
                    hide : false
                }, 
                {
                    heading : 'Sector Details',
                    mergedColoums : 6,
                    hide : false
                },
            ]
        },
        "tableHeading"      : {
            "date"               : 'Date Of Intervention',
            "projectCategoryType": 'Project Category',
            "projectName"        : 'Project Name',
            "upgraded"           : 'Upgraded',
            "name"               : 'Activity',
            // "sectorName"         : 'Sector',
            // "activityName"       : 'Activity',
            // "subactivityName"    : 'Sub-Activity',
            "familyID"           : 'Family ID',
            "beneficiaryID"      : 'Beneficiary ID',
            "namebeneficiary"    : 'Name of Beneficiary',           
            "uid"                : 'UID',           
            "village"            : 'Village',
            "block"              : 'Block',
            "district"           : 'District',
        },
        "tableObjects"        : {
          paginationApply     : false,
          searchApply         : false,
          downloadApply       : true,
        },   
    }
      window.scrollTo(0, 0);
      this.handleFromChange    = this.handleFromChange.bind(this);
      this.handleToChange      = this.handleToChange.bind(this);
      this.currentFromDate     = this.currentFromDate.bind(this);
      this.currentToDate       = this.currentToDate.bind(this);
  }
  componentDidMount(){
    const center_ID = localStorage.getItem("center_ID");
    const centerName = localStorage.getItem("centerName");
    // console.log("localStorage =",localStorage.getItem('centerName'));
    // console.log("localStorage =",localStorage);
    this.setState({
      center_ID    : center_ID,
      centerName   : centerName,
    },()=>{
    this.getAvailableCenterData(this.state.center_ID);
    // console.log("center_ID =",this.state.center_ID);
    this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.selectedDistrict, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.upgraded);
    });
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
    this.getAvailableProjects();
    this.currentFromDate();
    this.currentToDate();
    this.setState({
      // "center"  : this.state.center[0],
      // "sector"  : this.state.sector[0],
      tableData : this.state.tableData,
    },()=>{
    // console.log('DidMount', this.state.startDate, this.state.endDate,'center_ID', this.state.center_ID,'sector_ID', this.state.sector_ID)
    this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.selectedDistrict, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.upgraded);
    })
    this.handleFromChange = this.handleFromChange.bind(this);
    this.handleToChange = this.handleToChange.bind(this);
  }
 
  componentWillReceiveProps(nextProps){
      this.getAvailableProjects();
      this.currentFromDate();
      this.currentToDate();
      this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.selectedDistrict, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.upgraded);
      // console.log('componentWillReceiveProps', this.state.startDate, this.state.endDate,'center_ID', this.state.center_ID,'sector_ID', this.state.sector_ID)
  }
  handleChange(event){
    event.preventDefault();
    this.setState({
      [event.target.name] : event.target.value
    },()=>{
      this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.selectedDistrict, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.upgraded);
      // console.log('name', this.state)
    });
  }

  getAvailableCenterData(center_ID){
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
        // console.log('availableDistInCenter ============',availableDistInCenter);
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
        // this.getDistrict(this.state.stateCode, this.state.districtsCovered);
        });
        })
    }).catch(function (error) {
      console.log("error"+error);
      if(error.message === "Request failed with status code 401"){
        swal({
            title : "abc",
            text  : "Session is Expired. Kindly Sign In again."
        });
      } 
    });
  } 
  
  districtChange(event){    
    event.preventDefault();
    var district = event.target.value;
    // console.log('district', district);
    this.setState({
      district: district
    },()=>{
      if(this.state.district==="all"){
        var selectedDistrict = this.state.district;
      }else{
        var selectedDistrict = this.state.district.split('|')[0];
      }
      this.setState({
        selectedDistrict :selectedDistrict
      },()=>{
      this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.selectedDistrict, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.upgraded);
      // console.log('selectedDistrict',this.state.selectedDistrict);
      })
    });
  }
  
  camelCase(str){
    return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  }

  selectprojectCategoryType(event){
    event.preventDefault();
    console.log(event.target.value)
    var projectCategoryType = event.target.value;
    this.setState({
        projectCategoryType : projectCategoryType,
    },()=>{
        if(this.state.projectCategoryType === "LHWRF Grant"){
            this.setState({
              projectName : "all",
            },()=>{
              this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.selectedDistrict, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.upgraded);
            })          
        }else if (this.state.projectCategoryType=== "all"){
            this.setState({
              projectName : "all",
            },()=>{
              this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.selectedDistrict, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.upgraded);
            })    
        }else  if(this.state.projectCategoryType=== "Project Fund"){
          this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.selectedDistrict, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.upgraded);
        }
    },()=>{
    })
  }
  

  getAvailableProjects(){
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
      if(error.message === "Request failed with status code 401"){
        swal({
            title : "abc",
            text  : "Session is Expired. Kindly Sign In again."
        });
      }   
    });
  }
  selectprojectName(event){
    event.preventDefault();
    var projectName = event.target.value;
    this.setState({
          projectName : projectName,
        },()=>{
        this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.selectedDistrict, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.upgraded);
        // console.log('startDate', this.state.startDate, 'center_ID', this.state.center_ID,'sector_ID', this.state.sector_ID)
    })
  }
  
  getData(startDate, endDate, center_ID, selectedDistrict, projectCategoryType, projectName, beneficiaryType, upgraded){        
    // console.log(startDate, endDate, center_ID, selectedDistrict, projectCategoryType, projectName, beneficiaryType, upgraded);
    if(center_ID){
      if(startDate && endDate && selectedDistrict && projectCategoryType  && beneficiaryType && upgraded){
        if(selectedDistrict==="all"){
          var url = '/api/reports/upgraded/'+startDate+'/'+endDate+'/'+center_ID+'/all/'+projectCategoryType+'/'+projectName+'/'+beneficiaryType+'/'+upgraded
        }else{
          var url = '/api/reports/upgraded/'+startDate+'/'+endDate+'/'+center_ID+'/'+selectedDistrict+'/'+projectCategoryType+'/'+projectName+'/'+beneficiaryType+'/'+upgraded
        }
        $(".fullpageloader").show();
        axios.get(url)
        .then((response)=>{
          $(".fullpageloader").hide();
          console.log("resp",response);
          var data = response.data
          var tableData = [];
          if(data.length>0){
            data.map((a, i)=>{

              axios.get('/api/beneficiaries/'+a.beneficiaryID)
              .then((response)=>{
                // console.log('response',response)
                tableData.push({
                  _id             : a._id,            
                  date            : moment(a.date).format('DD-MM-YYYY'),
                  projectCategoryType    : a.projectCategoryType ? a.projectCategoryType : "-",
                  projectName            : a.projectName === "all"||0 ? "-" :a.projectName,                  
                  upgraded        : a.upgraded,
                  name            : a.name,
                  // sectorName      : a.sectorName,
                  // activityName    : a.activityName,
                  // subactivityName : a.subactivityName,
                  familyID        : response.data[0].familyID,
                  beneficiaryID   : response.data[0].beneficiaryID,
                  namebeneficiary : response.data[0].surnameOfBeneficiary+' '+response.data[0].firstNameOfBeneficiary+' '+response.data[0].middleNameOfBeneficiary,
                  uid             : response.data[0].uidNumber ? response.data[0].uidNumber : "NA",
                  village         : a.village,
                  block           : a.block,
                  district        : a.district,             
                })
                if(data.length===(i+1)){
                  this.setState({
                    tableData : tableData
                  })
                }
              })
              .catch(function(error){ 
                console.log("error = ",error);
              });
            })
          }else{
            this.setState({
              tableData : []
            })
          }
        })
        .catch(function(error){  
          console.log("error = ",error.message);
          if(error.message === "Request failed with status code 500"){
              $(".fullpageloader").hide();
          }
        });
      }
    }
  }
  handleFromChange(event){
    event.preventDefault();
    const target = event.target;
    const name = target.name;
    var startDate = document.getElementById("startDate").value;
    var endDate = document.getElementById("endDate").value;
    // console.log(Date.parse(startDate));
   
    var dateVal = event.target.value;
    var dateUpdate = new Date(dateVal);
    var startDate = moment(dateUpdate).format('YYYY-MM-DD');
    this.setState({
      [name] : event.target.value,
      startDate:startDate
    },()=>{
    // console.log(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.selectedDistrict, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
    this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.selectedDistrict, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.upgraded);
    // console.log("dateUpdate",this.state.startDate);
    });
  }
  handleToChange(event){
      event.preventDefault();
      const target = event.target;
      const name = target.name;
      var startDate = document.getElementById("startDate").value;
      var endDate = document.getElementById("endDate").value;
     
      var dateVal = event.target.value;
      var dateUpdate = new Date(dateVal);
      var endDate = moment(dateUpdate).format('YYYY-MM-DD');
      this.setState({
         [name] : event.target.value,
         endDate : endDate
      },()=>{
      // console.log("dateUpdate",this.state.endDate);
      this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.selectedDistrict, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.upgraded);
     });
  }

  currentFromDate(){
    if(this.state.startDate){
          var today = this.state.startDate;
          // console.log("localStoragetoday",today);
      }else {
           var today = (new Date());
        var nextDate = today.getDate() - 30;
        today.setDate(nextDate);
        // var newDate = today.toLocaleString();
        var today =  moment(today).format('YYYY-MM-DD');
      }
      this.setState({
         startDate :today
      },()=>{
      });
      return today;
  }

  currentToDate(){
      if(this.state.endDate){
          var today = this.state.endDate;
          // console.log("newToDate",today);
      }else {
          var today =  moment(new Date()).format('YYYY-MM-DD');
      }
      // console.log("nowto",today)
      this.setState({
         endDate :today
      },()=>{
      });
      return today;
      // this.handleToChange();
  }
  getSearchText(searchText, startRange, limitRange){
      // console.log(searchText, startRange, limitRange);
      this.setState({
          tableData : []
      });
  }
  changeReportComponent(event){
    var currentComp = $(event.currentTarget).attr('id');

    this.setState({
      'currentTabView': currentComp,
    })
  }
    onBlurEventFrom(){
        var startDate = document.getElementById("startDate").value;
        var endDate = document.getElementById("endDate").value;
        if ((Date.parse(endDate) < Date.parse(startDate))) {
            swal("Start date","From date should be less than To date");
            this.refs.startDate.value="";
        }
    }
    onBlurEventTo(){
        var startDate = document.getElementById("startDate").value;
        var endDate = document.getElementById("endDate").value;
          if ((Date.parse(startDate) > Date.parse(endDate))) {
            swal("End date","To date should be greater than From date");
            this.refs.endDate.value="";
        }
    }
  render(){
    return( 
      <div className="container-fluid col-lg-12 col-md-12 col-xs-12 col-sm-12">
        <Loader type="fullpageloader" />
        <div className="row">
          <div className="formWrapper"> 
            <section className="content">
              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent">
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact">
                        <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageSubHeader">
                          Beneficiary Report
                        </div>
                    </div>
                    <hr className="hr-head"/>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">                      
                        <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12 valid_box ">
                          <label className="formLable">District</label><span className="asterix"></span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="district" >
                            <select className="custom-select form-control inputBox"ref="district" name="district" value={this.state.district} onChange={this.districtChange.bind(this)}  >
                              <option  className="hidden" >-- Select --</option>
                              <option value="all" >All</option>
                                {
                                this.state.availableDistInCenter && this.state.availableDistInCenter.length > 0 ? 
                                this.state.availableDistInCenter.map((data, index)=>{
                                  // console.log("data",data)
                                  return(
                                    /*<option key={index} value={this.camelCase(data.split('|')[0])}>{this.camelCase(data.split('|')[0])}</option>*/
                                    <option key={index} value={(data.district+'|'+data._id)}>{this.camelCase(data.district.split('|')[0])}</option>

                                  );
                                })
                                :
                                null
                              }                               
                            </select>
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12 valid_box">
                          <label className="formLable">Upgraded</label><span className="asterix"></span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="upgraded" >
                            <select className="custom-select form-control inputBox" ref="upgraded" name="upgraded" value={this.state.upgraded} onChange={this.handleChange.bind(this)}>
                              <option  className="hidden" >--Select--</option>
                              <option value="all" >All</option>
                              <option value="upgraded">Upgraded</option>
                              <option value="not_upgraded" >Not Upgraded</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12 valid_box">
                            <label className="formLable">Beneficiary</label><span className="asterix"></span>
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="beneficiaryType" >
                              <select className="custom-select form-control inputBox" ref="beneficiaryType" name="beneficiaryType" value={this.state.beneficiaryType} onChange={this.handleChange.bind(this)}>
                                <option  className="hidden" >--Select--</option>
                                <option value="all" >All</option>
                                <option value="withUID" >With UID</option>
                                <option value="withoutUID" >Without UID</option>
                                
                              </select>
                            </div>
                        </div> 
                        <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12 valid_box">
                            <label className="formLable">Project Category</label><span className="asterix"></span>
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="projectCategoryType" >
                              <select className="custom-select form-control inputBox" ref="projectCategoryType" name="projectCategoryType" value={this.state.projectCategoryType} onChange={this.selectprojectCategoryType.bind(this)}>
                                <option  className="hidden" >--Select--</option>
                                <option value="all" >All</option>
                                <option value="LHWRF Grant" >LHWRF Grant</option>
                                <option value="Project Fund">Project Fund</option>
                                
                              </select>
                            </div>
                        </div>
                        {
                            this.state.projectCategoryType === "Project Fund" ?
                            <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12 valid_box">
                              <label className="formLable">Project Name</label><span className="asterix"></span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="projectName" >
                                <select className="custom-select form-control inputBox" ref="projectName" name="projectName" value={this.state.projectName} onChange={this.selectprojectName.bind(this)}>
                                  <option  className="hidden" >--Select--</option>
                                   <option value="all" >All</option>
                                  {
                                    this.state.availableProjects && this.state.availableProjects.length >0 ?
                                    this.state.availableProjects.map((data, index)=>{
                                      return(
                                        <option key={data._id} value={data.projectName}>{data.projectName}</option>
                                      );
                                    })
                                    :
                                    null
                                  }
                                </select>
                              </div>
                            </div>
                        : 
                        ""
                        } 
                        <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12 valid_box">
                            <label className="formLable">From</label><span className="asterix"></span>
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sector" >
                                <input onChange={this.handleFromChange} onBlur={this.onBlurEventFrom.bind(this)} name="startDate" ref="startDate" id="startDate" value={this.state.startDate} type="date" className="custom-select form-control inputBox" placeholder=""  />
                            </div>
                        </div>
                        <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12 valid_box">
                            <label className= "formLable">To</label><span className="asterix"></span>
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sector" >
                                <input onChange={this.handleToChange} onBlur={this.onBlurEventTo.bind(this)} name="endDate" ref="endDate" id="endDate" value={this.state.endDate} type="date" className="custom-select form-control inputBox" placeholder=""   />
                            </div>
                        </div>
                    </div>  
                    <div className="marginTop11">
                        <div className="">
                            <div className="report-list-downloadMain col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <IAssureTable
                                    tableName = "Upgraded Beneficiary Report"
                                    id = "UpgradedBeneficiaryReport" 
                                    completeDataCount={this.state.tableDatas.length}
                                    twoLevelHeader={this.state.twoLevelHeader} 
                                    editId={this.state.editSubId} 
                                    getData={this.getData.bind(this)} 
                                    tableHeading={this.state.tableHeading} 
                                    tableData={this.state.tableData} 
                                    tableObjects={this.state.tableObjects}
                                    getSearchText={this.getSearchText.bind(this)}/>
                            </div>
                        </div>
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
export default UpgradedBeneficiaryReport