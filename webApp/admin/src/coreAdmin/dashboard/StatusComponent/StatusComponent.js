import React,{Component} from 'react';
import { render } from 'react-dom';
import './StatusComponent.css';

export default class StatusComponent extends Component{
  constructor(props) {
   super(props);
    this.state = {

    }
  }
    
  render(){
    return(
      <main className="col-lg-3 col-md-3 col-sm-3 col-xs-3">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mainicon NOpadding" >
          <div className="">
            <div className="col-lg-4 ccon1" style={{backgroundColor:this.props.stats.color}} >
              <div className="row"><i className={"fa fa-"+this.props.stats.icon}></i></div>
            </div>
            <div className="col-lg-7 statusBox">
              {
                this.props.stats.multipleValues && this.props.stats.centerData?  
                <React.Fragment>
                  <div> <strong> Centers </strong>: {this.props.stats.centerCount}   </div>
                   {this.props.stats.centerData && this.props.stats.centerData.length > 0 ?
                    this.props.stats.centerData.map((center,i)=>{
                      return(  
                        <div className="dashboardHeading1" key={i}> <strong>{center.typeOfCenter.split(' ')[0]} </strong>  : {center.count}</div>
                      )
                    })
                    : null
                  }
                </React.Fragment>
                : 
                null
              }
              {
                this.props.stats.multipleValues && this.props.stats.sectorData?  
                  <React.Fragment>
                    {
                      this.props.stats.sectorData && this.props.stats.sectorData.length > 0 ?
                      this.props.stats.sectorData.map((sector,i)=>{
                        return(  
                          <div className="dashboardHeading2" key={i}> <strong>{sector.data} </strong>  : {sector.count}</div>
                        )
                      })
                      : null
                    }
                  </React.Fragment>
                  : 
                  null
              }
              {
                !this.props.stats.multipleValues ?  
                  <div>
                    <div className="dashboardHeading"><strong>{this.props.stats.heading1}</strong></div>
                    <div className="per">{this.props.stats.value1}</div>
                    <div className="dashboardHeading"><strong>{this.props.stats.heading2}</strong></div>
                    <div className="per">{this.props.stats.value2}</div>
                  </div>
                : 
                null
              }
            </div>
          </div>
        </div>
      </main>  
    );
  }
}