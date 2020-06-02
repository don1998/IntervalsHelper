/*global chrome*/
import React from 'react';
import './App.css';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import AlarmMenu from './AlarmMenu'



class App extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      classes: this.makeStyles(),
      alarmIsClicked: false
    };
  } 

  componentDidMount(){
  }
  
  
  render(){
    return(
      <div>
      <AlarmMenu/>
      {/*<div className={this.state.classes.root}>
        <Paper className={this.state.classes.paper}>
          <MenuList>
            <MenuItem onClick={()=>this.displayAlarmMenu()}>Alarm</MenuItem>
            {this.state.alarmIsClicked?<AlarmMenu/>:console.log("Menu closed")}
            <MenuItem>Time</MenuItem>
            <MenuItem>Login</MenuItem>
          </MenuList>
        </Paper>
    </div>*/}
    </div>
    )
  }

  displayAlarmMenu() {
    this.setState({alarmIsClicked:!this.state.alarmIsClicked});
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

/*function App() {
  const classes = useStyles();
  return (
    <div>
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <MenuList>
            <MenuItem onClick={displayAlarmMenu()}>Alarm</MenuItem>
            <MenuItem>Time</MenuItem>
            <MenuItem>Login</MenuItem>
          </MenuList>
        </Paper>
      </div>
    </div>
  );
}*/
}



export default App;
