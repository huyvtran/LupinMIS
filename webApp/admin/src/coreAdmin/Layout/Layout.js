import React,{Component}                         from 'react';
import { render }                                from 'react-dom';
import { Redirect }                              from 'react-router-dom';
import { BrowserRouter as Router, Route,Switch } from 'react-router-dom';
import $                                         from "jquery";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

// Section: 1 - SystemSecurity ******************************************************
import Login                                      from '../systemSecurity/Login.js';
import ConfirmOtp                                 from '../systemSecurity/ConfirmOtp.js';
import ForgotPassword                             from '../systemSecurity/ForgotPassword.js';
import ResetPassword                              from '../systemSecurity/ResetPassword.js';
import SignUp                                     from '../systemSecurity/SignUp.js';
import VerifyAccount                              from '../systemSecurity/VerifyAccount.js';

import CenterwiseBarChart                         from '../dashboard/chart1/CenterwiseBarChart1.js'
import SourcewiseBarChart                         from '../dashboard/chart1/SourcewiseBarChart1.js'
import Chart1                                     from '../dashboard/chart1/chart1.js'
import Chart                                      from '../dashboard/chart1/chart.js'
import CenterwiseBudget                           from '../dashboard/chart1/CenterwiseBudget.js'
import monthwiseCharts                            from '../dashboard/chart1/monthwiseCharts.js'

import Header                                     from '../common/header/Header.js'
import Footer                                     from '../common/footer/Footer.js'
import Dashboard                                  from '../dashboard/Dashboard.js'
import DashboardNew                               from '../dashboard/DashboardNew.js'
import Leftsidebar                                from '../common/leftSidebar/Leftsidebar.js'
import Rightsidebar                               from '../common/rightSidebar/Rightsidebar.js'
import UMListOfUsers                              from '../userManagement/UM/UMListOfUsers.js';
import UMListOfEmp                                from '../userManagement/UM/OfficeEmpList.js';

import EditUserProfile                            from '../userManagement/UM/EditUserProfile.js';
import UMRolesList                                from '../userManagement/Roles/UMRolesList.js';
import OrganizationSetting                        from '../companysetting/Components/OrganizationSetting.js';
import ViewTemplates                              from '../NotificationManagement/ViewTemplates.jsx';

/**************************/

import AddModuleFacility                          from '../accessManagement/AddModuleFacility.js';
import AssignPermissionToModules                  from '../accessManagement/AssignPermissionToModules.js';

import SectorAndActivity                          from '../../coreAdmin/masterData/sectorAndActivity/SectorAndActivity.js';

import SectorAndActivityRedirect                  from '../../coreAdmin/masterData/sectorAndActivity/SandA.js';

import Unit                                       from '../../coreAdmin/masterData/sectorAndActivity/component/unit/Unit.js';
import BulkUpload                                 from '../../coreAdmin/masterData/sectorAndActivity/component/BulkUpload/BulkUpload.js';
import centerDetail                               from '../../coreAdmin/masterData/centerDetail/centerDetail.js';
import Type_Center                                from '../../coreAdmin/masterData/typeOfCenter/typeOfCenter.js';
import Type_Goal                                  from '../../coreAdmin/masterData/typeOfGoal/typeOfGoalP.js';
import TypeOfGoalContainer                        from '../../coreAdmin/masterData/typeOfGoal/typeOfGoalContainer.js';

import ProjectDefinition                            from '../../coreAdmin/masterData/projectMapping/ProjectDefinition.js';
import ProjectMapping                             from '../../coreAdmin/masterData/projectMapping/ProjectMapping.js';
import SectorMapping                              from '../../coreAdmin/masterData/sectorMapping/SectorMapping.js';

import plan                                       from '../../admin/annualPlan/PlanDetails.js';

