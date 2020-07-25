import React, { Component } from 'react';
import $                    from 'jquery';
import swal                 from 'sweetalert';
import axios                from 'axios';
import _                    from 'underscore';
import moment               from 'moment';
import jQuery               from 'jquery';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import IAssureTable         from "../../../coreAdmin/IAssureTable/IAssureTable.jsx";
import Loader               from "../../../common/Loader.js";
import "./Activities_in_beneficiary_Report.css"
import "../../Reports/Reports.css";
class Activities_in_beneficiary_Report extends Component{
	constructor(props){
    super(props);
    this.state = {
        'tableDatas'        : [],
        'reportData'        : {},
        'tableData'         : [],
        "startRange"        : 0,
        "limitRange"        : 10000,
        "sector"            : "all",
        "sector_ID"         : "all",
        "activity_ID"       : "all",
        "activity"          : "all",
        "subactivity"       : "all",
        "subActivity_ID"    : "all",
        "district"          : "all",
        "selectedDistrict"  : "all",
        "block"             : "all",
        "village"           : "all",
        "projectCategoryType": "all",
        "beneficiaryType"    : "all",
        "projectName"        : "all",
        "twoLevelHeader"    : {
            apply           : false,
            firstHeaderData : [
                {
                    heading : 'Family Details',
                    mergedColoums : 3,
                    hide : false
                }, 
               
                {
                    heading : 'Activity Details',
                    mergedColoums : 6,
                     hide : false
                },
               
            ]
        },
        "tableHeading"      : {         
            "name_beneficiary"         : 'Family Head Name',     
            "familyID"            : 'Family ID',
            "projectCategoryType" : 'Project Category',
            "projectName"         : 'Project Name',
            "name"                : 'Activity',
            // "sectorName"          : 'Sector',
            // "activityName"        : 'Activity',
            // "subactivityName"     : 'Subactivity',
            "unit"                : "Unit",    
            "UnitCost"            : "Unit Cost",    
            "quantity"            : "Quantity",    
            "total"               : "Total",    
            "LHWRF"               : "LHWRF",    
            "NABARD"              : "NABARD",     
            "Bank_Loan"           : "Bank_Loan",        
            "Govt"                : "Govt",   
            "DirectCC"            : "DirectCC",       
            "IndirectCC"          : "IndirectCC",         
            "Other"               : "Other",    
            "village"             : 'Village',
            "block"               : 'Block',
            "district"            : 'District',
                
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
      this.getAvailableSectors = this.getAvailableSectors.bind(this);
  }
  componentDidMount(){
    const center_ID = localStorage.getItem("center_ID");
    const centerName = localStorage.getItem("centerName");
    this.setState({
      center_ID    : center_ID,
      centerName   : centerName,
    },()=>{
    this.getAvailableCenterData(this.state.center_ID);
    // console.log("center_ID =",this.state.center_ID);
    this.getData(this.state.startDate, this.state.endDate, this.state.selectedDistrict, this.state.block, this.state.village, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.center_ID, this.state.activity_ID, this.state.subActivity_ID);
    });
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
    this.getAvailableProjects();
    this.getAvailableSectors();
    this.currentFromDate();
    this.currentToDate();
    this.setState({
      // "center"  : this.state.center[0],
      // "sector"  : this.state.sector[0],
      tableData : this.state.tableData,
    },()=>{
    // console.log('DidMount', this.state.startDate, this.state.endDate,'center_ID', this.state.center_ID,'sector_ID', this.state.sector_ID)
    this.getData(this.state.startDate, this.state.endDate, this.state.selectedDistrict, this.state.block, this.state.village, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.center_ID, this.state.activity_ID, this.state.subActivity_ID);
    })
    this.handleFromChange = this.handleFromChange.bind(this);
    this.handleToChange = this.handleToChange.bind(this);
  }
 
  componentWillReceiveProps(nextProps){
    this.getAvailableProjects();
    this.getAvailableSectors();
    this.currentFromDate();
    this.currentToDate();
    this.getData(this.state.startDate, this.state.endDate, this.state.selectedDistrict, this.state.block, this.state.village, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.center_ID, this.state.activity_ID, this.state.subActivity_ID);
    // console.log('componentWillReceiveProps', this.state.startDate, this.state.endDate,'center_ID', this.state.center_ID,'sector_ID', this.state.sector_ID)
  }
  handleChange(event){
    event.preventDefault();
    this.setState({
      [event.target.name] : event.target.value
    },()=>{
      this.getData(this.state.startDate, this.state.endDate, this.state.selectedDistrict, this.state.block, this.state.village, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.center_ID, this.state.activity_ID, this.state.subActivity_ID);
      // console.log('name', this.state)
    });
  }

  getAvailableCenterData(center_ID){
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
        this.setState({
          availableDistInCenter  : availableDistInCenter,
          address          : response.data[0].address.stateCode+'|'+response.data[0].address.district,
        },()=>{
          this.getData(this.state.startDate, this.state.endDate, this.state.selectedDistrict, this.state.block, this.state.village, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.center_ID, this.state.activity_ID, this.state.subActivity_ID);
          var stateCode =this.state.address.split('|')[0];
         this.setState({
            stateCode  : stateCode,
          });
      })
    }).catch(function (error) {
      console.log("districtError",+error);
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
        // console.log('startDate', this.state.startDate, 'center_ID', this.state.center_ID,'sector_ID', this.state.sector_ID)
        this.getData(this.state.startDate, this.state.endDate, this.state.selectedDistrict, this.state.block, this.state.village, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.center_ID, this.state.activity_ID, this.state.subActivity_ID);
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
      activity_ID    : activity_ID,
      subActivity_ID : "all",
      subactivity    : "all",
    },()=>{
      this.getAvailableSubActivity(this.state.sector_ID, this.state.activity_ID);
      this.getData(this.state.startDate, this.state.endDate, this.state.selectedDistrict, this.state.block, this.state.village, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.center_ID, this.state.activity_ID, this.state.subActivity_ID);
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
      this.getData(this.state.startDate, this.state.endDate, this.state.selectedDistrict, this.state.block, this.state.village, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.center_ID, this.state.activity_ID, this.state.subActivity_ID);
    })
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
        selectedDistrict :selectedDistrict,
        block : "all",
        village : "all",
      },()=>{        
      this.getData(this.state.startDate, this.state.endDate, this.state.selectedDistrict, this.state.block, this.state.village, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.center_ID, this.state.activity_ID, this.state.subActivity_ID);
      // console.log('selectedDistrict',this.state.selectedDistrict);
      // this.getBlock(this.state.stateCode, this.state.selectedDistrict);
      axios({
        method: 'get',
        url: '/api/centers/'+this.state.center_ID,
        }).then((response)=> {
        // console.log('availableblockInCenter ==========',response);
        function removeDuplicates(data, param, district){
          return data.filter(function(item, pos, array){
            return array.map(function(mapItem){ if(district===mapItem.district.split('|')[0]){return mapItem[param]} }).indexOf(item[param]) === pos;
          })
        }
        var availableblockInCenter = removeDuplicates(response.data[0].villagesCovered, "block", this.state.selectedDistrict);
        this.setState({
          listofBlocks     : availableblockInCenter,
        })
      }).catch(function (error) {
        console.log("error = ",error);
      });
      })
    });
  }
