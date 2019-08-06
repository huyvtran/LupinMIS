import React, { Component } from 'react';
import $                    from 'jquery';
import axios                from 'axios';
import DailyReport          from '../Reports/DailyReport.js';
import WeeklyReport         from '../Reports/WeeklyReport.js';
import MonthlyReport        from '../Reports/MonthlyReport.js';
import YearlyReport         from '../Reports/YearlyReport.js';
import CustomisedReport     from '../Reports/CustomisedReport.js';
import "../Reports/Reports.css";

class ActivitywiseAnnualCompletionReport extends Component{
	constructor(props){
    super(props);
    this.state = {
        'currentTabView'    : "Monthly",
        'tableDatas'        : [],
        'reportData'        : {},
        'tableData'         : [],
        'year'              : "FY 2019 - 2020",
        'center'            : "",
         "years"            :["FY 2019 - 2020","FY 2020 - 2021","FY 2021 - 2022"],
      
        "startRange"        : 0,
        "limitRange"        : 10,
        "dataApiUrl"        : "http://qalmisapi.iassureit.com/api/report/annual_completion/:year/:center_ID",
        "twoLevelHeader"    : {
            apply           : true,
            firstHeaderData : [
                {
                    heading : '',
                    mergedColoums : 1
                },
                {
                    heading : '',
                    mergedColoums : 1
                },
                {
                    heading : '',
                    mergedColoums : 1
                },
                {
                    heading : 'Annual Plan',
                    mergedColoums : 4
                },
                {
                    heading : "Annual Financial Achievement 'Lakh'",
                    mergedColoums : 4
                },
                {
                    heading : "Source OF Financial Achievement",
                    mergedColoums : 7
                },
                {
                    heading : "",
                    mergedColoums : 1
                },
            ]
        },
        "tableHeading"      : {
            "activityName"                  : 'Activity & Sub Activity',
            "unit"                          : 'Unit',
            "annualPlan_Reach"              : 'Reach', 
            "annualPlan_Upgradation"        : 'Families Upgradation', 
            "annualPlan_physicalUnit"       : 'Physical Units', 
            "annualPlans_totalBudget"       : "Total Budget 'Rs'",
            "annualFYAchie_Reach"           : 'Reach', 
            "annualFYAchie_Upgradation"     : 'Families Upgradation', 
            "annualFYAchie_physcialUnit"    : 'Physical Units', 
            "annualFYAchie_totalExp"        : "Total Expenditure 'Rs'",
            "scrFYAchie_LHWRF"              : 'LHWRF',
            "scrFYAchie_NABARD"             : 'NABARD',
            "scrFYAchie_BankLoan"           : 'Bank Loan',
            "scrFYAchie_Direct"             : 'Direct Community  Contribution',
            "scrFYAchie_Indirect"           : 'Indirect Community  Contribution',
            "scrFYAchie_Govt"               : 'Govt',
            "scrFYAchie_Other"              : 'Others',
            "yiyi"                          : 'Remarks',
        },

    }
    window.scrollTo(0, 0);
  }

