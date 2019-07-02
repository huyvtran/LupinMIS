import React, { Component } from 'react';
import IAssureTable         from '../IAssureTable/IAssureTable.jsx';
import axios                from 'axios';
export default class DailyReport extends Component{
	constructor(props){
        super(props);
        this.state = {
            "tableListData"     : [],
            "twoLevelHeader"    : this.props.twoLevelHeader,
            "tableHeading"      : this.props.tableHeading,
            "dataApiUrl"        : this.props.dataApiUrl,
            "startRange"        : 0,
            "limitRange"        : 10
        }
        this.handleChange = this.handleChange.bind(this);
        
    }

    componentDidMount(){
        // var reportData = {
        // "tableDatas"        : [
        //     {
        //         templateType    : 'Notification',
        //         templateName    : 'User Registration',
        //         subject         : 'User Registered Successfully.', 
        //         contents        : 'Content 1',
        //     },
        //     {
        //         templateType    : 'Email',
        //         templateName    : 'User Registration',
        //         subject         : 'User Registered Successfully.', 
        //         contents        : 'Content 2',
        //     },
        //     {
        //         templateType    : 'SMS',
        //         templateName    : 'User Registration',
        //         subject         : 'User Registered Successfully.', 
        //         contents        : 'Content 3',
        //     },
        //     {
        //         templateType    : 'Notification',
        //         templateName    : 'User Login',
        //         subject         : 'User loggedin Successfully.', 
        //         contents        : 'Content 4',
        //     },
        //     {
        //         templateType    : 'Email',
        //         templateName    : 'User Login',
        //         subject         : 'User loggedin Successfully.', 
        //         contents        : 'Content 5',
        //     },
        //     {
        //         templateType    : 'SMS',
        //         templateName    : 'User Login',
        //         subject         : 'User loggedin Successfully.', 
        //         contents        : 'Content 6',
        //     },
        //     {
        //         templateType    : 'Notification',
        //         templateName    : 'User Login',
        //         subject         : 'User loggedin Successfully.', 
        //         contents        : 'Content 7',
        //     },
        //     {
        //         templateType    : 'Email',
        //         templateName    : 'User Login',
        //         subject         : 'User loggedin Successfully.', 
        //         contents        : 'Content 8',
        //     },
        //     {
        //         templateType    : 'SMS',
        //         templateName    : 'User Login',
        //         subject         : 'User loggedin Successfully.', 
        //         contents        : 'Content 9',
        //     },
        //     {
        //         templateType    : 'Notification',
        //         templateName    : 'User Login',
        //         subject         : 'User loggedin Successfully.', 
        //         contents        : 'Content 10',
        //     },
        //     {
        //         templateType    : 'Email',
        //         templateName    : 'User Login',
        //         subject         : 'User loggedin Successfully.', 
        //         contents        : 'Content 11',
        //     },
        //     {
        //         templateType    : 'SMS',
        //         templateName    : 'User Login',
        //         subject         : 'User loggedin Successfully.', 
        //         contents        : 'Content 12',
        //     },
        //     {
        //         templateType    : 'Notification',
        //         templateName    : 'User Login',
        //         subject         : 'User loggedin Successfully.', 
        //         contents        : 'Content 13',
        //     },
        //     {
        //         templateType    : 'Email',
        //         templateName    : 'User Login',
        //         subject         : 'User loggedin Successfully.', 
        //         contents        : 'Content 14',
        //     },
        //     {
        //         templateType    : 'SMS',
        //         templateName    : 'User Login',
        //         subject         : 'User loggedin Successfully.', 
        //         contents        : 'Content 15',
        //     },
        //     {
        //         templateType    : 'Notification',
        //         templateName    : 'User Login',
        //         subject         : 'User loggedin Successfully.', 
        //         contents        : 'Content 16',
        //     },
        //     {
        //         templateType    : 'Email',
        //         templateName    : 'User Login',
        //         subject         : 'User loggedin Successfully.', 
        //         contents        : 'Content 17',
        //     },
        //     {
        //         templateType    : 'SMS',
        //         templateName    : 'User Login',
        //         subject         : 'User loggedin Successfully.', 
        //         contents        : 'Content 18',
        //     },
        //     {
        //         templateType    : 'Notification',
        //         templateName    : 'User Login',
        //         subject         : 'User loggedin Successfully.', 
        //         contents        : 'Content 19',
        //     },
        //     {
        //         templateType    : 'Email',
        //         templateName    : 'User Login',
        //         subject         : 'User loggedin Successfully.', 
        //         contents        : 'Content 20',
        //     },
        //     {
        //         templateType    : 'SMS',
        //         templateName    : 'User Login',
        //         subject         : 'User loggedin Successfully.', 
        //         contents        : 'Content 21',
        //     },
        //     {
        //         templateType    : 'Notification',
        //         templateName    : 'User Login',
        //         subject         : 'User loggedin Successfully.', 
        //         contents        : 'Content 22',
        //     },
        //     {
        //         templateType    : 'Email',
        //         templateName    : 'User Login',
        //         subject         : 'User loggedin Successfully.', 
        //         contents        : 'Content 23',
        //     },
        //     {
        //         templateType    : 'SMS',
        //         templateName    : 'User Login',
        //         subject         : 'User loggedin Successfully.', 
        //         contents        : 'Content 24',
        //     },
        //     {
        //         templateType    : 'Notification',
        //         templateName    : 'User Login',
        //         subject         : 'User loggedin Successfully.', 
        //         contents        : 'Content 25',
        //     },
        //     {
        //         templateType    : 'Email',
        //         templateName    : 'User Login',
        //         subject         : 'User loggedin Successfully.', 
        //         contents        : 'Content 26',
        //     },
        //     {
        //         templateType    : 'SMS',
        //         templateName    : 'User Login',
        //         subject         : 'User loggedin Successfully.', 
        //         contents        : 'Content 27',
        //     },
        //     {
        //         templateType    : 'Notification',
        //         templateName    : 'User Login',
        //         subject         : 'User loggedin Successfully.', 
        //         contents        : 'Content 28',
        //     },
        //     {
        //         templateType    : 'Email',
        //         templateName    : 'User Login',
        //         subject         : 'User loggedin Successfully.', 
        //         contents        : 'Content 29',
        //     },
        //     {
        //         templateType    : 'SMS',
        //         templateName    : 'User Login',
        //         subject         : 'User loggedin Successfully.', 
        //         contents        : 'Content 30',
        //     },
        //     {
        //         templateType    : 'Notification',
        //         templateName    : 'User Login',
        //         subject         : 'User loggedin Successfully.', 
        //         contents        : 'Content 31',
        //     },
        //     {
        //         templateType    : 'Email',
        //         templateName    : 'User Login',
        //         subject         : 'User loggedin Successfully.', 
        //         contents        : 'Content 32',
        //     },
        //     {
        //         templateType    : 'SMS',
        //         templateName    : 'User Login',
        //         subject         : 'User loggedin Successfully.', 
        //         contents        : 'Content 33',
        //     },
        //     {
        //         templateType    : 'Notification',
        //         templateName    : 'User Login',
        //         subject         : 'User loggedin Successfully.', 
        //         contents        : 'Content 34',
        //     },
        //     {
        //         templateType    : 'Email',
        //         templateName    : 'User Login',
        //         subject         : 'User loggedin Successfully.', 
        //         contents        : 'Content 35',
        //     },
        //     {
        //         templateType    : 'SMS',
        //         templateName    : 'User Login',
        //         subject         : 'User loggedin Successfully.', 
        //         contents        : 'Content 36',
        //     },
        //     {
        //         templateType    : 'Notification',
        //         templateName    : 'User Login',
        //         subject         : 'User loggedin Successfully.', 
        //         contents        : 'Content 37',
        //     },
        //     {
        //         templateType    : 'Email',
        //         templateName    : 'User Login',
        //         subject         : 'User loggedin Successfully.', 
        //         contents        : 'Content 38',
        //     },
        //     {
        //         templateType    : 'SMS',
        //         templateName    : 'User Login',
        //         subject         : 'User loggedin Successfully.', 
        //         contents        : 'Content 39',
        //     },
        //     {
        //         templateType    : 'Notification',
        //         templateName    : 'User Login',
        //         subject         : 'User loggedin Successfully.', 
        //         contents        : 'Content 40',
        //     },
        //     {
        //         templateType    : 'Email',
        //         templateName    : 'User Login',
        //         subject         : 'User loggedin Successfully.', 
        //         contents        : 'Content 41',
        //     },
        //     {
        //         templateType    : 'SMS',
        //         templateName    : 'User Login',
        //         subject         : 'User loggedin Successfully.', 
        //         contents        : 'Content 42',
        //     },
        //     {
        //         templateType    : 'Notification',
        //         templateName    : 'User Login',
        //         subject         : 'User loggedin Successfully.', 
        //         contents        : 'Content 43',
        //     },
        //     {
        //         templateType    : 'Email',
        //         templateName    : 'User Login',
        //         subject         : 'User loggedin Successfully.', 
        //         contents        : 'Content 44',
        //     },
        //     {
        //         templateType    : 'SMS',
        //         templateName    : 'User Login',
        //         subject         : 'User loggedin Successfully.', 
        //         contents        : 'Content 45',
        //     },
        // ],
        // }

    const reportInput = {
        selectedDate : new Date(),
    }
    // var reportData = axios.get(this.props.dataApiUrl)
        axios({
            method: 'get',
            url: this.props.dataApiUrl,
        }).then((response)=> {
            this.setState({
                tableData : response.data,
            },()=>{
                console.log('tableData',this.state.tableData);
            });
        }).catch(function (error) {
            
        });
    }
    componentWillReceiveProps(nextProps){

    }
    handleChange(event){
        // event.preventDefault();
        // var target = event.target;
        // var name = target.name;

        // var dateVal = event.target.value;
        // var dateUpdate = new Date(dateVal);
        // Session.set('newDate',dateUpdate);
        

        // this.setState({
        //     [name] : event.target.value,
        // });
   }

