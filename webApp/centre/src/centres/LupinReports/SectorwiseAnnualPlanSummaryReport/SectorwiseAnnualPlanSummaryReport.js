import React, { Component } from 'react';
import $                    from 'jquery';
import axios                from 'axios';
import swal                 from 'sweetalert';
import moment               from 'moment';
import IAssureTable         from "../../../coreAdmin/IAssureTable/IAssureTable.jsx";
import Loader               from "../../../common/Loader.js";

import "./SectorwiseAnnualPlanSummaryReport.css";
import "../../Reports/Reports.css";

class SectorwiseAnnualPlanSummaryReport extends Component{
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
        // 'year'               : "FY 2019 - 2020",
        // "years"             :["FY 2019 - 2020","FY 2020 - 2021","FY 2021 - 2022"],
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
                    heading : 'Annual Plan',
                    mergedColoums : 4,
                    hide : false
                },
                {
                    heading : "Source of Financial Plan 'Lakh'",
                    mergedColoums : 10,
                    hide : true
                },/*
                {
                    heading : "",
                    mergedColoums : 1
                },*/
            ]
        },
        "tableHeading"      : {
            "annualPlan_projectCategoryType"    : 'Project Category',
            "annualPlan_projectName"            : 'Project Name',
            "name"                              : 'Sector',
            "annualPlan_Reach"                  : 'Reach', 
            "annualPlan_FamilyUpgradation"      : "Families Upgradation",
            "proportionToTotal"                        : 'Proportion to Total %', 
            "annualPlan_TotalBudget_L"          : "Total Budget 'Lakh'", 
            "annualPlan_LHWRF_L"                : 'LHWRF',
            "annualPlan_NABARD_L"               : 'NABARD',
            "annualPlan_Bank_Loan_L"            : 'Bank',
            "annualPlan_Govt_L"                 : 'Government',
            "annualPlan_DirectCC_L"             : 'DirectCC',
            "annualPlan_IndirectCC_L"           : 'IndirectCC',
            "annualPlan_Other_L"                : 'Others',
        },
        "tableObjects"        : {
            paginationApply     : false,
            searchApply         : false,
            downloadApply       : true,
        },   
    }
    window.scrollTo(0, 0); 
    this.getAvailableSectors = this.getAvailableSectors.bind(this);
  }

  componentDidMount(){
    this.year();
    const center_ID = localStorage.getItem("center_ID");
    const centerName = localStorage.getItem("centerName");
    // console.log("localStorage =",localStorage.getItem('centerName'));
    // console.log("localStorage =",localStorage);
    this.setState({
      center_ID    : center_ID,
      centerName   : centerName,
    },()=>{
    // console.log("center_ID =",this.state.center_ID);
    this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
    });
      axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
      this.getAvailableSectors();
      this.getAvailableProjects();
      this.setState({
        // "center"  : this.state.center[0],
        // "sector"  : this.state.sector[0],
        tableData : this.state.tableData,
      },()=>{
      this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
      })
  }   
  componentWillReceiveProps(nextProps){
    this.year();
    if(nextProps){  
      this.getData(this.state.year, this.state.center_ID);
    }
    this.getAvailableProjects();
    this.getAvailableSectors();
    this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
  }
  handleChange(event){
    event.preventDefault();
    this.setState({
      [event.target.name] : event.target.value
    },()=>{
      this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
      console.log('name', this.state)
    });
  }
  getAvailableSectors(){
    axios({
      method: 'get',
      url: '/api/sectors/list',
    }).then((response)=> {
      this.setState({
        availableSectors : response.data,
        sector           : response.data[0].sector+'|'+response.data[0]._id
      },()=>{
      var sector_ID = this.state.sector.split('|')[1]
      this.setState({
        sector_ID        : sector_ID
      },()=>{
      this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
      })
      // console.log('sector', this.state.sector);
    })
    }).catch(function (error) {  
      // console.log("error = ",error);
      if(error.message === "Request failed with status code 401"){
        swal({
            title : "abc",
            text  : "Session is Expired. Kindly Sign In again."
        });
      }
    });
  }
  selectSector(event){
    event.preventDefault();
    this.setState({
      [event.target.name]:event.target.value
    });
    var sector_id = event.target.value.split('|')[1];
    // console.log('sector_id',sector_id);
    this.setState({
      sector_ID : sector_id,
    },()=>{
    // console.log('availableSectors', this.state.availableSectors);
    // console.log('sector_ID', this.state.sector_ID);
    // console.log('startDate', this.state.startDate, 'center_ID', this.state.center_ID,'sector_ID', this.state.sector_ID)
    this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
    })
  }
  selectprojectCategoryType(event){
    event.preventDefault();
    var projectCategoryType = event.target.value;
    this.setState({
      projectCategoryType : projectCategoryType,
    },()=>{
      if(this.state.projectCategoryType === "LHWRF Grant"){
        this.setState({
          projectName : "all",
        },()=>{
          this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
        })          
      }else if (this.state.projectCategoryType=== "all"){
        this.setState({
          projectName : "all",
        },()=>{
          this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
        })    
      }
      this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
    },()=>{
      // this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
    })
  }
  getAvailableProjects(){
    axios({
      method: 'get',
      url: '/api/projectMappings/list',
    }).then((response)=> {
      // console.log('responseP', response);
      var availableProjects = response.data
      function dynamicSort(property) {
        var sortOrder = 1;
        if(property[0] === "-") {
          sortOrder = -1;
          property = property.substr(1);
        }
        return function (a,b) {
          if(sortOrder === -1){
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
        this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
    })
  }
  addCommas(x) {
    if(x===0){
      return parseInt(x)
    }else{
      x=x.toString();
      if(x.includes('%')){
          return x;
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
  getData(year, center_ID, projectCategoryType, projectName, beneficiaryType){        
    if(year){
      var startDate = year.substring(3, 7)+"-04-01";
      var endDate = year.substring(10, 15)+"-03-31";    
      if(startDate && endDate && center_ID && projectCategoryType  && beneficiaryType){ 
        $(".fullpageloader").show();
        axios.get('/api/reports/sector_annual_plans/'+startDate+'/'+endDate+'/'+center_ID+'/'+projectCategoryType+'/'+projectName+'/all')
          .then((response)=>{
            console.log("resp",response);
            $(".fullpageloader").hide();
            var value = response.data.filter((a)=>{return a.name === "Total"})[0];
            // console.log('value',value)
            var tableData = response.data.map((a, i)=>{
              // console.log("a.Per_Annual",((a.annualPlan_TotalBudget_L/value.annualPlan_TotalBudget_L)*100).toFixed(2));
              return {
                    _id                                      : a._id,     
                    annualPlan_projectCategoryType           : a.annualPlan_projectCategoryType ? a.annualPlan_projectCategoryType : "-",
                    annualPlan_projectName                   : a.annualPlan_projectName === "all" ? "-" :a.annualPlan_projectName,               
                    name                                     : a.name,
                    annualPlan_Reach                         :(this.addCommas(a.annualPlan_Reach)), 
                    annualPlan_FamilyUpgradation             :(this.addCommas(a.annualPlan_FamilyUpgradation)), 
                    // annualPlan_Reach                         : (a.annualPlan_Reach=== " ") ? " " : parseInt(this.addCommas(a.annualPlan_Reach)), 
                    // annualPlan_FamilyUpgradation             : (a.annualPlan_FamilyUpgradation === " ") ? " "  : parseInt(this.addCommas(a.annualPlan_FamilyUpgradation)), 
                    proportionToTotal                        : (((((a.annualPlan_TotalBudget_L/value.annualPlan_TotalBudget_L)*100).toFixed(2)) + "%") ==="NaN%") ? " " : ((((a.annualPlan_TotalBudget_L/value.annualPlan_TotalBudget_L)*100).toFixed(2)) + "%" ),
                    annualPlan_TotalBudget_L                 : (a.annualPlan_TotalBudget_L),
                    annualPlan_LHWRF_L                       : (a.annualPlan_LHWRF_L),
                    annualPlan_NABARD_L                      : (a.annualPlan_NABARD_L),
                    annualPlan_Bank_Loan_L                   : (a.annualPlan_Bank_Loan_L),
                    annualPlan_Govt_L                        : (a.annualPlan_Govt_L),
                    annualPlan_DirectCC_L                    : (a.annualPlan_DirectCC_L),
                    annualPlan_IndirectCC_L                  : (a.annualPlan_IndirectCC_L),
                    annualPlan_Other_L                       : (a.annualPlan_Other_L),
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
    }
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

  year() {
    let financeYear;
    let today = moment();
    // console.log('today',today);
    if(today.month() >= 3){
      financeYear = today.format('YYYY') + '-' + today.add(1, 'years').format('YYYY')
    }
    else{
      financeYear = today.subtract(1, 'years').format('YYYY') + '-' + today.add(1, 'years').format('YYYY')
    }
    this.setState({
        financeYear :financeYear
    },()=>{
      // console.log('financeYear',this.state.financeYear);
      var firstYear= this.state.financeYear.split('-')[0]
      var secondYear= this.state.financeYear.split('-')[1]
      // console.log(firstYear,secondYear);
      var financialYear = "FY "+firstYear+" - "+secondYear;
      /*"FY 2019 - 2020",*/
      this.setState({
        firstYear  :firstYear,
        secondYear :secondYear,
        year       :financialYear
      },()=>{
        this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
        var upcomingFirstYear =parseInt(this.state.firstYear)+3
        var upcomingSecondYear=parseInt(this.state.secondYear)+3
        var years = [];
        for (var i = 2017; i < upcomingFirstYear; i++) {
          for (var j = 2018; j < upcomingSecondYear; j++) {
            if (j-i===1){
              var financeYear = "FY "+i+" - "+j;
              years.push(financeYear);
              this.setState({
                years  :years,
              },()=>{
              // console.log('years',this.state.years);
              // console.log('year',this.state.year);
              })              
            }
          }
        }
      })
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
                       {/* Sector wise Annual Plan Summary Report*/}  
                        Sector Annual Plan Report            
                    </div>
                  </div>
                  <hr className="hr-head"/>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 valid_box">
                    <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12">
                      <label className="formLable">Year</label><span className="asterix"></span>
                      <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="year" >
                        <select className="custom-select form-control inputBox" ref="year" name="year" value={this.state.year}  onChange={this.handleChange.bind(this)} >
                         <option className="hidden" >-- Select Year --</option>
                         {
                          this.state.years 
                          ?
                            this.state.years.map((data, i)=>{
                              return <option key={i}>{data}</option>
                            })
                          : null
                         }
                        </select>
                      </div>
                    </div> 
                    <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 valid_box ">
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
                      <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 valid_box ">
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
                    <div className="report-list-downloadMain col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      <IAssureTable 
                          tableName = "Sectorwise Annual Plan Summary Report"
                          id = "SectorwiseAnnualPlanSummaryReport"
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
export default SectorwiseAnnualPlanSummaryReport