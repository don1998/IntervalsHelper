/*global chrome*/
import React from 'react';
import './App.css';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';
import TimePicker from 'react-time-picker';
import DoneIcon from '@material-ui/icons/Done';
import IconButton from '@material-ui/core/IconButton';
import AddAlarmIcon from '@material-ui/icons/AddAlarm';
import AlarmOffIcon from '@material-ui/icons/AlarmOff';
import AlarmOnIcon from '@material-ui/icons/AlarmOn';
import ToggleOnOutlinedIcon from '@material-ui/icons/ToggleOnOutlined';
import ToggleOffOutlinedIcon from '@material-ui/icons/ToggleOffOutlined';
import AccessAlarmsIcon from '@material-ui/icons/AccessAlarms';
import TextField from '@material-ui/core/TextField';


class AlarmMenu extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
          classes: this.makeStyles(),
          alarmState:null,
          currentAlarmTime:null,
          setAlarmClicked:false,
          timePicker:null
        };
      }
      
    /**
     * Orchestrates the toggling of the alarm button
     */  
    toggleAlarm(){
      if(this.state.alarmState == true){
        
        chrome.storage.sync.set({alarmState: false}, function() {  //turning alarm off
          this.setState({alarmState:false});
          
          chrome.alarms.clear("dailyIntervalsAlarm", function (){

          });

          chrome.storage.sync.set({dailyIntervalsAlarmTime: null}, function(){
            this.setState({currentAlarmTime:null});
          }.bind(this));

        }.bind(this));

      }
      else if(this.state.alarmState == false){

        chrome.storage.sync.set({alarmState: true}, function() {   //turning alarm on
          this.setState({alarmState:true});
        }.bind(this));

      }      
    }


    /**
     * 
     * @param {String} time - A string in the format HH:MM
     * @returns {Date} - A javascript date object
     */
    convertTimetoDate(time){
      let splitTime = time.split(":");
      let hour = splitTime[0];
      let minutes = splitTime[1];
      let date = new Date();   
      date.setHours(hour,minutes,0,0);
      return date;
    }

    /**
     * Converts javascript dates to momentjs dates for ease of use
     * @param {Date} date - A javascript date object
     */
    convertDateToMoment(date){
      let time = moment(date).format("hh:mm A")
      return time
    }

    /**
     * Parses the current alarm time to a more readable form or displays Alarm not Set
     */
    parseCurrentAlarmTime(){
      if (this.state.currentAlarmTime == null || this.state.currentAlarmTime == undefined){
        return "Alarm not Set"
      }
      else{
        let time = this.convertDateToMoment(this.state.currentAlarmTime);
        return time
      }

    }
    /**
     * Orchestrates the setting of the alarm
     */
    setAlarm(){
      if(this.state.timePicker == undefined || this.state.timePicker == null){
        alert("Please select a valid time");
      }

      let option = window.confirm(`Your alarm has been set for: ${this.state.timePicker} \nIs this fine?`);
      
      if (option==true){

        let time = this.convertTimetoDate(this.state.timePicker);
        
        if(this.state.alarmState == true){
          chrome.alarms.clear("dailyIntervalsAlarm", function (){}); /* Clears chrome alarm event if one already exists */
          chrome.alarms.create('dailyIntervalsAlarm', { periodInMinutes: 1440 , when: Number(time)}); /* Creates chrome alarm event */
          chrome.storage.sync.set({dailyIntervalsAlarmTime: Number(time)},function(){ /* Sets the intervalsAlarmTime in chrome storage */
            this.setState({currentAlarmTime:time});
          }.bind(this));
        }
        else if(this.state.alarmState == false){
          chrome.storage.sync.set({dailyIntervalsAlarmTime: Number(time)},function(){ /* Sets the intervalsAlarmTime in chrome storage */
            this.setState({currentAlarmTime:time});
          }.bind(this));         
        }
        this.displaySetAlarmMenuItem();
      }
      else{
        alert("Ok, please enter your desired time");
      }
    }


    displayTimePicker(){
      this.setState({setAlarmClicked:true});
    }

    displaySetAlarmMenuItem(){
      this.setState({setAlarmClicked:false});
    }


    /**
     * Sets the state with the value from the time picker element as the value changes
     * @param {Object} timePicker 
     */
    onTimePickerChange = timePicker => {
      this.setState({ timePicker: timePicker.target.value });
    }



    componentDidMount(){
      chrome.storage.sync.get('alarmState', function(result) {  //Gets alarm state from chrome storage each time the extension is opened and sets it in the state
        this.setState({alarmState:result.alarmState});
      }.bind(this));
      
      chrome.storage.sync.get('dailyIntervalsAlarmTime', function(result){  //Gets alarm time from chrome storage each time the extension is opened and sets it in the state
        this.setState({currentAlarmTime:result.dailyIntervalsAlarmTime})
      }.bind(this));
    }



    render(){
        return (
            <div>
            <div className={this.state.classes.root}>
                <Paper className={this.state.classes.paper}>
                <MenuList>
                    {this.state.alarmState ? 
                    <MenuItem id="onMenuItem" divider={true} button={false}><AlarmOnIcon style={{ color: "green" }} className="menuItemIcon"/>Alarm is ON</MenuItem> 
                    : <MenuItem id="offMenuItem" divider={true} button={false}><AlarmOffIcon color="secondary" className="menuItemIcon"/>Alarm is OFF</MenuItem>}
                    
                    <MenuItem className="menuItem" divider={true} button={false}> <AccessAlarmsIcon className="menuItemIcon"/> {this.parseCurrentAlarmTime()}</MenuItem>
                    
                    <MenuItem className="menuItem" divider={true} onClick={()=>this.toggleAlarm()}>{this.state.alarmState?<ToggleOnOutlinedIcon className="menuItemIcon"/>:<ToggleOffOutlinedIcon className="menuItemIcon"/>} Toggle Alarm </MenuItem>                   
                    {this.state.setAlarmClicked ? <MenuItem className="menuItem" button={false}>
                        
                        <TextField
                          id="time"
                          type="time"
                          //defaultValue="07:30"
                          className={this.state.classes.textField}
                          onChange={this.onTimePickerChange}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          inputProps={{
                            step: 300, // 5 min
                          }}
                        />
                        <IconButton onClick={()=>this.setAlarm()} children={<DoneIcon/>}/>
                      </MenuItem>
                    : <MenuItem className="menuItem" onClick={()=>this.displayTimePicker()}> <AddAlarmIcon className="menuItemIcon"/> Set Alarm</MenuItem>}
      
                </MenuList>
                </Paper>
            </div>
            </div>
        );
    }


    /**
     * Handles some of the styling for the materialui components
     */
    makeStyles(){
        const useStyles = makeStyles((theme) => ({
          root: {
            display: 'flex',
            fontSize:'0.85rem'
          },
          paper: {
            marginRight: theme.spacing(2),
          },
          textField: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            width: 200,
          },
        }));
        return useStyles
    }
}

export default AlarmMenu;