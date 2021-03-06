import React, { Component } from 'react';
import $                    from 'jquery';
import axios                from 'axios';
import swal                 from 'sweetalert';
import moment               from 'moment';
import IAssureTable         from "../../../coreAdmin/IAssureTable/IAssureTable.jsx";
import Loader               from "../../../common/Loader.js";

import "../../Reports/Reports.css";
import "./SectorwiseAnnualCompletionSummaryReport.css";

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
        "center_ID"         : "all",
        "center"            : "all",
        "projectCategoryType": "all",
        "beneficiaryType"    : "all",
        "projectName"        : "all",
        // 'year'              : "FY 2019 - 2020",
        // "years"             :["FY 2019 - 2020","FY 2020 - 2021","FY 2021 - 2022"],
        "startDate"         : "",
        "endDate"           : "",
        // "dataApiUrl"        : "http://apitgk3t.iassureit.com/api/masternotifications/list",
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
                    mergedColoums : 3,
                    hide : false
                },
                {
                    heading : "Annual Achievement",
                    mergedColoums : 4,
                    hide : false
                },
                {
                    heading : "Source OF Financial Achievement",
                    mergedColoums : 7,
                    hide : true
                },
               /* {
                    heading : "",
                    mergedColoums : 1
                },*/
            ]
        },
        "tableHeading"      : {
            "projectCategoryType"               : 'Project Category',
            "projectName"                       : 'Project Name',
            "name"                              : 'Sector',
            "annualPlan_Reach"                  : 'Outreach', 
            "annualPlan_FamilyUpgradation"      : 'Family Upgradation', 
            "annualPlan_TotalBudget_L"          : "Total Budget 'Lakh'",
            "achievement_Reach"                 : 'Outreach', 
            "achievement_FamilyUpgradation"     : 'Families Upgraded', 
            "achievement_TotalBudget_L"         : "Financial Total 'Lakh'", 
            "Per_Annual"                        : '% Achievements',
            "achievement_LHWRF_L"               : 'LHWRF',
            "achievement_NABARD_L"              : 'NABARD',
            "achievement_Bank_Loan_L"           : 'Bank',
            "achievement_Govt_L"                : 'Government',
            "achievement_DirectCC_L"            : 'DirectCC',
            "achievement_IndirectCC_L"          : 'IndirectCC',
            "achievement_Other_L"               : 'Others',        
        },
        "tableObjects"        : {
          paginationApply     : false,
          searchApply         : false,
          downloadApply       : true,
        },   
    }
    window.scrollTo(0, 0); 
    this.getAvailableCenters = this.getAvailableCenters.bind(this);
    this.getAvailableSectors = this.getAvailableSectors.bind(this);
  }

  componentDidMount(){
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
    this.year();
    this.getAvailableCenters();
    this.getAvailableProjects();
    this.getAvailableSectors();
    this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
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
    this.getAvailableCenters();
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
      this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
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
          sector           : response.data[0].sector+'|'+response.data[0]._id
        },()=>{
        var sector_ID = this.state.sector.split('|')[1]
        this.setState({
          sector_ID        : sector_ID
        },()=>{
        this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
        })
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
    var sector_id = event.target.value.split('|')[1];
    this.setState({
      sector_ID : sector_id,
    },()=>{
    this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
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
              this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
            })          
        }else if (this.state.projectCategoryType=== "all"){
            this.setState({
              projectName : "all",
            },()=>{
              this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
            })    
        }else  if(this.state.projectCategoryType=== "Project Fund"){
          this.getData(this.state.year, this.state.center_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType);
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
        if(center_ID==="all"){
          $(".fullpageloader").show();
          axios.get('/api/reports/sector_annual_achievement_reports/'+startDate+'/'+endDate+'/all/'+projectCategoryType+'/'+projectName+'/'+beneficiaryType)
              .then((response)=>{
                console.log('response',response);
                  $(".fullpageloader").hide();

                  var tableData = response.data.map((a, i)=>{
                  return {
                    _id                               : a._id,
                    projectCategoryType               : a.projectCategoryType ? a.projectCategoryType : "-",
                    projectName                       : a.projectName === 0 ? "-" :a.projectName,      
                    name                              : a.name, 
                    annualPlan_Reach                  : this.addCommas(a.annualPlan_Reach),
                    annualPlan_FamilyUpgradation      : this.addCommas(a.annualPlan_FamilyUpgradation), 
                    annualPlan_TotalBudget_L          : a.annualPlan_TotalBudget_L,
                    achievement_Reach                 : this.addCommas(a.achievement_Reach),
                    achievement_FamilyUpgradation     : this.addCommas(a.achievement_FamilyUpgradation), 
                    achievement_TotalBudget_L         : a.achievement_TotalBudget_L, 
                    Per_Annual                        : a.Per_Annual,
                    achievement_LHWRF_L               : a.achievement_LHWRF_L,
                    achievement_NABARD_L              : a.achievement_NABARD_L,
                    achievement_Bank_Loan_L           : a.achievement_Bank_Loan_L,
                    achievement_Govt_L                : a.achievement_Govt_L,
                    achievement_DirectCC_L            : a.achievement_DirectCC_L,
                    achievement_IndirectCC_L          : a.achievement_IndirectCC_L,
                    achievement_Other_L               : a.achievement_Other_L,
                }
              })
              this.setState({
                  tableData : tableData
                });
              })
              .catch((error)=>{
                  console.log('error', error);
              })
          }else{
            axios.get('/api/reports/sector_annual_achievement_reports/'+startDate+'/'+endDate+'/'+center_ID+'/'+projectCategoryType+'/'+projectName+'/'+beneficiaryType)
              .then((response)=>{
                  console.log('response', response);
                  var tableData = response.data.map((a, i)=>{
                  return {
                      _id                               : a._id,
                      projectCategoryType               : a.projectCategoryType ? a.projectCategoryType : "-",
                      projectName                       : a.projectName === 0 ? "-" :a.projectName,      
                      name                              : a.name, 
                      annualPlan_Reach                  : this.addCommas(a.annualPlan_Reach),
                      annualPlan_FamilyUpgradation      : this.addCommas(a.annualPlan_FamilyUpgradation), 
                      annualPlan_TotalBudget_L          : a.annualPlan_TotalBudget_L,
                      achievement_Reach                 : this.addCommas(a.achievement_Reach),
                      achievement_FamilyUpgradation     : this.addCommas(a.achievement_FamilyUpgradation), 
                      achievement_TotalBudget_L         : a.achievement_TotalBudget_L, 
                      Per_Annual                        : a.Per_Annual,
                      achievement_LHWRF_L               : a.achievement_LHWRF_L,
                      achievement_NABARD_L              : a.achievement_NABARD_L,
                      achievement_Bank_Loan_L           : a.achievement_Bank_Loan_L,
                      achievement_Govt_L                : a.achievement_Govt_L,
                      achievement_DirectCC_L            : a.achievement_DirectCC_L,
                      achievement_IndirectCC_L          : a.achievement_IndirectCC_L,
                      achievement_Other_L               : a.achievement_Other_L,
                  }
              })
              this.setState({
                  tableData : tableData
                });
              })
              .catch((error)=>{
                  console.log('error', error);
              })
        }
      }
    }
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
              console.log('years',this.state.years);
              console.log('year',this.state.year);
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
                      {/*Sector Wise Annual Completion Summary Report*/}
                      Sector Annual Report          
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
                    <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12 valid_box">
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
                        :null
                        }
                        </select>
                      </div>
                      {/*<div className="errorMsg">{this.state.errors.year}</div>*/}
                    </div>       
                  </div>  
                  <div className="marginTop11">
                      <div className="report-list-downloadMain col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <IAssureTable 
                              tableName = "Sectorwise Annual Completion Report"
                              id = "SectorwiseAnnualCompletionReport"
                              completeDataCount={this.state.tableDatas.length}
                              twoLevelHeader={this.state.twoLevelHeader} 
                              editId={this.state.editSubId} 
                              getData={this.getData.bind(this)} 
                              tableHeading={this.state.tableHeading} 
                              tableData={this.state.tableData} 
                              tableObjects={this.state.tableObjects}
                            />
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