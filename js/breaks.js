

/* Create short countdown to separate tasks (code adapted 
from https://github.com/jspsych/jsPsych/discussions/1690) */

var break_between_tasks = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<div>Task completed! The next task will begin in ' +
    "<b><span id='clock'>30</span> seconds</b>.</div>",
  choices: 'NO_KEYS',
  trial_duration: 30100, // must be slightly larger than timer below
  on_load: function() {
    var wait_time = 30000;
    var start_time = performance.now();
    var interval = setInterval(function() {
      var time_left = wait_time - (performance.now() - start_time);
      var seconds = Math.floor(time_left / 1000);
      var seconds_str = seconds.toString().padStart(2, '0');
      document.querySelector('#clock').innerHTML = seconds_str;
      if(time_left <= 0) {
        document.querySelector('#clock').innerHTML = '00';
        clearInterval(interval);
      }
    }, 250)
  }
};


/* Two-minute break that will be used between Blocks 1 and 2 of semantic priming 
(code adapted from https://github.com/jspsych/jsPsych/discussions/1690) */

var break_between_blocks = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: "<div>Great job! It's time for a little break. The current " +
    "task will resume in <b><span id='clock'>120</span> seconds</b>.</div>",
  choices: 'NO_KEYS',
  trial_duration: 120100, // must be slightly larger than timer below
  on_load: function() {
    var wait_time = 120000;
    var start_time = performance.now();
    var interval = setInterval(function() {
      var time_left = wait_time - (performance.now() - start_time);
      var seconds = Math.floor(time_left / 1000);
      var seconds_str = seconds.toString().padStart(2, '0');
      document.querySelector('#clock').innerHTML = seconds_str;
      if(time_left <= 0) {
        document.querySelector('#clock').innerHTML = '00';
        clearInterval(interval);
      }
    }, 250)
  }
};