    currentDate(){
  //       var setDate = Session.get('newDate');

		// if(setDate){
		// 	var today = new Date(setDate);
		// }else{
		// 	var today = new Date();
		// }
		// var dd = today.getDate();
		// var mm = today.getMonth()+1; //January is 0!
		// var yyyy = today.getFullYear();
		// if(dd<10){
		//     dd='0'+dd;
		// }
		// if(mm<10){
		//     mm='0'+mm;
		// }
  //       var today = yyyy+'-'+mm+'-'+dd;

		// return today;

	}
	previousDate(event){
		// event.preventDefault();
		// var selectedDate1 = $(".reportsDayRef").val();
		// var selectedDate = selectedDate1.replace(/-/g, '\/');

		// var newDate1 = new Date(selectedDate);
		// var newDate2 = new Date(newDate1.getTime() - (24*60*60*1000) );
		// Session.set('newDate', newDate2);

	}
	nextDate(event){
		// event.preventDefault();
		// var selectedDate1 = $(".reportsDayRef").val();
		// var selectedDate = selectedDate1.replace(/-/g, '\/');

		// var newDate1 = new Date(selectedDate);
		// var newDate2 = new Date(newDate1.getTime() + (24*60*60*1000) );
		// Session.set('newDate', newDate2);

    }
    dataTableList(){
        // var selectedDate = Session.get('newDate');
        // if(selectedDate){
        //     var newDate  = selectedDate;
        // }else{
        //     var newDate  = new Date();
        // }
        // var startDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), 0, 0, 0); //current day at 0:0:0
        // var endDate = new Date(startDate.getTime() + (24*60*60*1000) ); // next day at 0:0:0

        // var reportData = [];
        // if(this.props.selectedCategory){
        //     if(this.props.selectedSubCategory){
        //         reportData =  Orders.find({'createdAt':{$gte : startDate, $lt : endDate }, 'status' : 'Paid',  "products": { $elemMatch: { category: this.props.selectedCategory, subCategory: this.props.selectedSubCategory}}}, {sort: {'createdAt': -1}}).fetch();
        //     }else{
        //         reportData =  Orders.find({'createdAt':{$gte : startDate, $lt : endDate }, 'status' : 'Paid',  "products": { $elemMatch: { category: this.props.selectedCategory}}}, {sort: {'createdAt': -1}}).fetch();
        //     }
        // }else{
        //     reportData =  Orders.find({'createdAt':{$gte : startDate, $lt : endDate }, 'status' : 'Paid'}, {sort: {'createdAt': -1}}).fetch();
        // }
        // this.setState({
        //     reportData : reportData
        // });
    }
    getData(startRange, limitRange){        
        axios({
            method: 'get',
            url: this.props.dataApiUrl,
        }).then((response)=> {
            this.setState({
                tableData : response.data,
            },()=>{
                console.log('tableData',this.state.tableData);
            });
        }).catch(function (error) {
            
        });
    }
    getSearchText(searchText, startRange, limitRange){
        console.log(searchText, startRange, limitRange);
        this.setState({
            tableData : []
        });
    }
   
