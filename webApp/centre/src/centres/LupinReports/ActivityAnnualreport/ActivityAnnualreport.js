import React, { Component } from 'react';
import _                    from 'underscore';
import $                    from 'jquery';
import axios                from 'axios';
import swal                 from 'sweetalert';
import moment               from 'moment';
import IAssureTable         from "../../../coreAdmin/IAssureTable/IAssureTable.jsx";
import Loader               from "../../../common/Loader.js";

import "../../Reports/Reports.css";
import "./ActivityAnnualreport.css";

class ActivitywiseAnnualCompletionReport extends Component{
  constructor(props){
      super(props);
      this.state = {
        'tableDatas'        : [],
        'reportData'        : {},
        'tableData'         : [],
        "sector"            : "all",
        "sector_ID"         : "all",
        "activity_ID"       : "all",
        "activity"          : "all",
        "subactivity"       : "all",
        "subActivity_ID"    : "all",
        "projectCategoryType": "all",
        "beneficiaryType"    : "all",
        "projectName"        : "all",
        // 'year'              : "FY 2019 - 2020",
        //  "years"            :["FY 2019 - 2020","FY 2020 - 2021","FY 2021 - 2022"],
        "startRange"        : 0,
        "limitRange"        : 100000000,
        "twoLevelHeader"    : {
            apply           : true,
            firstHeaderData : [
                {
                    heading : 'Activity Details',
                    mergedColoums : 5,
                    hide :false,
                },
                // {
                //     heading : 'Annual Plan',
                //     mergedColoums : 4
                // },
                {
                    heading : "Annual Financial Achievement ",
                    mergedColoums : 5,
                    hide :false,
                },
                {
                    heading : "Source of Financial Achievement 'Lakh'",
                    mergedColoums : 7,
                    hide :true,
                },
           /*     {
                    heading : "",
                    mergedColoums : 1
                },*/
            ]
        },
        "tableHeading"      : {
            "projectCategoryType"           : 'Project Category',
            "projectName"                   : 'Project Name',
            "name"                          : 'Activity & Sub Activity',
            "unit"                          : 'Unit',
            "achievement_Reach"             : 'Reach', 
            "achievement_FamilyUpgradation" : 'Families Upgradation', 
            "achievement_UnitCost_L"        : 'Unit Cost "Lakh" ', 
            "achievement_PhysicalUnit"      : 'Phy Units', 
            "achievement_TotalBudget_L"     : "Total Expenditure 'Lakh'",
            "achievement_LHWRF_L"           : 'LHWRF',
            "achievement_NABARD_L"          : 'NABARD',
            "achievement_Bank_Loan_L"       : 'Bank',
            "achievement_Govt_L"            : 'Government',
            "achievement_DirectCC_L"        : 'DirectCC',
            "achievement_IndirectCC_L"      : 'IndirectCC',
            "achievement_Other_L"           : 'Others',
        },
            "tableObjects"        : {
              paginationApply     : false,
              searchApply         : false,
              downloadApply       : true,
            },  

      }
      window.scrollTo(0, 0);
      this.handleChange = this.handleChange.bind(this);
    }

