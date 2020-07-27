import React, { Component } from 'react';
import $                    from 'jquery';
import axios                from 'axios';
import swal                 from 'sweetalert';
import moment               from 'moment';
import IAssureTable         from "../../../coreAdmin/IAssureTable/IAssureTable.jsx";
import Loader               from "../../../common/Loader.js";

import "./SectorwiseReport.css";
import "../../Reports/Reports.css";
class SectorwiseReport extends Component{
	constructor(props){
    super(props);
    this.state = {
        'currentTabView'    : "Monthly",
        'tableDatas'        : [],
        'reportData'        : {},
        'tableData'         : [],
        "startRange"        : 0,
        "limitRange"        : 10000,
        "sector"            : "all",
        "sector_ID"         : "all",
        "projectCategoryType": "all",
        "beneficiaryType"    : "all",
        "projectName"        : "all",
        "twoLevelHeader"    : {
            apply           : true,
            firstHeaderData : [
                {
                    heading : 'Sector Details',
                    mergedColoums : 4,
                    hide  : false
                },
                {
                    heading : 'Achievement (Family No)',
                    mergedColoums : 2,
                    hide : false
                },
                {
                    heading : "Financial Achievement (Lakh)",
                    mergedColoums : 11,
                    hide : false
                },
            ]
        },
        "tableHeading"      : {
            "projectCategoryType"                : 'Project Category',
            "projectName"                        : 'Project Name',
            "name"                               : 'Sector',
            "achievement_Reach"                  : 'Reach',
            "achievement_FamilyUpgradation"      : 'Upgradation',
            "achievement_UnitCost_L"             : 'Unit Cost', 
            "achievement_PhysicalUnit"           : 'Phy Units', 
            "achievement_TotalBudget_L"          : "Financial Total 'Lakh'",
            "achievement_LHWRF_L"                : 'LHWRF',
            "achievement_NABARD_L"               : 'NABARD',
            "achievement_Bank_Loan_L"            : 'Bank Loan',
            "achievement_DirectCC_L"             : 'DirectCC',
            "achievement_IndirectCC_L"           : 'IndirectCC',
            "achievement_Govt_L"                 : 'Government',
            "achievement_Other_L"                : 'Others',
        },
        "tableObjects"        : {
          paginationApply     : false,
          searchApply         : false,
          downloadApply       : true,
        },   
    }
    window.scrollTo(0, 0); 
    this.handleFromChange       = this.handleFromChange.bind(this);
    this.onBlurEventFrom        = this.onBlurEventFrom.bind(this);
    this.onBlurEventTo          = this.onBlurEventTo.bind(this);
    this.handleToChange         = this.handleToChange.bind(this);
    this.currentFromDate        = this.currentFromDate.bind(this);
    this.currentToDate          = this.currentToDate.bind(this);
    this.getAvailableProjects   = this.getAvailableProjects.bind(this);
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
        // console.log("center_ID =",this.state.center_ID);
        this.getData(this.state.startDate, this.state.endDate, this.state.center_ID,  this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
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
        this.getData(this.state.startDate, this.state.endDate, this.state.center_ID,  this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
        })
        this.handleFromChange = this.handleFromChange.bind(this);
        this.handleToChange = this.handleToChange.bind(this);
    }   
    componentWillReceiveProps(nextProps){
        this.getAvailableProjects();
        this.currentFromDate();
        this.currentToDate();
        this.getData(this.state.startDate, this.state.endDate, this.state.center_ID,  this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
        // console.log('componentWillReceiveProps', this.state.startDate, this.state.endDate,'center_ID', this.state.center_ID,'sector_ID', this.state.sector_ID)
    }
    handleChange(event){
        event.preventDefault();
        this.setState({
          [event.target.name] : event.target.value
        },()=>{
        this.getData(this.state.startDate, this.state.endDate, this.state.center_ID,  this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
          // console.log('name', this.state)
        });
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
                    this.getData(this.state.startDate, this.state.endDate, this.state.center_ID,  this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
                })          
            }else if (this.state.projectCategoryType=== "all"){
                this.setState({
                  projectName : "all",
                },()=>{
                    this.getData(this.state.startDate, this.state.endDate, this.state.center_ID,  this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
                })    
            }else  if(this.state.projectCategoryType=== "Project Fund"){
                this.getData(this.state.startDate, this.state.endDate, this.state.center_ID,  this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
            }
        },()=>{
        })
    }
    getAvailableProjects(){
        axios({
          method: 'get',
          url: '/api/projectMappings/list',
        }).then((response)=> {
            var availableProjects = response.data
            function dynamicSort(property) {
                var sortOrder = 1;
                if(property[0] === "-") {
                    sortOrder = -1;
                    property = property.substr(1);
                }
                return function (a,b) {
                    if(sortOrder == -1){
                        return b[property].localeCompare(a[property]);
                    }else{
                        return a[property].localeCompare(b[property]);
                    }        
                }
            }
            availableProjects.sort(dynamicSort("projectName")); 
            this.setState({
                availableProjects : availableProjects
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
            // console.log('startDate', this.state.startDate, 'center_ID', this.state.center_ID,'sector_ID', this.state.sector_ID)
            this.getData(this.state.startDate, this.state.endDate, this.state.center_ID,  this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
        })
    }
    addCommas(x) {
        if(x===0){
            return parseInt(x)
        }else{
            x=x.toString();
            if(x.includes('%')){
                return x;
            }else if(x.includes('-')){
                var lastN = x.split('-')[1];
                var lastThree = lastN.substring(lastN.length-3);
                var otherNumbers = lastN.substring(0,lastN.length-3);
                if(otherNumbers != '')
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
                    if(otherNumbers != '')
                        lastThree = ',' + lastThree;
                    var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree+"."+pointN;
                    return(res);
                }else{
                    var lastThree = x.substring(x.length-3);
                    var otherNumbers = x.substring(0,x.length-3);
                    if(otherNumbers != '')
                        lastThree = ',' + lastThree;
                    var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
                    return(res);
                }
            }
        }
    }
    getData(startDate, endDate, center_ID, projectCategoryType, projectName, beneficiaryType){        
        if(startDate && endDate && center_ID && projectCategoryType  && beneficiaryType){ 
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
                        achievement_Reach                         : a.achievement_Reach,
                        achievement_FamilyUpgradation             : a.achievement_FamilyUpgradation,
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
            this.getData(this.state.startDate, this.state.endDate, this.state.center_ID,  this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
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
            this.getData(this.state.startDate, this.state.endDate, this.state.center_ID,  this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
       });
    }
    onBlurEventFrom(){
        var startDate = document.getElementById("startDate").value;
        var endDate = document.getElementById("endDate").value;
        // console.log("startDate",startDate,endDate)
         if ((Date.parse(endDate) < Date.parse(startDate))) {
            
            swal("Start date","From date should be less than To date");
            this.refs.startDate.value="";
        }
    }
    onBlurEventTo(){
        var startDate = document.getElementById("startDate").value;
        var endDate = document.getElementById("endDate").value;
        // console.log("startDate",startDate,endDate)
          if ((Date.parse(startDate) > Date.parse(endDate))) {
            swal("End date","To date should be greater than From date");
            this.refs.endDate.value="";
        }
    }

    currentFromDate(){
        if(this.state.startDate){
            var today = this.state.startDate;
            // console.log("localStoragetoday",today);
        }else {
            var today = (new Date());
            var nextDate = today.getDate() - 30;
            today.setDate(nextDate);
            var today =  moment(today).format('YYYY-MM-DD');
            // console.log("today",today);
        }
        // console.log("nowfrom",today)
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
            // console.log("newToDate",today);
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
                                        Sector wise Report       
                                    </div>
                                </div>
                                <hr className="hr-head"/>
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 valid_box">
                                    
                                    <div className="col-lg-4 col-md-6 col-sm-12 col-xs-12 ">
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
                                     <div className="col-lg-4 col-md-6 col-sm-12 col-xs-12 ">
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

                                        <div className="col-lg-4 col-md-6 col-sm-12 col-xs-12 ">
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
                                    <div className=" col-lg-4 col-md-6 col-sm-12 col-xs-12 ">
                                        <label className="formLable">From</label><span className="asterix"></span>
                                        <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sector" >
                                            <input onChange={this.handleFromChange} onBlur={this.onBlurEventFrom} name="startDate" ref="startDate" id="startDate" value={this.state.startDate} type="date" className="custom-select form-control inputBox" placeholder=""  />
                                        </div>
                                    </div>
                                    <div className=" col-lg-4 col-md-6 col-sm-12 col-xs-12 ">
                                        <label className="formLable">To</label><span className="asterix"></span>
                                        <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sector" >
                                            <input onChange={this.handleToChange} onBlur={this.onBlurEventTo}  name="endDate" ref="endDate" id="endDate" value={this.state.endDate} type="date" className="custom-select form-control inputBox" placeholder=""   />
                                        </div>
                                    </div>  
                                </div>  
                                <div className="marginTop11">
                                    <div className="report-list-downloadMain col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <IAssureTable 
                                            tableName = "Sectorwise Periodic Variance Summary Report"
                                            id = "SectorwiseReport"
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
export default SectorwiseReport