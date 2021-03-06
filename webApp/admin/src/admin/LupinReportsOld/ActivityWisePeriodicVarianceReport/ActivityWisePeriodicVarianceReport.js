import React, { Component } from 'react';
import $                    from 'jquery';
import _                    from 'underscore';
import swal                 from 'sweetalert';
import axios                from 'axios';
import moment               from 'moment';
import IAssureTable         from "../../../coreAdmin/IAssureTable/IAssureTable.jsx";
import Loader               from "../../../common/Loader.js";

import "./ActivityWisePeriodicVarianceReport.css";
import "../../Reports/Reports.css";

class ActivityWisePeriodicVarianceReport extends Component{
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
            "sector_ID"         : "all", 
            "center"            : "all",
            "sector"            : "all",
            "activity_ID"       : "all",
            "activity"          : "all",
            "subactivity"       : "all",
            "subActivity_ID"    : "all",
            "projectCategoryType": "all",
            "beneficiaryType"    : "all",
            "projectName"        : "all",
            "startDate"         : "",
            "endDate"           : "",
            // "sector"            : "",
            // "sector_ID"         : "",
            // "center"            : "",
            // "center_ID"         : "",
            // "dataApiUrl"        : "/api/masternotifications/list",
            "twoLevelHeader"    : {
                apply           : true,
                firstHeaderData : [
                    {
                        heading : 'Activity Details',
                        mergedColoums : 5,
                        hide : false
                    },
                    {
                        heading : "Annual Plan 'Lakh'",
                        mergedColoums : 3,
                        hide : false
                    },
                    {
                        heading : "Physical and Financial Periodic Plan 'Lakh'",
                        mergedColoums : 10,
                        hide : false
                    },
                    {
                        heading : "Physical and Financial Achievement 'Lakh'",
                        mergedColoums : 10,
                        hide : false
                    },
                    {
                        heading : "Agency wise Variance Periodic Report 'Lakh'",
                        mergedColoums : 10,
                        hide : true
                    },
                ]
            },
            "tableHeading"      : {
                "projectCategoryType"                       : 'Project Category',
                "projectName"                               : 'Project Name',
                "name"                                      : 'Activity & Sub-Activity',
                "unit"                                      : 'Unit',
                "annualPlan_UnitCost_L"                     : 'Unit Cost', 
                "annualPlan_PhysicalUnit"                   : 'Phy Units', 
                "annualPlan_TotalBudget_L"                  : "Total Budget",

                "monthlyPlan_UnitCost_L"                    : 'Unit Cost', 
                "monthlyPlan_PhysicalUnit"                  : 'Phy Units', 
                "monthlyPlan_TotalBudget_L"                 : "Total Budget 'Lakh'",
                "monthlyPlan_LHWRF_L"                       : 'LHWRF',
                "monthlyPlan_NABARD_L"                      : 'NABARD',
                "monthlyPlan_Bank_Loan_L"                   : 'Bank',
                "monthlyPlan_DirectCC_L"                    : 'DirectCC',
                "monthlyPlan_IndirectCC_L"                  : 'IndirectCC',
                "monthlyPlan_Govt_L"                        : 'Government',
                "monthlyPlan_Other_L"                       : 'Others',

                "achievement_UnitCost_L"                      : 'Unit Cost', 
                "achievement_PhysicalUnit"                  : 'Phy Units', 
                "achievement_TotalBudget_L"                 : "Financial Total 'Lakh'",
                "achievement_LHWRF_L"                       : 'LHWRF',
                "achievement_NABARD_L"                      : 'NABARD',
                "achievement_Bank_Loan_L"                   : 'Bank Loan',
                "achievement_DirectCC_L"                    : 'DirectCC',
                "achievement_IndirectCC_L"                  : 'IndirectCC',
                "achievement_Govt_L"                        : 'Government',
                "achievement_Other_L"                       : 'Others',

                "variance_monthlyPlan_UnitCost_L"             : 'Unit Cost', 
                "variance_monthlyPlan_PhysicalUnit"         : 'Phy Units', 
                "variance_monthlyPlan_TotalBudget_L"        : "Financial Total 'Lakh'",
                "variance_monthlyPlan_LHWRF_L"              : 'LHWRF',
                "variance_monthlyPlan_NABARD_L"             : 'NABARD',
                "variance_monthlyPlan_Bank_Loan_L"          : 'Bank Loan',
                "variance_monthlyPlan_DirectCC_L"           : 'DirectCC',
                "variance_monthlyPlan_IndirectCC_L"         : 'IndirectCC',
                "variance_monthlyPlan_Govt_L"               : 'Government',
                "variance_monthlyPlan_Other_L"              : 'Others',
            },
            "tableObjects"        : {
                paginationApply     : false,
                downloadApply       : true,
                searchApply         : false,
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
        this.getAvailableProjects();
        this.getAvailableCenters();
        this.getAvailableSectors();
        this.currentFromDate();
        this.currentToDate();
        this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);
        this.setState({
          // "center"  : this.state.center[0],
          // "sector"  : this.state.sector[0],
          tableData : this.state.tableData,
        },()=>{
        this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);
        })
        this.handleFromChange = this.handleFromChange.bind(this);
        this.handleToChange = this.handleToChange.bind(this);
    }
   
    componentWillReceiveProps(nextProps){
        this.getAvailableCenters();
        this.getAvailableProjects();
        this.getAvailableSectors();
        this.currentFromDate();
        this.currentToDate();
        this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);
    }
    handleChange(event){
        event.preventDefault();
        this.setState({
          [event.target.name] : event.target.value
        },()=>{
        this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);
        });
    }
    getAvailableCenters(){
        axios({
          method: 'get',
          url: '/api/centers/list',
        }).then((response)=> {
          this.setState({
            availableCenters : response.data,
            // center           : response.data[0].centerName+'|'+response.data[0]._id
          },()=>{
          })
        }).catch(function (error) {
           console.log("error = ",error);
           
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
            this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);
            // console.log('startDate', this.state.startDate, 'center_ID', this.state.center_ID,'sector_ID', this.state.sector_ID)
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
              // sector           : response.data[0].sector+'|'+response.data[0]._id
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
            activity_ID    : "all",
            subActivity_ID : "all",
            activity       : "all",
            subactivity    : "all",
        },()=>{
            this.getAvailableActivity(this.state.sector_ID);
            this.getAvailableSubActivity(this.state.sector_ID, this.state.activity_ID);
            this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);
        })
    }
    getAvailableActivity(sector_ID){
        if(sector_ID){
          axios({
            method: 'get',
            url: '/api/sectors/'+sector_ID,
          }).then((response)=> {
            if(response&&response.data[0]){
              this.setState({
                availableActivity : response.data[0].activity
              })
            }
          }).catch(function (error) {
            console.log("error = ",error);
          });
        }
    }
    selectActivity(event){
        event.preventDefault();
        this.setState({[event.target.name]:event.target.value});
        if(event.target.value==="all"){
          var activity_ID = event.target.value;
        }else{
          var activity_ID = event.target.value.split('|')[1];
        }
        this.setState({
          activity_ID : activity_ID,
          subActivity_ID : "all",
          subactivity    : "all",
        },()=>{
            this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);
          this.getAvailableSubActivity(this.state.sector_ID, this.state.activity_ID);
        })
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
          });
        }).catch(function (error) {
          console.log("error = ",error);
        });    
    }
    selectSubActivity(event){
        event.preventDefault();
        this.setState({[event.target.name]:event.target.value});
        if(event.target.value==="all"){
          var subActivity_ID = event.target.value;
        }else{
          var subActivity_ID = event.target.value.split('|')[1];
        }
        this.setState({
          subActivity_ID : subActivity_ID,
        },()=>{
            this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);
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
                    this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);
                })          
            }else if (this.state.projectCategoryType=== "all"){
                this.setState({
                  projectName : "all",
                },()=>{
                    this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);
                })    
            }else  if(this.state.projectCategoryType=== "Project Fund"){
                this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);
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
            // console.log('startDate', this.state.startDate, 'center_ID', this.state.center_ID,'sector_ID', this.state.sector_ID)
            this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);
        })
    }

    addCommas(x) {
        if(x===0){
            return parseInt(x)
        }else{
            x=x.toString();
            if(x.includes('%')){
                return x;
        }else 
            if(x.includes('-')){
                var lastN = x.split('-')[1];
                var lastThree = lastN.substring(lastN.length-3);
                var otherNumbers = lastN.substring(0,lastN.length-3);
                if(otherNumbers !== '')
                    lastThree = ',' + lastThree;
                var res = "-" + otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
                // console.log("x",x,"lastN",lastN,"res",res)
                return(res);
            }else{
                if(x.includes('.')){
                    var pointN = x.split('.')[1];
                    var lastN = x.split('.')[0];
                    var lastThree = lastN.substring(lastN.length-3);
                    var otherNumbers = lastN.substring(0,lastN.length-3);
                    if(otherNumbers !== '')
                        lastThree = ',' + lastThree;
                    var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree+"."+pointN;
                    return(res);
                }else{
                    var lastThree = x.substring(x.length-3);
                    var otherNumbers = x.substring(0,x.length-3);
                    if(otherNumbers !== '')
                        lastThree = ',' + lastThree;
                    var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
                    return(res);
                }
            }
        }
    }

    getData(startDate, endDate, center_ID, sector_ID, projectCategoryType, projectName, beneficiaryType, activity_ID, subActivity_ID){        
        // console.log(startDate, endDate, center_ID, sector_ID, projectCategoryType, projectName, beneficiaryType);
        if(startDate && endDate && center_ID && sector_ID && projectCategoryType  && beneficiaryType){ 
            if(center_ID==="all"){
                if(sector_ID==="all"){
                    $(".fullpageloader").show();

                    axios.get('/api/reports/activity_annual_achievement_reports/'+startDate+'/'+endDate+'/all/all/'+projectCategoryType+'/'+projectName+'/'+beneficiaryType+'/'+activity_ID+'/'+subActivity_ID)
                    .then((response)=>{
                      console.log("resp",response);
                       $(".fullpageloader").hide();

                        var tableData = response.data.map((a, i)=>{
                        return {
                        _id                                       : a._id,           
                        projectCategoryType                       : a.projectCategoryType ? a.projectCategoryType : "-",
                        projectName                               : a.projectName === 0 ? "-" :a.projectName,                 
                        name                                      : a.name,
                        unit                                      : a.unit,
                        annualPlan_UnitCost_L                     : (a.annualPlan_UnitCost_L),
                        annualPlan_PhysicalUnit                   : this.addCommas(a.annualPlan_PhysicalUnit),
                        annualPlan_TotalBudget_L                  : a.annualPlan_TotalBudget_L,
                        monthlyPlan_UnitCost_L                    : (a.monthlyPlan_UnitCost_L),
                        monthlyPlan_PhysicalUnit                  : this.addCommas(a.monthlyPlan_PhysicalUnit),
                        monthlyPlan_TotalBudget_L                 : a.monthlyPlan_TotalBudget_L,
                        monthlyPlan_LHWRF_L                       : a.monthlyPlan_LHWRF_L,
                        monthlyPlan_NABARD_L                      : a.monthlyPlan_NABARD_L,
                        monthlyPlan_Bank_Loan_L                   : a.monthlyPlan_Bank_Loan_L,
                        monthlyPlan_DirectCC_L                    : a.monthlyPlan_DirectCC_L,
                        monthlyPlan_IndirectCC_L                  : a.monthlyPlan_IndirectCC_L,
                        monthlyPlan_Govt_L                        : a.monthlyPlan_Govt_L,
                        monthlyPlan_Other_L                       : a.monthlyPlan_Other_L,
                        achievement_UnitCost_L                    : (a.achievement_UnitCost_L),
                        achievement_PhysicalUnit                  : this.addCommas(a.achievement_PhysicalUnit),
                        achievement_TotalBudget_L                 : a.achievement_TotalBudget_L,
                        achievement_LHWRF_L                       : a.achievement_LHWRF_L,
                        achievement_NABARD_L                      : a.achievement_NABARD_L,
                        achievement_Bank_Loan_L                   : a.achievement_Bank_Loan_L,
                        achievement_DirectCC_L                    : a.achievement_DirectCC_L,
                        achievement_IndirectCC_L                  : a.achievement_IndirectCC_L,
                        achievement_Govt_L                        : a.achievement_Govt_L,
                        achievement_Other_L                       : a.achievement_Other_L,
                        variance_monthlyPlan_UnitCost_L           : (a.variance_monthlyPlan_UnitCost_L),
                        variance_monthlyPlan_PhysicalUnit         : this.addCommas(a.variance_monthlyPlan_PhysicalUnit),
                        variance_monthlyPlan_TotalBudget_L        : a.variance_monthlyPlan_TotalBudget_L,
                        variance_monthlyPlan_LHWRF_L              : a.variance_monthlyPlan_LHWRF_L,
                        variance_monthlyPlan_NABARD_L             : a.variance_monthlyPlan_NABARD_L,
                        variance_monthlyPlan_Bank_Loan_L          : a.variance_monthlyPlan_Bank_Loan_L,
                        variance_monthlyPlan_DirectCC_L           : a.variance_monthlyPlan_DirectCC_L,
                        variance_monthlyPlan_IndirectCC_L         : a.variance_monthlyPlan_IndirectCC_L,
                        variance_monthlyPlan_Govt_L               : a.variance_monthlyPlan_Govt_L,
                        variance_monthlyPlan_Other_L              : a.variance_monthlyPlan_Other_L
                    }
                    })
                      this.setState({
                        tableData : tableData
                      },()=>{
                        // console.log("resp",this.state.tableData)
                      })
                    })
                    .catch(function(error){  
                        console.log("error = ",error.message);
                        if(error.message === "Request failed with status code 500"){
                            $(".fullpageloader").hide();
                        }
                    });
                }else{
                    axios.get('/api/reports/activity_annual_achievement_reports/'+startDate+'/'+endDate+'/all/'+sector_ID+'/'+projectCategoryType+'/'+projectName+'/'+beneficiaryType+'/'+activity_ID+'/'+subActivity_ID)
                    .then((response)=>{
                      console.log("resp",response);
                        var tableData = response.data.map((a, i)=>{
                        return {
                        _id                                       : a._id,           
                        projectCategoryType                       : a.projectCategoryType ? a.projectCategoryType : "-",
                        projectName                               : a.projectName === 0 ? "-" :a.projectName,                 
                        name                                      : a.name,
                        unit                                      : a.unit,
                        annualPlan_UnitCost_L                     : (a.annualPlan_UnitCost_L),
                        annualPlan_PhysicalUnit                   : this.addCommas(a.annualPlan_PhysicalUnit),
                        annualPlan_TotalBudget_L                  : a.annualPlan_TotalBudget_L,
                        monthlyPlan_UnitCost_L                    : (a.monthlyPlan_UnitCost_L),
                        monthlyPlan_PhysicalUnit                  : this.addCommas(a.monthlyPlan_PhysicalUnit),
                        monthlyPlan_TotalBudget_L                 : a.monthlyPlan_TotalBudget_L,
                        monthlyPlan_LHWRF_L                       : a.monthlyPlan_LHWRF_L,
                        monthlyPlan_NABARD_L                      : a.monthlyPlan_NABARD_L,
                        monthlyPlan_Bank_Loan_L                   : a.monthlyPlan_Bank_Loan_L,
                        monthlyPlan_DirectCC_L                    : a.monthlyPlan_DirectCC_L,
                        monthlyPlan_IndirectCC_L                  : a.monthlyPlan_IndirectCC_L,
                        monthlyPlan_Govt_L                        : a.monthlyPlan_Govt_L,
                        monthlyPlan_Other_L                       : a.monthlyPlan_Other_L,
                        achievement_UnitCost_L                    : (a.achievement_UnitCost_L),
                        achievement_PhysicalUnit                  : this.addCommas(a.achievement_PhysicalUnit),
                        achievement_TotalBudget_L                 : a.achievement_TotalBudget_L,
                        achievement_LHWRF_L                       : a.achievement_LHWRF_L,
                        achievement_NABARD_L                      : a.achievement_NABARD_L,
                        achievement_Bank_Loan_L                   : a.achievement_Bank_Loan_L,
                        achievement_DirectCC_L                    : a.achievement_DirectCC_L,
                        achievement_IndirectCC_L                  : a.achievement_IndirectCC_L,
                        achievement_Govt_L                        : a.achievement_Govt_L,
                        achievement_Other_L                       : a.achievement_Other_L,
                        variance_monthlyPlan_UnitCost_L           : (a.variance_monthlyPlan_UnitCost_L),
                        variance_monthlyPlan_PhysicalUnit         : this.addCommas(a.variance_monthlyPlan_PhysicalUnit),
                        variance_monthlyPlan_TotalBudget_L        : a.variance_monthlyPlan_TotalBudget_L,
                        variance_monthlyPlan_LHWRF_L              : a.variance_monthlyPlan_LHWRF_L,
                        variance_monthlyPlan_NABARD_L             : a.variance_monthlyPlan_NABARD_L,
                        variance_monthlyPlan_Bank_Loan_L          : a.variance_monthlyPlan_Bank_Loan_L,
                        variance_monthlyPlan_DirectCC_L           : a.variance_monthlyPlan_DirectCC_L,
                        variance_monthlyPlan_IndirectCC_L         : a.variance_monthlyPlan_IndirectCC_L,
                        variance_monthlyPlan_Govt_L               : a.variance_monthlyPlan_Govt_L,
                        variance_monthlyPlan_Other_L              : a.variance_monthlyPlan_Other_L
                    }
                    })
                      this.setState({
                        tableData : tableData
                      },()=>{
                        // console.log("resp",this.state.tableData)
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
            else{
                axios.get('/api/reports/activity_annual_achievement_reports/'+startDate+'/'+endDate+'/'+center_ID+'/'+sector_ID+'/'+projectCategoryType+'/'+projectName+'/'+beneficiaryType+'/'+activity_ID+'/'+subActivity_ID)
                .then((response)=>{
                  console.log("resp",response);
                    var tableData = response.data.map((a, i)=>{
                    return {
                        _id                                       : a._id,           
                        projectCategoryType                       : a.projectCategoryType ? a.projectCategoryType : "-",
                        projectName                               : a.projectName === 0 ? "-" :a.projectName,                 
                        name                                      : a.name,
                        unit                                      : a.unit,
                        annualPlan_UnitCost_L                     : (a.annualPlan_UnitCost_L),
                        annualPlan_PhysicalUnit                   : this.addCommas(a.annualPlan_PhysicalUnit),
                        annualPlan_TotalBudget_L                  : a.annualPlan_TotalBudget_L,
                        monthlyPlan_UnitCost_L                    : (a.monthlyPlan_UnitCost_L),
                        monthlyPlan_PhysicalUnit                  : this.addCommas(a.monthlyPlan_PhysicalUnit),
                        monthlyPlan_TotalBudget_L                 : a.monthlyPlan_TotalBudget_L,
                        monthlyPlan_LHWRF_L                       : a.monthlyPlan_LHWRF_L,
                        monthlyPlan_NABARD_L                      : a.monthlyPlan_NABARD_L,
                        monthlyPlan_Bank_Loan_L                   : a.monthlyPlan_Bank_Loan_L,
                        monthlyPlan_DirectCC_L                    : a.monthlyPlan_DirectCC_L,
                        monthlyPlan_IndirectCC_L                  : a.monthlyPlan_IndirectCC_L,
                        monthlyPlan_Govt_L                        : a.monthlyPlan_Govt_L,
                        monthlyPlan_Other_L                       : a.monthlyPlan_Other_L,
                        achievement_UnitCost_L                    : (a.achievement_UnitCost_L),
                        achievement_PhysicalUnit                  : this.addCommas(a.achievement_PhysicalUnit),
                        achievement_TotalBudget_L                 : a.achievement_TotalBudget_L,
                        achievement_LHWRF_L                       : a.achievement_LHWRF_L,
                        achievement_NABARD_L                      : a.achievement_NABARD_L,
                        achievement_Bank_Loan_L                   : a.achievement_Bank_Loan_L,
                        achievement_DirectCC_L                    : a.achievement_DirectCC_L,
                        achievement_IndirectCC_L                  : a.achievement_IndirectCC_L,
                        achievement_Govt_L                        : a.achievement_Govt_L,
                        achievement_Other_L                       : a.achievement_Other_L,
                        variance_monthlyPlan_UnitCost_L           : (a.variance_monthlyPlan_UnitCost_L),
                        variance_monthlyPlan_PhysicalUnit         : this.addCommas(a.variance_monthlyPlan_PhysicalUnit),
                        variance_monthlyPlan_TotalBudget_L        : a.variance_monthlyPlan_TotalBudget_L,
                        variance_monthlyPlan_LHWRF_L              : a.variance_monthlyPlan_LHWRF_L,
                        variance_monthlyPlan_NABARD_L             : a.variance_monthlyPlan_NABARD_L,
                        variance_monthlyPlan_Bank_Loan_L          : a.variance_monthlyPlan_Bank_Loan_L,
                        variance_monthlyPlan_DirectCC_L           : a.variance_monthlyPlan_DirectCC_L,
                        variance_monthlyPlan_IndirectCC_L         : a.variance_monthlyPlan_IndirectCC_L,
                        variance_monthlyPlan_Govt_L               : a.variance_monthlyPlan_Govt_L,
                        variance_monthlyPlan_Other_L              : a.variance_monthlyPlan_Other_L
                    }
                })
                  this.setState({
                    tableData : tableData
                  },()=>{
                    // console.log("resp",this.state.tableData)
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
        var dateVal = event.target.value;
        var dateUpdate = new Date(dateVal);
        var startDate = moment(dateUpdate).format('YYYY-MM-DD');
        this.setState({
           [name] : event.target.value,
           startDate:startDate
        },()=>{
            this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);
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
            this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);
        });
    }

    currentFromDate(){
        if(this.state.startDate){
            var today = this.state.startDate;
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
        // this.handleFromChange()
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
        // this.handleToChange();
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
                                        {/*Activity wise Periodic Variance Report (Physical & Financial)*/}      
                                        Activity Financial Variance Report             
                                    </div>
                                </div>
                                <hr className="hr-head"/>
                                 
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                                    <div className=" col-lg-3 col-md-4 col-sm-12 col-xs-12 valid_box">
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
                                    <div className=" col-lg-3 col-md-4 col-sm-12 col-xs-12 valid_box">
                                        <label className="formLable">Sector</label><span className="asterix"></span>
                                        <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sector" >
                                          <select className="custom-select form-control inputBox" ref="sector" name="sector" value={this.state.sector} onChange={this.selectSector.bind(this)}>
                                            <option  className="hidden" >--Select Sector--</option>
                                            <option value="all" >All</option>
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
                                    </div>
                                    <div className=" col-lg-3 col-md-4 col-sm-12 col-xs-12 valid_box">
                                        <label className="formLable">Activity<span className="asterix">*</span></label>
                                        <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="activity" >
                                            <select className="custom-select form-control inputBox" ref="activity" name="activity" value={this.state.activity}  onChange={this.selectActivity.bind(this)} >
                                                <option  value = "">-- Select --</option>
                                                <option value="all" >All</option>
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
                                    </div>
                                    <div className="col-lg-3 col-md-4 col-sm-12 col-xs-12 valid_box">
                                        <label className="formLable">Sub-Activity<span className="asterix">*</span></label>
                                        <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="subactivity" >
                                            <select className="custom-select form-control inputBox" ref="subactivity" name="subactivity"  value={this.state.subactivity} onChange={this.selectSubActivity.bind(this)} >
                                                <option  value = "">-- Select --</option>
                                                <option value="all" >All</option>
                                                {
                                                    this.state.availableSubActivity && this.state.availableSubActivity.length >0 ?
                                                    this.state.availableSubActivity.map((data, index)=>{
                                                        if(data.subActivityName ){
                                                            return(
                                                                <option className="" key={data._id} data-upgrade={data.familyUpgradation} value={data.subActivityName+'|'+data._id} >{data.subActivityName} </option>
                                                            );
                                                        }
                                                    })
                                                    :
                                                    null
                                                }
                                            </select>
                                        </div>
                                    </div>  
                                    <div className="col-lg-3 col-md-4 col-sm-12 col-xs-12 valid_box">
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
                                    <div className=" col-lg-3 col-md-4 col-sm-12 col-xs-12 valid_box">
                                        <label className="formLable">From</label><span className="asterix"></span>
                                        <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sector" >
                                            <input onChange={this.handleFromChange} onBlur={this.onBlurEventFrom.bind(this)} id="startDate" name="startDate" ref="startDate" value={this.state.startDate} type="date" className="custom-select form-control inputBox" placeholder=""  />
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-md-4 col-sm-12 col-xs-12 valid_box">
                                        <label className="formLable">To</label><span className="asterix"></span>
                                        <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sector" >
                                            <input onChange={this.handleToChange} onBlur={this.onBlurEventTo.bind(this)} id="endDate" name="endDate" ref="endDate" value={this.state.endDate} type="date" className="custom-select form-control inputBox" placeholder=""   />
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-md-4 col-sm-12 col-xs-12 valid_box">
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

                                        <div className="col-lg-3 col-md-4 col-sm-12 col-xs-12 valid_box">
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
                                <div className="marginTop11">
                                    <div className="">
                                        <div className="report-list-downloadMain col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                            <IAssureTable 
                                                tableName = "ActivityWise Periodic Variance Report"
                                                id = "ActivityWisePeriodicVarianceReport"
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
export default ActivityWisePeriodicVarianceReport