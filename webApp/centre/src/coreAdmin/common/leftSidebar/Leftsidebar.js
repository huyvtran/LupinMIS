import React,{Component} from 'react';
// import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch,Link,location } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import $ from "jquery";

// import Header from '../header/Header.js'
import './Leftsidebar.css';

export default class Leftsidebar extends Component{
  
  constructor(props) {
   super(props);
    this.state = {}
  }
   
  componentDidMount(){
    $(document).ready(function () {
      $('.activeClass li').on('click', function() {
        $('.activeClass li').removeClass('activeOne');
        $(this).addClass('activeOne');

      });
    });
    const center_ID = localStorage.getItem("center_ID");
    this.setState({
      center_ID    : center_ID,
    },()=>{
    })
  }    

  eventclk1(event){
    // event.preventDefault();
    // $(event.currentTarget).children('.treeview-menu').slideToggle();
    // $(event.currentTarget).addClass('active');
    // $(event.currentTarget).children(Link).children(".rotate").toggleClass("down");
    // $(event.currentTarget).siblings('li').removeClass('active');

  } 

   Addclass(event){
     // $(".menuContent").toggleClass("openContent");
  //     if ($('.activeClass').attr('aria-expanded') === true) {
  //     $(this).find(".activeClass").toggleClass("openContent");
  // }
    // $("pull-right-container").children('i').css({"transform": "rotate(-90deg)"});
 
  }   
  render(){
    var center_ID = this.state.center_ID;
    // console.log('nkhjh',  window.screen.height );  
    var sidebarHeight = window.screen.height - 155;
    return(
      <div className="">
        <aside className="leftsidebar">
          <div className="wrapper">
            <nav id="sidebar">
              <div className="sidebar-header">
                <h4 className="text-center"><b>Center Lupin MIS</b></h4>
                <strong className="sidebarLogoName">LFMIS <p className="fz14">Center</p></strong>
              </div>
              <ul className="list-unstyled sidebar-menu components scrollBox" style={{height:  sidebarHeight+"px"}}>
                <li className=" sidebarMenuText">
                  <Link to="/" title="Dashboard">
                    <i className="glyphicon glyphicon-briefcase"></i>
                    Dashboard
                  </Link>
                </li>
                <li className="sidebarMenuText" onClick={this.eventclk1.bind(this)}>
                  <Link to="#planreport" data-toggle="collapse" aria-expanded="false" className="menuContent" title="Planning Management">
                    <i className="fa fa-pie-chart" />
                      Create Plan
                    <i className="leftarrow fa fa-sort-down rotate pull-right"></i> 
                  </Link>
                  <ul className="collapse list-unstyled activeClass" id="planreport">
                    <li className="sidebarMenuText">
                      <Link to="/plan-details" title="Add New Plan">
                        <i className="fa fa-circle-o" />
                        Add New Plan
                      </Link>
                    </li>
                    <li className="sidebarMenuText">
                      <Link to="/filewise-monthly-plan-list" >
                        <i className="fa fa-circle-o" />
                        Filewise Quaterly Plans
                      </Link>
                    </li>
                  </ul>
                </li> 
                <li className="sidebarMenuText" onClick={this.eventclk1.bind(this)}>
                  <Link to="#annualplanreport" data-toggle="collapse" aria-expanded="false" className="menuContent" title="Planning Management">
                    <i className="fa fa-book" />
                      View Plans
                    <i className="leftarrow fa fa-sort-down rotate pull-right"></i> 
                  </Link>
                  <ul className="collapse list-unstyled activeClass" id="annualplanreport">
                    {/*<li className="sidebarMenuText">
                      <Link to="/annual-plan-details" title="Annual Plan">
                        <i className="fa fa-circle-o" />
                        View Annual Plan
                      </Link>
                    </li>  */}
                    <li>
                      <Link to="/activity-wise-plan" title="Activity Plan">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Activity Plan</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/sector-wise-plan" title="Sector Plan">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Sector Plan</span>
                      </Link>
                    </li>
                    {/*
                      <li>
                        <Link to="/activity-wise-periodic-plan-report" title="Activity Quaterly Plan">
                          <i className="fa fa-circle-o" />
                          <span className="sidebarMenuSubText">Activity Quaterly Plan</span>
                        </Link>
                      </li>                   
                      <li>
                        <Link to="/sector-wise-annual-plan-summary-report" title="Sector Annual Plan">
                          <i className="fa fa-circle-o" />
                          <span className="sidebarMenuSubText">Sector Annual Plan</span>
                        </Link>
                      </li>
                    <li>
                      <Link to="/activitywise-annual-plan-report" title="Activity Annual Plan">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Activity Annual Plan</span>
                      </Link>
                    </li>
                    */}
                  </ul>
                </li> 
                <li className="sidebarMenuText"  onClick={this.eventclk1.bind(this)}>
                  <Link to="#Activity" data-toggle="collapse" className="menuContent" aria-expanded="false" title="Activity Management">
                    <i className="fa fa-edit" />
                    Activity Management
                    <i className="leftarrow fa fa-sort-down rotate pull-right"></i>
                  </Link>
                  <ul className="collapse  list-unstyled activeClass" id="Activity">
                    <li>
                      <Link to="/a-type-activity-form" title="Family Level Activity">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Family Level Activity</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/b-type-activity-form" title="Type B Activity">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Type B Activity</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/Filewise-activity-list">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Filewise Activities</span>
                      </Link>
                    </li>  
                   {/* <li>
                      <Link to="/Filewise-beneficiary-activity-list">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Filewise Benef. in Activities</span>
                      </Link>
                    </li> */}                 
                    <li>
                      <Link to="/viewActivity" title="View all Activities">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">View all Activities</span>
                      </Link>
                    </li>
                  </ul>
                </li>             

                <li className="sidebarMenuText" onClick={this.eventclk1.bind(this)}>
                  <Link to="#MasterData" data-toggle="collapse" className="menuContent" aria-expanded="false" title="Family & Beneficiary">
                    <i className="fa fa-users" />
                    Family & Beneficiary
                    <i className="leftarrow fa fa-sort-down rotate pull-right"></i>
                  </Link>
                  <ul className="collapse list-unstyled activeClass" id="MasterData">
                    <li>
                      <Link to="/family" title="Create Family">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Create Family</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/Filewise-family-list">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Filewise Family List</span>
                      </Link>
                    </li>
                    
                    <li>
                      <Link to="beneficiary" title="Create Beneficiary">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Create Beneficiary</span>
                      </Link>
                    </li> 
                    <li>
                      <Link to="/Filewise-beneficiary-list">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Filewise Beneficiary List</span>
                      </Link>
                    </li>            
                  </ul>
                </li> 

                <li className="sidebarMenuText"  onClick={this.eventclk1.bind(this)}>
                  <Link to="#report" data-toggle="collapse" className="menuContent"  aria-expanded="false" title="Reporting System">
                    <i className="fa fa-files-o" />
                    Reports
                    <i className="leftarrow fa fa-sort-down rotate pull-right"></i>
                  </Link>

                  <ul className="collapse list-unstyled activeClass" id="report">
                  {/*<li>
                      <Link to="/sector-wise-annual-completion-summary-report" title="Sector Annual Report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Sector Annual Report</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/sectorwise-periodic-variance-summary-report" title="Sector Financial Variance">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Sector Financial Variance</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/activitywise-annual-completion-report" title="Activity Annual Report">
                        <i className="fa fa-circle-o" /> 
                        <span className="sidebarMenuSubText">Activity Annual Report</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/activity-wise-periodic-variance-report" title="Activity Financial Variance">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Activity Financial Variance</span>
                      </Link>
                    </li>*/}
                    {/*<li>
                      <Link to="/activity-wise-periodic-physical-variance-report" title="Activity Physical Variance">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Activity Physical Variance</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/geographical-report" title="Geographical Report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Geographical Report</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/upgraded-beneficiary-report" title="Beneficiary Report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Beneficiary Report</span>
                      </Link>
                    </li>
                  */}
                    <li>
                      <Link to="/activity-wise-report" title="Activity wise Report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Activity wise Report</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/sector-wise-report" title="Sector wise Report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Sector wise Report</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/category-wise-report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Category Report</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/family-coverage-report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Family Coverage Report</span>
                      </Link>
                    </li>                 
                    <li>
                      <Link to="/beneficiary-coverage-report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Beneficiary Coverage System</span>
                      </Link>
                    </li>      
                    <li>
                      <Link to="/goal-sector-report" title="Goal Report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Goal Report</span>
                      </Link>
                    </li>              
                    {/*<li>
                      <Link to="/Project-report" title="Project Achievement Report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">Project Achievement Report</span>
                      </Link>
                    </li>*/}
                  </ul>
                </li> 


                {/*<li className="sidebarMenuText" onClick={this.eventclk1.bind(this)}>
                  <Link to="#sreport" data-toggle="collapse" className="menuContent" aria-expanded="false" title="Special Reports">
                    <i className="fa fa-bars" />
                    Special Reports
                    <i className="leftarrow fa fa-sort-down rotate pull-right"></i>
                  </Link>
                  <ul className="collapse list-unstyled activeClass" id="sreport">
                    <li>
                      <Link to="/SDG-report" title="SDG Report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">SDG Report</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/ADP-report" title="ADP Report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">ADP Report</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/EMP-report" title="EMP Report">
                        <i className="fa fa-circle-o" />
                        <span className="sidebarMenuSubText">EMP Report</span>
                      </Link>
                    </li>
                  </ul>
                </li>*/}
             

                <li className="sidebarMenuText">
                  <Link to="/caseStudy" title="Case Study">
                    <i className="fa fa-book" />
                    Case Study
                  </Link>
                </li>



                <li className="sidebarMenuText">
                  <Link to="/highlight" title="Highlights">
                    <i className="fa fa-hand-o-right" />
                    Highlights
                  </Link>
                </li>
                <li className="sidebarMenuText" >
                  <Link to="/sectorList" title="Sector List">
                    <i className="fa fa-clipboard" />
                    Sector List
                  </Link>
                </li>
               <li className="sidebarMenuText" >
                  <Link to="/projectList" title="Project List">
                    <i className="fa fa-clipboard" />
                    Project List
                  </Link>
                </li>
                <li className="sidebarMenuText" >
                  <Link to={"/center-details/"+center_ID} title="Center Details">
                    <i className="fa fa-edit" /> 
                    Center Details
                  </Link>
                </li> 
                <li className="sidebarMenuText" >
                  <Link to="/centerList" title="Center List">
                    <i className="fa fa-th" />
                    Center List
                  </Link>
                </li>
                <li className="sidebarMenuText" >
                  <Link to="/listofvillages" title="List of Villages">
                    <i className="fa fa-th" />
                    List of Villages
                  </Link>
                </li>

              </ul>
            </nav>
          </div>
        </aside>
      </div>
    );
  }
}
