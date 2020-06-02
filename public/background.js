chrome.runtime.onInstalled.addListener(() => {
    
    let date = new Date();   /* Creates the date object and sets it to tomorrow at 2:30 */
    //date.setHours(24,0,0,0);
    date.setHours(15,45,0,0);
    console.log(Number(date));
    chrome.storage.sync.set({intervalsAlarmTime: date}, function() { /* Sets the intervalsAlarmTime in chrome storage */
        chrome.alarms.create('dailyIntervalsAlarm', { periodInMinutes: 1 , when: Number(date)}); /* Creates the alarm using date object from chrome storage */    
    });   
  });

  chrome.alarms.onAlarm.addListener((alarm) => {
    console.log(alarm.name); // dailyIntervalsAlarm
    displayReminder();
  });
  
  function displayReminder() {
    let option = confirm("It's time to update your timesheet!\n Do you want to do this now?");
    if (option == true) {
        window.open("https://qualityworkscg.intervalsonline.com/time/","_blank")
    } 
    else {
        console.log("Maybe later then!");
    }
  }  