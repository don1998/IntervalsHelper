chrome.runtime.onInstalled.addListener(() => {
    
    let date = new Date();   /* Creates the date object and sets it to tomorrow at 2:30 */
    //date.setHours(24,0,0,0);
    date.setHours(16,30,0,0);
    let dateNumber = Number(date);
    chrome.alarms.create('dailyIntervalsAlarm', { periodInMinutes: 1440 , when: dateNumber}); /* Creates the alarm using date object from chrome storage */
  
    chrome.storage.sync.set({dailyIntervalsAlarmTime: dateNumber},function(){ /* Sets the intervalsAlarmTime in chrome storage */
      console.log("Alarm time set in chrome storage");
    })

    chrome.storage.sync.set({alarmState: true}, function() { /** Sets the alarmState to true when extension is first installed */
      console.log("Alarm State intialised to true");
    });

  });

  chrome.alarms.onAlarm.addListener((alarm) => {
    console.log(alarm.name); // dailyIntervalsAlarm
    displayReminder();
  });
  
  function displayReminder() {
    let option = confirm("It's time to update your timesheet!\nDo you want to do this now?");
    if (option == true) {
        window.open("https://qualityworkscg.intervalsonline.com/time/","_blank")
    } 
    else {
        console.log("Maybe later then!");
    }
  }  