/*  getBlock(stateCode, selectedDistrict){
    // console.log("sd", stateCode,selectedDistrict);
    axios({
      method: 'get',
      url: 'http://locations2.iassureit.com/api/blocks/get/list/IN/'+stateCode+'/'+selectedDistrict,
    }).then((response)=> {
        // console.log('response ==========', response.data);
        this.setState({
          listofBlocks : response.data
        },()=>{
        })
    }).catch(function (error) {
      console.log('error', error);
    });
  }*/
  selectBlock(event){
    event.preventDefault();
    var block = event.target.value;
    this.setState({
      block : block,
      village : "all",
    },()=>{
      // console.log("block",block);
      this.getData(this.state.startDate, this.state.endDate, this.state.selectedDistrict, this.state.block, this.state.village, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.center_ID, this.state.activity_ID, this.state.subActivity_ID);
      // this.getVillages(this.state.stateCode, this.state.selectedDistrict, this.state.block);
      axios({
        method: 'get',
        url: '/api/centers/'+this.state.center_ID,
        }).then((response)=> {
        function removeDuplicates(data, param, district, block){
          return data.filter(function(item, pos, array){
            return array.map(function(mapItem){if(district===mapItem.district.split('|')[0]&&block===mapItem.block){return mapItem[param];}}).indexOf(item[param]) === pos;
          })
        }
        var availablevillageInCenter = removeDuplicates(response.data[0].villagesCovered, "village",this.state.selectedDistrict,this.state.block);
        this.setState({
          listofVillages   : availablevillageInCenter,
        })
      }).catch(function (error) {
        console.log("error = ",error);
      });
    });
  }
  /*getVillages(stateCode, selectedDistrict, block){
    // console.log(stateCode, selectedDistrict, block);
    axios({
      method: 'get',
      // url: 'http://locations2.iassureit.com/api/cities/get/list/'+block+'/'+selectedDistrict+'/'+stateCode+'/IN',
      url: 'http://locations2.iassureit.com/api/cities/get/list/IN/'+stateCode+'/'+selectedDistrict+'/'+block,
    }).then((response)=> {
        // console.log('response ==========', response.data);
        this.setState({
          listofVillages : response.data
        },()=>{
        // console.log('listofVillages', this.state.listofVillages);
        })
    }).catch(function (error) {
      console.log('error', error);
    });
  }*/
  selectVillage(event){
    event.preventDefault();
    var village = event.target.value;
    this.setState({
      village : village
    },()=>{
      this.getData(this.state.startDate, this.state.endDate, this.state.selectedDistrict, this.state.block, this.state.village, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.center_ID, this.state.activity_ID, this.state.subActivity_ID);
      // console.log("village",village);
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
              this.getData(this.state.startDate, this.state.endDate, this.state.selectedDistrict, this.state.block, this.state.village, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.center_ID, this.state.activity_ID, this.state.subActivity_ID);
            })          
        }else if (this.state.projectCategoryType=== "all"){
            this.setState({
              projectName : "all",
            },()=>{
              this.getData(this.state.startDate, this.state.endDate, this.state.selectedDistrict, this.state.block, this.state.village, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.center_ID, this.state.activity_ID, this.state.subActivity_ID);
            })    
        }else  if(this.state.projectCategoryType=== "Project Fund"){
          this.getData(this.state.startDate, this.state.endDate, this.state.selectedDistrict, this.state.block, this.state.village, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.center_ID, this.state.activity_ID, this.state.subActivity_ID);
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
        this.getData(this.state.startDate, this.state.endDate, this.state.selectedDistrict, this.state.block, this.state.village, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.center_ID, this.state.activity_ID, this.state.subActivity_ID);
        // console.log('startDate', this.state.startDate, 'center_ID', this.state.center_ID,'sector_ID', this.state.sector_ID)
    })
  }

  sortNumber(key, tableData){
    var nameA = '';
    var nameB = '';
    var reA = /[^a-zA-Z]/g;
    var reN = /[^0-9]/g;
    var aN = 0;
    var bN = 0;
    var sortedData = tableData.sort((a, b)=> {
      Object.entries(a).map( 
        ([key1, value1], i)=> {
          if(key === key1){
            nameA = value1.replace(reA, "");        
          }
        }
      );
      Object.entries(b).map( 
        ([key2, value2], i)=> {
          if(key === key2){
            nameB = value2.replace(reA, "");
          }
        }
      );
      if(this.state.sort === true){
        this.setState({
          sort    : false
        })
        if (nameA === nameB) {
          Object.entries(a).map( 
            ([key1, value1], i)=> {
              if(key === key1){
                aN = parseInt(value1.replace(reN, ""), 10);       
              }
            }
          );
          Object.entries(b).map( 
            ([key1, value1], i)=> {
              if(key === key1){
                bN = parseInt(value1.replace(reN, ""), 10);         
              }
            }
          );
          if (aN < bN) {
            return -1;
          }
          if (aN > bN) {
            return 1;
          }
          return 0;
        } else {

          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        }
      }else if(this.state.sort === false){
        this.setState({
          sort    : true
        })
        if (nameA === nameB) {
          Object.entries(a).map( 
            ([key1, value1], i)=> {
              if(key === key1){
                aN = parseInt(value1.replace(reN, ""), 10);     
              }
            }
          );
          Object.entries(b).map( 
            ([key1, value1], i)=> {
              if(key === key1){
                bN = parseInt(value1.replace(reN, ""), 10);         
              }
            }
          );
          if (aN > bN) {
            return -1;
          }
          if (aN < bN) {
            return 1;
          }
          return 0;
        } else {
          if (nameA > nameB) {
            return -1;
          }
          if (nameA < nameB) {
            return 1;
          }
          return 0;
        }
      }       
    });
    this.setState({
      tableData : sortedData,
    });
  }
  sortString(key, tableData){
    var nameA = '';
    var nameB = '';
    var sortedData = tableData.sort((a, b)=> {
      Object.entries(a).map( 
        ([key1, value1], i)=> {
          if(key === key1){
            if(jQuery.type( value1 ) === 'string'){
              nameA = value1.toUpperCase();
            }else{
              nameA = value1;
            }           
          }
        }
      );
      Object.entries(b).map( 
        ([key2, value2], i)=> {
          if(key === key2){
            if(jQuery.type( value2 ) === 'string'){
              nameB = value2.toUpperCase();
            }else{
              nameB = value2;
            } 
          }
        }
      );
      if(this.state.sort === true){ 
        this.setState({
          sort    : false
        })    
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      }else if(this.state.sort === false){
        this.setState({
          sort    : true
        })  
        if (nameA > nameB) {
          return -1;
        }
        if (nameA < nameB) {
          return 1;
        }
        return 0;
      }
    });
    this.setState({
      tableData : sortedData,
    });
  }
  sort(event){
    event.preventDefault();
    var key = event.target.getAttribute('id');
    var tableData = this.state.tableData;
    console.log('tableData',tableData, "key",key);
    if(key === 'number'){
      this.sortNumber(key, tableData);
    }else{
      this.sortString(key, tableData);
    }
  }
  getData(startDate, endDate, selectedDistrict, block, village, sector_ID, projectCategoryType, projectName, beneficiaryType, center_ID, activity_ID, subActivity_ID){        
    // console.log(startDate, endDate, selectedDistrict, block, village, sector_ID, projectCategoryType, projectName, beneficiaryType, center_ID);
      // var endDate = "2021-06-17"
      if(startDate && endDate && selectedDistrict && block && village && sector_ID && projectCategoryType  && beneficiaryType && center_ID){
        if(sector_ID==="all"){
          $(".fullpageloader").show();

          axios.get('/api/report/list_Activities_in_beneficiary/'+startDate+'/'+endDate+'/'+selectedDistrict+'/'+block+'/'+village+'/all/'+projectCategoryType+'/'+projectName+'/'+beneficiaryType+'/'+center_ID+'/'+activity_ID+'/'+subActivity_ID)
          .then((response)=>{
            $(".fullpageloader").hide();
            console.log("resp",response);
            this.setState({
              tableData : response.data
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
          axios.get('/api/report/list_Activities_in_beneficiary/'+startDate+'/'+endDate+'/'+selectedDistrict+'/'+block+'/'+village+'/'+sector_ID+'/'+projectCategoryType+'/'+projectName+'/'+beneficiaryType+'/'+center_ID+'/'+activity_ID+'/'+subActivity_ID)
          .then((response)=>{
            console.log("resp",response);
            this.setState({
              tableData : response.data
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
    this.getData(this.state.startDate, this.state.endDate, this.state.selectedDistrict, this.state.block, this.state.village, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.center_ID, this.state.activity_ID, this.state.subActivity_ID);
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
      this.getData(this.state.startDate, this.state.endDate, this.state.selectedDistrict, this.state.block, this.state.village, this.state.sector_ID, this.state.projectCategoryType, this.state.projectName, this.state.beneficiaryType, this.state.center_ID, this.state.activity_ID, this.state.subActivity_ID);
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
        // console.log("today",today);
      }
  
      // console.log("nowfrom",today)
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
  
  printTable(event){
    var DocumentContainer = document.getElementById('section-to-screen');
    var WindowObject = window.open('', 'PrintWindow', 'height=400,width=600');
    WindowObject.document.write(DocumentContainer.innerHTML);
    WindowObject.document.close();
    WindowObject.focus();
    WindowObject.print();
    WindowObject.close();
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
                      Beneficiary Coverage Report
                    </div>
                  </div>
                  <hr className="hr-head"/>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12 valid_box ">
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
                          <option disabled="disabled" selected={true}>-- Select --</option>
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
                          <option disabled="disabled" selected={true}>-- Select --</option>
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
                    <div className=" col-lg-3 col-md-4 col-sm-12 col-xs-12 valid_box ">
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
                                <option key={index} value={(data.district+'|'+data._id)}>{data.district.split('|')[0]}</option>

                              );
                            })
                            :
                            null
                          }                               
                        </select>
                      </div>
                    </div>
                    <div className=" col-lg-3 col-md-4 col-sm-6 col-xs-12 valid_box">
                      <label className="formLable">Block</label><span className="asterix"></span>
                      <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="block" >
                        <select className="custom-select form-control inputBox" ref="block" name="block" value={this.state.block} onChange={this.selectBlock.bind(this)} >
                          <option  className="hidden" >-- Select --</option>
                          <option value="all" >All</option>
                          {
                            this.state.listofBlocks && this.state.listofBlocks.length > 0  ? 
                            this.state.listofBlocks.map((data, index)=>{
                              return(
                                <option key={index} value={data.block}>{data.block}</option>
                              );
                            })
                            :
                            null
                          }                              
                        </select>
                      </div>
                      {/*<div className="errorMsg">{this.state.errors.block}</div>*/}
                    </div>
                    <div className=" col-lg-3 col-md-4 col-sm-6 col-xs-12 valid_box">
                      <label className="formLable">Village</label><span className="asterix"></span>
                      <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="village" >
                        <select className="custom-select form-control inputBox" ref="village" name="village" value={this.state.village} onChange={this.selectVillage.bind(this)}  >
                          <option  className="hidden" >-- Select --</option>
                          <option value="all" >All</option>
                          {
                            this.state.listofVillages && this.state.listofVillages.length > 0  ? 
                            this.state.listofVillages.map((data, index)=>{
                              return(
                                <option key={index} value={data.village}>{data.village}</option>
                              );
                            })
                            :
                            null
                          } 
                        </select>
                      </div>
                      {/*<div className="errorMsg">{this.state.errors.village}</div>*/}
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
                      <label className="formLable">To</label><span className="asterix"></span>
                      <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sector" >
                          <input onChange={this.handleToChange}  onBlur={this.onBlurEventTo.bind(this)} name="endDate" ref="endDate" id="endDate" value={this.state.endDate} type="date" className="custom-select form-control inputBox" placeholder=""   />
                      </div>
                    </div>
                  </div>  
                  <div className="marginTop11">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">                        
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        { 
                          this.state.tableData && this.state.tableData.length != 0 ?
                            <React.Fragment>
                              <div className="col-lg-1 col-md-1 col-xs-12 col-sm-12 NOpadding  pull-right ">
                                <button type="button" className="btn pull-left tableprintincon" title="Print Table" onClick={this.printTable}><i className="fa fa-print" aria-hidden="true"></i></button>
                                  <ReactHTMLTableToExcel
                                          id="table-to-xls"                           
                                          className="download-table-xls-button fa fa-download tableicons pull-right"
                                          table="FamilyCoverageReport"
                                          sheet="tablexls"
                                          filename="FamilyCoverageReport"
                                          buttonText=""/>
                              </div>
                            </React.Fragment>
                          : null
                        }   
                      </div>
                      <div className="report-list-downloadMain col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div className="table-responsive" id="section-to-screen">
                          <table className="table iAssureITtable-bordered table-striped table-hover fixedTable" id="Activities_in_beneficiary_Report">
                            <thead className="tempTableHeader fixedHeader">
                              <tr className="tempTableHeader"></tr>
                              <tr className="">
                                <th className="umDynamicHeader srpadd text-center">
                                  <div className="colSr">Sr.No.</div>
                                </th>
                                <th id="name_beneficiary" className="umDynamicHeader srpadd textAlignLeft ">
                                  <div className="wrapWord col1">Name of Beneficiary</div>
                                  <span onClick={this.sort.bind(this)} id="name_beneficiary" className="fa fa-sort tableSort"></span>
                                </th>
                                <th id="beneficiaryID" className="umDynamicHeader srpadd textAlignLeft ">
                                  <div className="wrapWord col2">Beneficiary ID</div>
                                  <span onClick={this.sort.bind(this)} id="beneficiaryID" className="fa fa-sort tableSort"></span>
                                </th>
                                <th id="familyID" className="umDynamicHeader srpadd textAlignLeft ">
                                  <div className="wrapWord col2">Family ID</div>
                                  <span onClick={this.sort.bind(this)} id="familyID" className="fa fa-sort tableSort"></span>
                                </th>
                                <th id="projectCategoryType" className="umDynamicHeader srpadd textAlignLeft ">
                                  <div className="wrapWord col3">Project Category</div>
                                  <span onClick={this.sort.bind(this)} id="projectCategoryType" className="fa fa-sort tableSort"></span>
                                </th>
                                <th id="projectName" className="umDynamicHeader srpadd textAlignLeft ">
                                  <div className="wrapWord col4">Project Name</div>
                                  <span onClick={this.sort.bind(this)} id="projectName" className="fa fa-sort tableSort"></span>
                                </th>
                                <th id="name" className="umDynamicHeader srpadd textAlignLeft ">
                                  <div className="wrapWord col5">Sector</div>
                                  <span id="name" className="fa fa-sort tableSort"></span>
                                </th>
                                <th id="activityName" className="umDynamicHeader srpadd textAlignLeft ">
                                  <div className="wrapWord col6">Activity</div>
                                  <span id="activityName" className="fa fa-sort tableSort"></span>
                                </th>
                                <th id="subactivityName" className="umDynamicHeader srpadd textAlignLeft ">
                                  <div className="wrapWord col7">Subactivity</div>
                                  <span id="subactivityName" className="fa fa-sort tableSort"></span>
                                </th>
                                <th id="unit" className="umDynamicHeader srpadd textAlignLeft ">
                                  <div className="wrapWord col8">Unit</div>
                                  <span onClick={this.sort.bind(this)} id="unit" className="fa fa-sort tableSort"></span>
                                </th>
                                <th id="UnitCost" className="umDynamicHeader srpadd textAlignLeft ">
                                  <div className="wrapWord col9">Unit Cost</div>
                                  <span onClick={this.sort.bind(this)} id="UnitCost" className="fa fa-sort tableSort"></span>
                                </th>
                               <th id="quantity" className="umDynamicHeader srpadd textAlignLeft ">
                                  <div className="wrapWord col10">Quantity</div>
                                  <span onClick={this.sort.bind(this)} id="quantity" className="fa fa-sort tableSort"></span>
                                </th>
                                <th id="total" className="umDynamicHeader srpadd textAlignLeft ">
                                  <div className="wrapWord col11">Total</div>
                                  <span onClick={this.sort.bind(this)} id="total" className="fa fa-sort tableSort"></span>
                                </th>
                                <th id="LHWRF" className="umDynamicHeader srpadd textAlignLeft ">
                                  <div className="wrapWord col12">LHWRF</div>
                                  <span onClick={this.sort.bind(this)} id="LHWRF" className="fa fa-sort tableSort"></span>
                                </th>
                                <th id="NABARD" className="umDynamicHeader srpadd textAlignLeft ">
                                  <div className="wrapWord col13">NABARD</div>
                                  <span onClick={this.sort.bind(this)} id="NABARD" className="fa fa-sort tableSort"></span>
                                </th>
                                <th id="Bank_Loan" className="umDynamicHeader srpadd textAlignLeft ">
                                  <div className="wrapWord col14">Bank Loan</div>
                                  <span onClick={this.sort.bind(this)} id="Bank_Loan" className="fa fa-sort tableSort"></span>
                                </th>
                                <th id="Govt" className="umDynamicHeader srpadd textAlignLeft ">
                                  <div className="wrapWord col15">Govt</div>
                                  <span onClick={this.sort.bind(this)} id="Govt" className="fa fa-sort tableSort"></span>
                                </th>
                                <th id="DirectCC" className="umDynamicHeader srpadd textAlignLeft ">
                                  <div className="wrapWord col16">DirectCC</div>
                                  <span onClick={this.sort.bind(this)} id="DirectCC" className="fa fa-sort tableSort"></span>
                                </th>
                                <th id="IndirectCC" className="umDynamicHeader srpadd textAlignLeft ">
                                  <div className="wrapWord col17">IndirectCC</div>
                                  <span onClick={this.sort.bind(this)} id="IndirectCC" className="fa fa-sort tableSort"></span>
                                </th>
                                <th id="Other" className="umDynamicHeader srpadd textAlignLeft ">
                                  <div className="wrapWord col18">Other</div>
                                  <span onClick={this.sort.bind(this)} id="Other" className="fa fa-sort tableSort"></span>
                                </th>
                                {/*<th id="village" className="umDynamicHeader srpadd textAlignLeft ">
                                  <div className="wrapWord col19">Village</div>
                                  <span onClick={this.sort.bind(this)} id="village" className="fa fa-sort tableSort"></span>
                                </th>
                                <th id="block" className="umDynamicHeader srpadd textAlignLeft ">
                                  <div className="wrapWord col20">Block</div>
                                  <span onClick={this.sort.bind(this)} id="block" className="fa fa-sort tableSort"></span>
                                </th>
                                <th id="district" className="umDynamicHeader srpadd textAlignLeft ">
                                  <div className="wrapWord col21">District</div>
                                  <span onClick={this.sort.bind(this)} id="district" className="fa fa-sort tableSort"></span>
                                </th>*/}
                              </tr>
                            </thead>
                            <tbody className={this.state.tableData && this.state.tableData.length > 0 ? "scrollContent" : ""} >
                              { this.state.tableData && this.state.tableData.length > 0?
                                this.state.tableData.map((value, i)=> {
                                          // console.log("value",value,"i", i)
                                  // console.log("value.sectorData",value.sectorData)
                                  var sectorLength=value.sectorData.length
                                    return(                                    
                                      <tr className="tablerow"  key={i}>
                                        <td className="textAlignCenter"><div className="colSr">{i+1}</div>
                                        </td>
                                        <td className=""><div className=" col1">{value._id.name_beneficiary}</div>
                                        </td>
                                        <td className=""><div className=" col2">{value._id.beneficiaryID}</div>
                                        </td>
                                        <td className=""><div className=" col2">{value._id.familyID}</div>
                                        </td>
                                        { 
                                          sectorLength !== 0 && value.sectorData ?
                                            Object.entries(value.sectorData).map(([key, value1], index)=> {
                                            // console.log("value1===================",value1[0])
                                            // console.log("value1", value1,"index", index)
                                              return(
                                                <tr className="tablerow" key={index}>
                                                  <td className=""><div className="col3">{value1.projectCategoryType}</div></td>
                                                  <td className=""><div className="col4">{value1.projectName === "all" ? "-" : value1.projectName}</div></td>
                                                  <td className=""><div className="col5">{value1.sectorName}</div></td>
                                                  <td className=""><div className="col6">{value1.activityName}</div></td>
                                                  <td className=""><div className="col7">{value1.subactivityName}</div></td>
                                                  <td className=""><div className="col8">{value1.unit}</div></td>
                                                  <td className="textAlignRight"><div className="col9">{value1.UnitCost}</div></td>
                                                  <td className="textAlignRight"><div className="col10">{value1.quantity}</div></td>
                                                  <td className="textAlignRight"><div className="col11">{value1.total}</div></td>
                                                  <td className="textAlignRight"><div className="col12">{value1.LHWRF}</div></td>
                                                  <td className="textAlignRight"><div className="col13">{value1.NABARD}</div></td>
                                                  <td className="textAlignRight"><div className="col14">{value1.Bank_Loan}</div></td>
                                                  <td className="textAlignRight"><div className="col15">{value1.Govt}</div></td>
                                                  <td className="textAlignRight"><div className="col16">{value1.DirectCC}</div></td>
                                                  <td className="textAlignRight"><div className="col17">{value1.IndirectCC}</div></td>
                                                  <td className="textAlignRight"><div className="col18">{value1.Other}</div></td>
                                                  {/*<td className=""><div className="col19">{value1.village}</div></td>
                                                  <td className=""><div className="col20">{value1.block}</div></td>
                                                  <td className=""><div className="col21">{value1.district}</div></td>*/}
                                                </tr>
                                              )
                                            })
                                          : null
                                        }
                                      </tr>
                                    )
                                  })
                                :
                                <tr className="trAdmin"><td colSpan= "21" className="noTempData textAlignCenter">No Record Found!</td></tr>                   
                              } 
                            </tbody>
                          </table>
                        </div>
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
export default Activities_in_beneficiary_Report