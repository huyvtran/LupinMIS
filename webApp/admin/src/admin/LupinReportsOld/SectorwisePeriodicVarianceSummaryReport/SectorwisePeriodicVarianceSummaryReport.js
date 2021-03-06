import React, { Component } from 'react';
import $                    from 'jquery';
import axios                from 'axios';
import swal                 from 'sweetalert';
import moment               from 'moment';
import Loader               from "../../../common/Loader.js";
import IAssureTable         from "../../../coreAdmin/IAssureTable/IAssureTable.jsx";
import "./SectorwisePeriodicVarianceSummaryReport.css";
import "../../Reports/Reports.css";
class SectorwiseAnnualCompletionSummaryReport extends Component{
	constructor(props){
    super(props);
    this.state = {
        'currentTabView'    : "Monthly",
        'tableDatas'        : [],
        'reportData'        : {},
        'tableData'         : [],
        "startRange"        : 0,
        "limitRange"        : 10000,
        "center_ID"         : "all",
        "center"            : "all",
        "projectCategoryType": "all",
        "beneficiaryType"    : "all",
        "projectName"        : "all",
        "startDate"         : "",
        "endDate"           : "",
        "twoLevelHeader"    : {
            apply           : true,
            firstHeaderData : [
                {
                    heading : 'Sector Details',
                    mergedColoums : 4,
                    hide : false
                },
                {
                    heading : 'Budget Plan',
                    mergedColoums : 2,
                    hide : false
                },
                {
                    heading : "Source of Financial Plan (Periodic) 'Lakh'",
                    mergedColoums : 7,
                    hide : true
                },
                {
                    heading : "Periodic Achievements",
                    mergedColoums : 2,
                    hide : false
                },
                {
                    heading : "Source of Financial Achievement (Periodic) 'Lakh'",
                    mergedColoums : 7,
                    hide : true
                },
                {
                    heading : "",
                    mergedColoums : 1,
                    hide : true
                },
                {
                    heading : "Source wise Financial Variance Report (Periodic) 'Lakh'",
                    mergedColoums : 7,
                    hide : true
                },
            ]
        },
        "tableHeading"      : {
            "projectCategoryType"                : 'Project Category',
            "projectName"                        : 'Project Name',
            "name"                               : 'Sector',
            "annualPlan_TotalBudget_L"           : "Annual Budget Plan 'Lakh'",
            "monthlyPlan_TotalBudget_L"          : 'Periodic Budget plan "Lakh"', 
            "monthlyPlan_LHWRF_L"                : 'LHWRF',
            "monthlyPlan_NABARD_L"               : 'NABARD',
            "monthlyPlan_Bank_Loan_L"            : 'Bank Loan',
            "monthlyPlan_Govt_L"                 : 'Government',
            "monthlyPlan_DirectCC_L"             : 'DirectCC',
            "monthlyPlan_IndirectCC_L"           : 'IndirectCC',
            "monthlyPlan_Other_L"                : 'Others',
            "achievement_TotalBudget_L"          : 'Financial', 
            "Per_Periodic"                         : '% Achievement',
            "achievement_LHWRF_L"                : 'LHWRF',
            "achievement_NABARD_L"               : 'NABARD',
            "achievement_Bank_Loan_L"            : 'Bank Loan',
            "achievement_Govt_L"                 : 'Government',
            "achievement_DirectCC_L"             : 'DirectCC',
            "achievement_IndirectCC_L"           : 'IndirectCC',
            "achievement_Other_L"                : 'Others',
            "variance_monthlyPlan_TotalBudget_L" : 'Financial Variance (Periodic)',
            "variance_monthlyPlan_LHWRF_L"       : 'LHWRF',
            "variance_monthlyPlan_NABARD_L"      : 'NABARD',
            "variance_monthlyPlan_Bank_Loan_L"   : 'Bank Loan',
            "variance_monthlyPlan_Govt_L"        : 'Government',
            "variance_monthlyPlan_DirectCC_L"    : 'DirectCC',
            "variance_monthlyPlan_IndirectCC_L"  : 'IndirectCC',
            "variance_monthlyPlan_Other_L"       : 'Others',           
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
        this.getAvailableCenters = this.getAvailableCenters.bind(this);
        this.getAvailableSectors = this.getAvailableSectors.bind(this);
    }

    componentDidMount(){
        axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");  
        this.getAvailableCenters();
        this.getAvailableSectors();
        this.getAvailableProjects();
        this.currentFromDate();
        this.currentToDate();
        this.setState({
          tableData : this.state.tableData,
        },()=>{
        this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
        })
        this.handleFromChange = this.handleFromChange.bind(this);
        this.handleToChange = this.handleToChange.bind(this);
    }   
    componentWillReceiveProps(nextProps){
        this.getAvailableProjects();
        this.getAvailableCenters();
        this.getAvailableSectors();
        this.currentFromDate();
        this.currentToDate();
        this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
    }
    handleChange(event){
        event.preventDefault();
        this.setState({
          [event.target.name] : event.target.value
        },()=>{
            this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
        });
    }
    getAvailableCenters(){
        axios({
          method: 'get',
          url: '/api/centers/list',
        }).then((response)=> {
          this.setState({
            availableCenters : response.data,
          })
        }).catch(function (error) {  
          
        });
    } 
    selectCenter(event){
        var selectedCenter = event.target.value;
        this.setState({
          [event.target.name] : event.target.value,
          selectedCenter : selectedCenter,
        },()=>{
          if(this.state.selectedCenter==="all"){
            var center = this.state.selectedCenter;
          }else{
            var center = this.state.selectedCenter.split('|')[1];
          }
          this.setState({
            center_ID :center,            
          },()=>{
            this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
          })
        });
    } 
    getAvailableSectors(){
        axios({
          method: 'get',
          url: '/api/sectors/list',
        }).then((response)=> {
            this.setState({
              availableSectors : response.data,
            },()=>{
           
          })
        }).catch(function (error) {  
          console.log("error = ",error);
       
        });
    }
    selectSector(event){
        event.preventDefault();
        this.setState({
          [event.target.name]:event.target.value
        });
        if(event.target.value==="all"){
            var sector_id = event.target.value;
        }else{
            var sector_id = event.target.value.split('|')[1];
        }
        this.setState({
          sector_ID : sector_id,
        },()=>{
       this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
      })
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
                    this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
                })          
            }else if (this.state.projectCategoryType=== "all"){
                this.setState({
                  projectName : "all",
                },()=>{
                    this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
                })    
            }else  if(this.state.projectCategoryType=== "Project Fund"){
                this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
            }
        },()=>{
        })
      }
    getAvailableProjects(){
        axios({
          method: 'get',
          url: '/api/projectMappings/list',
        }).then((response)=> {
          this.setState({
            availableProjects : response.data
          })
        }).catch(function (error) {
          console.log('error', error);
         
        });
    }
    selectprojectName(event){
        event.preventDefault();
        var projectName = event.target.value;
        this.setState({
              projectName : projectName,
            },()=>{
            this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
        })
    }

    getData(startDate, endDate, center_ID, projectCategoryType, projectName, beneficiaryType){      
    console.log(startDate, endDate, center_ID, projectCategoryType, projectName, beneficiaryType)  
        if(startDate && endDate && center_ID && projectCategoryType  && beneficiaryType){ 
            if(center_ID==="all"){
                $(".fullpageloader").show();

                axios.get('/api/reports/sector_annual_achievement_reports/'+startDate+'/'+endDate+'/all/'+projectCategoryType+'/'+projectName+'/'+beneficiaryType)
                .then((response)=>{
                    console.log("resp",response);
                    $(".fullpageloader").hide();
                      var tableData = response.data.map((a, i)=>{
                        return {
                            _id                                       : a._id,       
                            projectCategoryType                       : a.projectCategoryType ? a.projectCategoryType : "-",
                            projectName                               : a.projectName === 0 ? "-" :a.projectName,       
                            name                                      : a.name,
                            annualPlan_TotalBudget_L                  : a.annualPlan_TotalBudget_L,
                            monthlyPlan_TotalBudget_L                 : a.monthlyPlan_TotalBudget_L,                
                            monthlyPlan_LHWRF_L                       : a.monthlyPlan_LHWRF_L,
                            monthlyPlan_NABARD_L                      : a.monthlyPlan_NABARD_L,
                            monthlyPlan_Bank_Loan_L                   : a.monthlyPlan_Bank_Loan_L,
                            monthlyPlan_Govt_L                        : a.monthlyPlan_Govt_L,
                            monthlyPlan_DirectCC_L                    : a.monthlyPlan_DirectCC_L,
                            monthlyPlan_IndirectCC_L                  : a.monthlyPlan_IndirectCC_L,
                            monthlyPlan_Other_L                       : a.monthlyPlan_Other_L,
                            achievement_TotalBudget_L                 : a.achievement_TotalBudget_L,
                            Per_Periodic                              : a.Per_Periodic,
                            achievement_LHWRF_L                       : a.achievement_LHWRF_L,
                            achievement_NABARD_L                      : a.achievement_NABARD_L,
                            achievement_Bank_Loan_L                   : a.achievement_Bank_Loan_L,
                            achievement_Govt_L                        : a.achievement_Govt_L,
                            achievement_DirectCC_L                    : a.achievement_DirectCC_L,
                            achievement_IndirectCC_L                  : a.achievement_IndirectCC_L,
                            achievement_Other_L                       : a.achievement_Other_L,
                            variance_monthlyPlan_TotalBudget_L        : a.variance_monthlyPlan_TotalBudget_L,
                            variance_monthlyPlan_LHWRF_L              : a.variance_monthlyPlan_LHWRF_L,
                            variance_monthlyPlan_NABARD_L             : a.variance_monthlyPlan_NABARD_L,
                            variance_monthlyPlan_Bank_Loan_L          : a.variance_monthlyPlan_Bank_Loan_L,
                            variance_monthlyPlan_Govt_L               : a.variance_monthlyPlan_Govt_L,
                            variance_monthlyPlan_DirectCC_L           : a.variance_monthlyPlan_DirectCC_L,
                            variance_monthlyPlan_IndirectCC_L         : a.variance_monthlyPlan_IndirectCC_L,
                            variance_monthlyPlan_Other_L              : a.variance_monthlyPlan_Other_L
                        }
                    })  
                    this.setState({
                        tableData : tableData
                    },()=>{
                    })
                })
                .catch(function(error){  
                  console.log("error = ",error.message);
                  if(error.message === "Request failed with status code 500"){
                      $(".fullpageloader").hide();
                  }
                });
            }else{
                $(".fullpageloader").show();
                axios.get('/api/reports/sector_annual_achievement_reports/'+startDate+'/'+endDate+'/'+center_ID+'/'+projectCategoryType+'/'+projectName+'/'+beneficiaryType)
                .then((response)=>{
                  console.log("resp",response);
                  $(".fullpageloader").hide();
                  var tableData = response.data.map((a, i)=>{
                return {
                        _id                                       : a._id,       
                        projectCategoryType                       : a.projectCategoryType ? a.projectCategoryType : "-",
                        projectName                               : a.projectName === 0 ? "-" :a.projectName,       
                        name                                      : a.name,
                        annualPlan_TotalBudget_L                  : a.annualPlan_TotalBudget_L,
                        monthlyPlan_TotalBudget_L                 : a.monthlyPlan_TotalBudget_L,                
                        monthlyPlan_LHWRF_L                       : a.monthlyPlan_LHWRF_L,
                        monthlyPlan_NABARD_L                      : a.monthlyPlan_NABARD_L,
                        monthlyPlan_Bank_Loan_L                   : a.monthlyPlan_Bank_Loan_L,
                        monthlyPlan_Govt_L                        : a.monthlyPlan_Govt_L,
                        monthlyPlan_DirectCC_L                    : a.monthlyPlan_DirectCC_L,
                        monthlyPlan_IndirectCC_L                  : a.monthlyPlan_IndirectCC_L,
                        monthlyPlan_Other_L                       : a.monthlyPlan_Other_L,
                        achievement_TotalBudget_L                 : a.achievement_TotalBudget_L,
                        Per_Periodic                              : a.Per_Periodic,
                        achievement_LHWRF_L                       : a.achievement_LHWRF_L,
                        achievement_NABARD_L                      : a.achievement_NABARD_L,
                        achievement_Bank_Loan_L                   : a.achievement_Bank_Loan_L,
                        achievement_Govt_L                        : a.achievement_Govt_L,
                        achievement_DirectCC_L                    : a.achievement_DirectCC_L,
                        achievement_IndirectCC_L                  : a.achievement_IndirectCC_L,
                        achievement_Other_L                       : a.achievement_Other_L,
                        variance_monthlyPlan_TotalBudget_L        : a.variance_monthlyPlan_TotalBudget_L,
                        variance_monthlyPlan_LHWRF_L              : a.variance_monthlyPlan_LHWRF_L,
                        variance_monthlyPlan_NABARD_L             : a.variance_monthlyPlan_NABARD_L,
                        variance_monthlyPlan_Bank_Loan_L          : a.variance_monthlyPlan_Bank_Loan_L,
                        variance_monthlyPlan_Govt_L               : a.variance_monthlyPlan_Govt_L,
                        variance_monthlyPlan_DirectCC_L           : a.variance_monthlyPlan_DirectCC_L,
                        variance_monthlyPlan_IndirectCC_L         : a.variance_monthlyPlan_IndirectCC_L,
                        variance_monthlyPlan_Other_L              : a.variance_monthlyPlan_Other_L
                    }
                })  
                  this.setState({
                    tableData : tableData
                  },()=>{
                  })
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
        if ((Date.parse(endDate) <= Date.parse(startDate))) {
            swal("Start date","From date should be less than To date");
            this.refs.startDate.value="";
        }
        var dateVal = event.target.value;
        var dateUpdate = new Date(dateVal);
        var startDate = moment(dateUpdate).format('YYYY-MM-DD');
        this.setState({
           [name] : event.target.value,
           startDate:startDate
        },()=>{
            this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
        });
    }
    handleToChange(event){
        event.preventDefault();
        const target = event.target;
        const name = target.name;
        var startDate = document.getElementById("startDate").value;
        var endDate = document.getElementById("endDate").value;
        if ((Date.parse(startDate) >= Date.parse(endDate))) {
            swal("End date","To date should be greater than From date");
            this.refs.endDate.value="";
        }
        var dateVal = event.target.value;
        var dateUpdate = new Date(dateVal);
        var endDate = moment(dateUpdate).format('YYYY-MM-DD');
        this.setState({
           [name] : event.target.value,
           endDate : endDate
        },()=>{
          this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
        });
    }

    currentFromDate(){
        if(this.state.startDate){
            var today = this.state.startDate;
        }else {
            var today = (new Date());
            var nextDate = today.getDate() - 30;
            today.setDate(nextDate);
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
        }else {
            var today =  moment(new Date()).format('YYYY-MM-DD');
        }
      
        this.setState({
           endDate :today
        },()=>{
        });
        return today;
    }
    getSearchText(searchText, startRange, limitRange){
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
                                        {/*Sector wise Periodic Variance Summary Report*/}           
                                        Sector Financial Variance Report        
                                    </div>
                                </div>
                                    <hr className="hr-head"/>
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                                    <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12 valid_box">
                                        <label className="formLable">Center</label><span className="asterix"></span>
                                        <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="center" >
                                            <select className="custom-select form-control inputBox" ref="center" name="center" value={this.state.center} onChange={this.selectCenter.bind(this)} >
                                                <option className="hidden" >-- Select --</option>
                                                <option value="all" >All</option>
                                                {
                                                  this.state.availableCenters && this.state.availableCenters.length >0 ?
                                                  this.state.availableCenters.map((data, index)=>{
                                                    return(
                                                      <option key={data._id} value={data.centerName+'|'+data._id}>{data.centerName}</option>
                                                    );
                                                  })
                                                  :
                                                  null
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12 valid_box ">
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
                                    <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12 valid_box ">
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
                                </div>
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                                    <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12 valid_box ">
                                        <label className="formLable">From</label><span className="asterix"></span>
                                        <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sector" >
                                            <input onChange={this.handleFromChange} onBlur={this.onBlurEventFrom.bind(this)} name="startDate" ref="startDate" id="startDate" value={this.state.startDate} type="date" className="custom-select form-control inputBox" placeholder=""  />
                                        </div>
                                    </div>
                                    <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12valid_box valid_box ">
                                        <label className="formLable">To</label><span className="asterix"></span>
                                        <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sector" >
                                            <input onChange={this.handleToChange} onBlur={this.onBlurEventTo.bind(this)} name="endDate" ref="endDate" id="endDate" value={this.state.endDate} type="date" className="custom-select form-control inputBox" placeholder=""   />
                                        </div>
                                    </div>  
                                  </div>  
                                <div className="marginTop11">
                                    <div className="report-list-downloadMain col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <IAssureTable 
                                            tableName = "Sectorwise Periodic Variance Summary Report"
                                            id = "SectorwisePeriodicVarianceSummaryReport"
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
                    </section>
                </div>
            </div>
        </div>
    );
  }
}
export default SectorwiseAnnualCompletionSummaryReport