  componentDidMount(){
    this.getAvailableCenters();
    // this.getData();
  }
  componentWillReceiveProps(nextProps){
    this.getAvailableCenters();
    // this.getData();
  }
  handleChange(event){
    event.preventDefault();

    this.setState({
      [event.target.name] : event.target.value
    },()=>{
      console.log('name', this.state)
    });
  }
  getAvailableCenters(){
    axios({
      method: 'get',
      url: '/api/centers/list',
    }).then((response)=> {
      this.setState({
        availableCenters : response.data,
        center           : response.data[0].centerName+'|'+response.data[0]._id
      },()=>{
        console.log('availableCenters4', this.state.availableCenters);
        console.log('center', this.state.center);
      })
    }).catch(function (error) {
      console.log('error', error);
    });
  } 
  selectCenter(event){
    var selectedCenter = event.target.value;
    this.setState({
      [event.target.name] : event.target.value,
      selectedCenter : selectedCenter,
    },()=>{
      var center = this.state.selectedCenter.split('|')[1];
      console.log('center', center);
      this.setState({
        // center :center,
        
      })
    });
    // this.handleChange();
  }  
  getData(){
       axios.get('api/report/annual_completion/:year/:center_ID')
      .then((response)=>{
        this.setState({
          tableDatas : response.data
        },()=>{
          console.log("resp",this.state.tableDatas)
        })
      })
      .catch(function(error){        
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
        <div className="row">
          <div className="formWrapper">
            <section className="content">
              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent">
                <div className="row">
                  <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact">
                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageHeader">
                      Yearly Report                   
                    </div>
                    <hr className="hr-head container-fluid row"/>
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop11">
                    <div className=" col-lg-6 col-md-6 col-sm-12 col-xs-12 ">
                      <label className="formLable">Center</label><span className="asterix"></span>
                      <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="center" >
                        <select className="custom-select form-control inputBox" ref="center" name="center" value={this.state.center} onChange={this.selectCenter.bind(this)} >
                          <option className="hidden" >-- Select --</option>
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
                      {/*<div className="errorMsg">{this.state.errors.center}</div>*/}
                    </div>
                   <div className=" col-lg-6 col-md-6 col-sm-12 col-xs-12">
                      <label className="formLable">Year</label><span className="asterix"></span>
                      <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="year" >
                        <select className="custom-select form-control inputBox" ref="year" name="year" value={this.state.year}  onChange={this.handleChange.bind(this)} >
                         {/* <option className="hidden" >-- Select Year --</option>*/}
                         {
                          this.state.years.map((data, i)=>{
                            return <option key={i}>{data}</option>
                          })
                         }
                        </select>
                      </div>
                      {/*<div className="errorMsg">{this.state.errors.year}</div>*/}
                    </div>  
                  </div>  
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop17">
                     
                      <div className="sales-report-main-class">
                        <div className="sales-report-commonpre">

                          {/*<div onClick={this.changeReportComponent.bind(this)} id="Daily" className={this.state.currentTabView === "Daily" ? "sales-report-common sales-report-today report-currentlyActive" : "sales-report-common sales-report-today"}>
                            Daily
                          </div>
                          <div onClick={this.changeReportComponent.bind(this)} id="Weekly"  className={this.state.currentTabView === "Weekly" ? "sales-report-common sales-report-thisweek report-currentlyActive" : "sales-report-common sales-report-thisweek"}>
                            Weekly
                          </div>*/}
                         {/* <div onClick={this.changeReportComponent.bind(this)} id="Monthly"  className={this.state.currentTabView === "Monthly" ? "sales-report-common sales-report-thismonth report-currentlyActive" : "sales-report-common sales-report-thismonth"}>
                            Monthly
                          </div>*/}
                         {/* <div onClick={this.changeReportComponent.bind(this)} id="Yearly"  className={this.state.currentTabView === "Yearly" ? "sales-report-common sales-report-thisyear report-currentlyActive" : "sales-report-common sales-report-thisyear"}>
                            Yearly
                          </div>*/}
                          {/*<div onClick={this.changeReportComponent.bind(this)} id="Customised"  className={this.state.currentTabView === "Customised" ? "sales-report-common sales-report-costomised report-currentlyActive" : "sales-report-common sales-report-costomised"}>
                            Quarterly 
                          </div>*/}
                        </div>
                      </div>
                    </div>
                    
                    {
                      /*this.state.currentTabView === "Daily"   ? <DailyReport   twoLevelHeader={this.state.twoLevelHeader} tableHeading={this.state.tableHeading} dataApiUrl={this.state.dataApiUrl} /> :
                      this.state.currentTabView === "Weekly"  ? <WeeklyReport  twoLevelHeader={this.state.twoLevelHeader} tableHeading={this.state.tableHeading} tableDatas={this.state.tableDatas} /> : 
                      this.state.currentTabView === "Monthly" ? <MonthlyReport twoLevelHeader={this.state.twoLevelHeader} tableHeading={this.state.tableHeading} tableDatas={this.state.tableDatas} /> : */

                      <YearlyReport  twoLevelHeader={this.state.twoLevelHeader} tableHeading={this.state.tableHeading} year={this.state.year} center={this.state.center} /> 
                    }
                    
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