import CaseStudy                                  from "../../admin/addFile/CaseStudy.js";
import CaseStudyView                              from "../../admin/addFile/CaseStudyView.js";
import AddFilePrivate                             from "../../admin/addFile/AddFilePrivate.js";
import Highlight                                  from "../../admin/highLight/Highlight.js"; 
import HighlightView                              from "../../admin/highLight/HighlightView.js"; 
// import report1                                    from "../../admin/LupinReports/ActivitywiseAnnualCompletionReport.js";
import report1                                    from "../../admin/LupinReports/ActivityAnnualreport/ActivityAnnualreport.js";
import report2                                    from "../../admin/LupinReports/SectorwiseAnnualCompletionSummaryReport/SectorwiseAnnualCompletionSummaryReport.js";
import report3                                    from "../../admin/LupinReports/ActivityWisePeriodicVarianceReport/ActivityWisePeriodicVarianceReport.js";
import report4                                    from "../../admin/LupinReports/SectorwisePeriodicVarianceSummaryReport/SectorwisePeriodicVarianceSummaryReport.js";
import report5                                    from "../../admin/LupinReports/ActivitywisePeriodicPhysicalVarianceReport/ActivitywisePeriodicPhysicalVarianceReport.js";
import report6                                    from "../../admin/LupinReports/GeographicalReport/GeographicalReport.js";
import report7                                    from "../../admin/LupinReports/VillagewisefamilyReport/VillagewisefamilyReport.js";
import report8                                    from "../../admin/LupinReports/CategorywiseReport/CategorywiseReport.js";
import report9                                    from "../../admin/LupinReports/UpgradedBeneficiaryReport/UpgradedBeneficiaryReport.js";
// import report10                                   from "../../admin/LupinReports/SDGReport.js";
import report10                                   from "../../admin/LupinReports/GoalSectorReport/GoalSectorReport.js";
import report13                                   from "../../admin/LupinReports/ActivitywiseAnnualPlanReport/ActivitywiseAnnualPlanReport.js";
import report14                                   from "../../admin/LupinReports/ActivitywisePeriodicPlanReport/ActivitywisePeriodicPlanReport.js";
import report15                                   from "../../admin/LupinReports/SectorwisePeriodicPlanSummaryReport/SectorwisePeriodicPlanSummaryReport.js";
import report16                                   from "../../admin/LupinReports/SectorwiseAnnualPlanSummaryReport/SectorwiseAnnualPlanSummaryReport.js";
import report17                                   from "../../admin/LupinReports/CenterRankingReport/CenterRankingReport.js";