    render(){
        return( 
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="sales-report-main-class">
                    <div className="reports-select-date-boxmain">
                        <div className="input-group col-lg-2 col-md-3 col-sm-4 col-xs-6">
                            <span onClick={this.previousDate.bind(this)} className="commonReportArrowPoiner input-group-addon" id="basic-addon1"><i className="fa fa-chevron-circle-left" aria-hidden="true"></i></span>
                            <input onChange={this.handleChange} value={this.currentDate()} name="reportsDayRef" type="date" className="reportsDateRef reportsDayRef form-control" placeholder="" aria-label="Brand" aria-describedby="basic-addon1" ref="reportsDayRef"  />
                            <span onClick={this.nextDate.bind(this)} className="commonReportArrowPoiner input-group-addon" id="basic-addon1"><i className="fa fa-chevron-circle-right" aria-hidden="true"></i></span>
                        </div>
                    </div>

                    <div className="report-list-downloadMain">
                        <IAssureTable 
                            completeDataCount={9}
                            twoLevelHeader={this.state.twoLevelHeader} 
                            editId={this.state.editSubId} 
                            getData={this.getData.bind(this)} 
                            tableHeading={this.state.tableHeading} 
                            tableData={this.state.tableData} 
                            tableObjects={this.state.tableObjects}
                            getSearchText={this.getSearchText.bind(this)}
                            />
                    </div>
                </div>
            </div>
        );        
    }
}