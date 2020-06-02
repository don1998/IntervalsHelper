/*global chrome*/
import React from 'react';
import './App.css';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';


class AlarmMenu extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
          classes: this.makeStyles(),
          onButton:true,
          offButton:false
        };
      }
      
    toggleAlarm(){
      this.setState({onButton:!this.state.onButton, offButton:!this.state.offButton});
      if(this.state.onButton){ 
        chrome.storage.sync.get(['intervalsAlarmTime'], function(result) {
          alert(Number(result));
          chrome.alarms.create('dailyIntervalsAlarm', { periodInMinutes: 1 , when: Number(result)});
        });
      }
      else if(this.state.offButton){
        chrome.alarms.clear('dailyIntervalsAlarm')
      }
    }

    render(){
        return (
            <div>
            <div className={this.state.classes.root}>
                <Paper className={this.state.classes.paper}>
                <MenuList>
                    {this.state.onButton ? <MenuItem style={{color:'green'}}>Alarm is ON</MenuItem> : <MenuItem style={{color:'red'}}>Alarm is OFF</MenuItem>}
                    <MenuItem onClick={()=>this.toggleAlarm()}> Toggle Alarm </MenuItem>
                    <MenuItem>Set Alarm</MenuItem>
                </MenuList>
                </Paper>
            </div>
            </div>
        );
    }

    makeStyles(){
        const useStyles = makeStyles((theme) => ({
          root: {
            display: 'flex',
          },
          paper: {
            marginRight: theme.spacing(2),
          },
        }));
        return useStyles
    }
}

export default AlarmMenu;