  componentDidMount(){
    const center_ID = localStorage.getItem("center_ID");
    const centerName = localStorage.getItem("centerName");
    this.setState({
      center_ID    : center_ID,
      centerName   : centerName,
    },()=>{
      this.getData(this.state.year, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);
    });
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
    this.year();
    this.getAvailableProjects();
    this.getAvailableSectors();
    this.setState({
      // "center"  : this.state.center[0],
      // "sector"  : this.state.sector[0],
      tableData : this.state.tableData,
    },()=>{
    this.getData(this.state.year, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);
    })  
  }
  componentWillReceiveProps(nextProps){
    this.year();
    this.getAvailableSectors();
    this.getAvailableProjects();
    this.getData(this.state.year, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);
  }
  handleChange(event){
    event.preventDefault();

    this.setState({
      [event.target.name] : event.target.value
    },()=>{
      this.getData(this.state.year, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);
      // console.log('name', this.state)
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
        // console.log('availableSectors', this.state.availableSectors);
        // console.log('sector', this.state.sector);
      })
    }).catch(function (error) {
        console.log("error = ",error);
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
    if(event.target.value==="all"){
        var sector_id = event.target.value;
    }else{
        var sector_id = event.target.value.split('|')[1];
    }
    // console.log('sector_id',sector_id);
    this.setState({
      sector_ID : sector_id, 
      activity_ID    : "all",
      subActivity_ID : "all",
      activity       : "all",
      subactivity    : "all",
    },()=>{
      this.getAvailableActivity(this.state.sector_ID);
      this.getAvailableSubActivity(this.state.sector_ID, this.state.activity_ID);
      this.getData(this.state.year, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);
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
      this.getAvailableSubActivity(this.state.sector_ID, this.state.activity_ID);
      this.getData(this.state.year, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);
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
      this.getData(this.state.year, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);
    })
  }
  selectprojectCategoryType(event){
    event.preventDefault();
    // console.log(event.target.value)
    var projectCategoryType = event.target.value;
    this.setState({
        projectCategoryType : projectCategoryType,
    },()=>{
        if(this.state.projectCategoryType === "LHWRF Grant"){
            this.setState({
              projectName : "all",
            },()=>{
              this.getData(this.state.year, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);
            })          
        }else if (this.state.projectCategoryType=== "all"){
            this.setState({
              projectName : "all",
            },()=>{
              this.getData(this.state.year, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);
            })    
        }else  if(this.state.projectCategoryType=== "Project Fund"){
          this.getData(this.state.year, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);
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
        this.getData(this.state.year, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);
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
  getData(year, center_ID, sector_ID, projectCategoryType, projectName, beneficiaryType, activity_ID, subActivity_ID){        
    if(year){
      if( center_ID && sector_ID && projectCategoryType  && beneficiaryType){ 
        var startDate = year.substring(3, 7)+"-04-01";
        var endDate = year.substring(10, 15)+"-03-31";
        if(sector_ID==="all"){
          var url = '/api/reports/activity_annual_achievement_reports/'+startDate+'/'+endDate+'/'+center_ID+'/all/'+projectCategoryType+'/'+projectName+'/'+beneficiaryType+'/'+activity_ID+'/'+subActivity_ID
        }else{
          var url ='/api/reports/activity_annual_achievement_reports/'+startDate+'/'+endDate+'/'+center_ID+'/'+sector_ID+'/'+projectCategoryType+'/'+projectName+'/'+beneficiaryType+'/'+activity_ID+'/'+subActivity_ID
        }  
        $(".fullpageloader").show();
 
        axios.get(url)
        // axios.get('/api/report/activity/'+startDate+'/'+endDate+'/'+center_ID+'/'+sector_ID+'/'+projectCategoryType+'/'+projectName+'/'+beneficiaryType)
        .then((response)=>{
            $(".fullpageloader").hide();

            // console.log('response', response);
            var tableData = response.data.map((a, i)=>{
            return {
              _id                           : a._id,
              projectCategoryType           : a.projectCategoryType ? a.projectCategoryType : "-",
              projectName                   : a.projectName === 0 ? "-" :a.projectName,    
              name                          : a.name,
              unit                          : a.unit,
              achievement_Reach             : this.addCommas(a.achievement_Reach),
              achievement_FamilyUpgradation : this.addCommas(a.achievement_FamilyUpgradation), 
              achievement_UnitCost_L        : a.achievement_UnitCost_L,
              achievement_PhysicalUnit      : this.addCommas(a.achievement_PhysicalUnit),
              achievement_TotalBudget_L     : a.achievement_TotalBudget_L,
              achievement_LHWRF_L           : a.achievement_LHWRF_L,
              achievement_NABARD_L          : a.achievement_NABARD_L,
              achievement_Bank_Loan_L       : a.achievement_Bank_Loan_L,
              achievement_Govt_L            : a.achievement_Govt_L,
              achievement_DirectCC_L        : a.achievement_DirectCC_L,
              achievement_IndirectCC_L      : a.achievement_IndirectCC_L,
              achievement_Other_L           : a.achievement_Other_L,
              // remark                        : a.remark,
            }
          })
            this.setState({
                tableData : tableData
            })
        })
        .catch((error)=>{
          console.log('error', error);
        })   
      }
    }
  }
  getSearchText(searchText, startRange, limitRange){
      this.setState({
          tableData : []
      });
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
        this.getData(this.state.year, this.state.center_ID, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.activity_ID, this.state.subActivity_ID);
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
                            Activity Annual Report
                        </div>
                    </div>
                    <hr className="hr-head"/>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                        <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12 valid_box">
                          <label className="formLable">Sector</label><span className="asterix"></span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sector" >
                            <select className="custom-select form-control inputBox" ref="sector" name="sector" value={this.state.sector} onChange={this.selectSector.bind(this)}>
                              <option  className="hidden" >--Select Sector--</option>
                              <option value="all">All</option>
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
                        <div className=" col-lg-3 col-md-4 col-sm-12 col-xs-12  ">
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
                        <div className="col-lg-3 col-md-4 col-sm-12 col-xs-12">
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
                          <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12 valid_box ">
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
                        <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12" >
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
                    </div> 
                    <div className="marginTop11 col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    
                        <div className="">
                            <div className="report-list-downloadMain ">
                                <IAssureTable 
                                    tableName = "Activitywise Annual-Plan-Report"
                                    id = "ActivitywiseAnnualCompletionReport"
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
export default ActivitywiseAnnualCompletionReport