import ProjectReport                                   from "../../admin/LupinReports/GoalSectorReport/ProjectReport.js";
 class Layout extends Component{
  
  constructor(props) {
    super();
    this.state = {
          loggedIn : false,
    }
  }
   
componentDidMount(){
    const token = localStorage.getItem("token");
    // console.log("Dashboard Token = ",token);
    if(token!==null){
      this.setState({
        loggedIn : true
      })
    }else{
      console.log("token is not available");
    }
              
  }

  logout(){
    var token = localStorage.removeItem("token");
      if(token!==null){
      // console.log("Header Token = ",token);
      this.setState({
        loggedIn : false
      })
    }
  }

  render(){
    if(this.state.loggedIn===true){
      return(
        <Router>
            <div className="App container-fluid">
              <div className="row">
                <div id="headerid" className="headerbackgroundcolor">
                  <div className="">
                    <Header />
                 </div>
                </div>
                <div id="dashbordid" className="col-lg-10 col-lg-offset-2 col-md-12 col-sm-12 col-xs-12 NOpadding">
                  <div className="">
                    <div className=" mainContentBottom">
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding mainContentBackground">                  
                      <Switch>
                          <Route path="/CenterwiseBarChart"         component={CenterwiseBarChart} exact />
                          <Route path="/SourcewiseBarChart"         component={SourcewiseBarChart} exact />
                          <Route path="/Chart"                      component={Chart} exact />
                          <Route path="/monthwiseCharts"            component={monthwiseCharts} exact />
                          <Route path="/CenterwiseBudget"           component={CenterwiseBudget} exact />
                          <Route path="/Chart1"                     component={Chart1} exact />
                          <Route path="/"                           component={Dashboard} exact />
                          <Route path="/DashboardNew"               component={DashboardNew} exact />
                          <Route path="/dashboard"                  component={Dashboard} exact />
                          <Route path="/umlistofusers"              component={UMListOfUsers} exact />
                          <Route path="/umroleslist"                component={UMRolesList} exact />
                          <Route path="/edituserprofile/:id"        component={EditUserProfile} exact />
                          <Route path="/ViewTemplates"              component={ViewTemplates} exact />
                          <Route path="/companysetting"             component={OrganizationSetting} exact />
                          {/*Access Management*/}
                          <Route path="/admin/AddModuleFacility"                                      exact strict component={ AddModuleFacility } />
                          <Route path="/admin/AssignPermissionToModule"                               exact strict component={ AssignPermissionToModules } />
                           {/*Master Data*/}
                          <Route path="/type-center"                                                  exact strict component={ Type_Center } />
                          <Route path="/type-center/"                                                  exact strict component={ Type_Center } />
                          <Route path="/type-center/:typeofCenterId"                                  exact strict component={ Type_Center } />
                         {/* <Route path="/type-goal"                                                    exact strict component={ Type_Goal } />
                          <Route path="/type-goal/"                                                    exact strict component={ Type_Goal } />
                          <Route path="/type-goal/:typeofGoalId"                                      exact strict component={ Type_Goal } />*/}

                          <Route path="/type-goal"                                                    exact strict component={ TypeOfGoalContainer } />
                          <Route path="/type-goal/"                                                   exact strict component={ TypeOfGoalContainer } />
                          <Route path="/type-goal/:typeofGoalId"                                                   exact strict component={ TypeOfGoalContainer } />
                          <Route path="/type-goal/:typeofGoalId/:goalNameId"                                      exact strict component={ TypeOfGoalContainer } />
                          <Route path="/center-details"                                               exact strict component={ centerDetail } />
                          <Route path="/center-details/"                                              exact strict component={ centerDetail } />
                          <Route path="/center-details/:id"                                           exact strict component={ centerDetail } />
                         
                          <Route path="/sector-and-activity"                                          exact strict component={ SectorAndActivity } />
                          <Route path="/sector-and-activity/"                                         exact strict component={ SectorAndActivity } />
                          <Route path="/sector-and-activity/unit/"                                    exact strict component={ SectorAndActivity } />
                          <Route path="/sector-and-activity/unit/:unitID"                             exact strict component={ SectorAndActivity } />
                          <Route path="/sector-and-activity/:sectorId"                                exact strict component={ SectorAndActivity } />
                          <Route path="/sector-and-activity/:sectorId/:activityId"                    exact strict component={ SectorAndActivity } />
                          <Route path="/sector-and-activity/:sectorId/:activityId/:subactivityId"     exact strict component={ SectorAndActivity } />
                          
                          <Route path="/SectorAndActivityRedirect/"                                                  exact strict component={ SectorAndActivityRedirect } />
                          <Route path="/SectorAndActivityRedirect/:tabName"                                          exact strict component={ SectorAndActivityRedirect } />
                          <Route path="/SectorAndActivityRedirect/:tabName/"                                         exact strict component={ SectorAndActivityRedirect } />
                          <Route path="/SectorAndActivityRedirect/:tabName/unit/"                                    exact strict component={ SectorAndActivityRedirect } />
                          <Route path="/SectorAndActivityRedirect/:tabName/unit/:unitID"                             exact strict component={ SectorAndActivityRedirect } />
                          <Route path="/SectorAndActivityRedirect/:tabName/:sectorId"                                exact strict component={ SectorAndActivityRedirect } />
                          <Route path="/SectorAndActivityRedirect/:tabName/:sectorId/:activityId"                    exact strict component={ SectorAndActivityRedirect } />
                          <Route path="/SectorAndActivityRedirect/:tabName/:sectorId/:activityId/:subactivityId"     exact strict component={ SectorAndActivityRedirect } />
  
                          <Route path="/project-definition"                                           exact strict component={ ProjectDefinition } />
                          <Route path="/project-definition/"                                          exact strict component={ ProjectDefinition } />
                          <Route path="/project-definition/:projectMappingId"                         exact strict component={ ProjectDefinition } />
                          <Route path="/project-mapping"                                              exact strict component={ ProjectMapping } />
                          <Route path="/project-mapping/"                                             exact strict component={ ProjectMapping } />
                          <Route path="/project-mapping/:projectMappingId"                            exact strict component={ ProjectMapping } />
                          <Route path="/sector-mapping"                                               exact strict component={ SectorMapping } />
                          <Route path="/sector-mapping/"                                              exact strict component={ SectorMapping } />
                          <Route path="/sector-mapping/:sectorMappingId"                              exact strict component={ SectorMapping } />
                          { /*Plans Routes*/}
                          <Route path="/plan-details"                                                 exact strict component={ plan } />
                          <Route path="/plan-details/"                                                exact strict component={ plan } />
                          <Route path="/plan-details/:id"                                             exact strict component={ plan } />
                          <Route path="/caseStudy"                                                    exact strict component={ CaseStudy } />
                          <Route path="/caseStudy/"                                                   exact strict component={ CaseStudy } />
                          <Route path="/caseStudy/:id"                                                exact strict component={ CaseStudy } />
                          <Route path="/caseStudyView/:id"                                            exact strict component={ CaseStudyView } />
                          <Route path="/highlight"                                                    exact strict component={ Highlight } />
                          <Route path="/highlight/"                                                   exact strict component={ Highlight } />
                          <Route path="/highlight/:id"                                                exact strict component={ Highlight } />                      
                          <Route path="/highlightview/:id"                                            exact strict component={ HighlightView } />                      
                          <Route path="/activitywise-annual-completion-report"                        exact strict component={ report1 } />
                          <Route path="/sector-wise-annual-completion-summary-report"                 exact strict component={ report2 } />
                          <Route path="/activity-wise-periodic-variance-report"                       exact strict component={ report3 } />
                          <Route path="/sectorwise-periodic-variance-summary-report"                  exact strict component={ report4 } />
                          <Route path="/activity-wise-periodic-physical-variance-report"              exact strict component={ report5 } />
                          <Route path="/geographical-report"                                          exact strict component={ report6 } />
                          <Route path="/villagewise-family-report"                                    exact strict component={ report7 } />
                          <Route path="/category-wise-report"                                         exact strict component={ report8 } />
                          <Route path="/upgraded-beneficiary-report"                                  exact strict component={ report9 } />
                          <Route path="/goal-sector-report"                                           exact strict component={ report10 } />
                          <Route path="/activitywise-annual-plan-report"                              exact strict component={ report13 } />
                          <Route path="/activity-wise-periodic-plan-report"                           exact strict component={ report14 } />
                          <Route path="/sector-wise-periodic-plan-summary-report"                     exact strict component={ report15 } />
                          <Route path="/sector-wise-annual-plan-summary-report"                       exact strict component={ report16 } />
                          <Route path="/Project-report"                                               exact strict component={ ProjectReport } />
                          <Route path="/center-ranking-report"                                        exact strict component={ report17 } />
                      </Switch>        
                      </div>
                    </div>
                  </div>
                  <div className="footerCSS col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                    <Footer />
                  </div>
                </div>
                <div className="leftsidebarbackgroundcolor">
                  <div className="row">
                    <Leftsidebar />
                  </div>
                </div>
              </div>
            </div> 
          </Router>
      
        );
    }else{
       return(
        <div>
          <Router>
            <Switch>
              <Route path="/"               exact strict component={ Login } />
              <Route path="/login"          exact strict component={ Login } />
              <Route path="/signup"         exact strict component={ SignUp } />
              <Route path="/forgot-pwd"     exact strict component={ ForgotPassword } />
              <Route path="/reset-pwd"      exact strict component={ ResetPassword } />
              <Route path="/verify-account" exact strict component={ VerifyAccount } />
              <Route path="/confirm-otp"    exact strict component={ ConfirmOtp } />
            </Switch>        
          </Router>
        </div>
      );
    }
  }
}
export default Layout;
