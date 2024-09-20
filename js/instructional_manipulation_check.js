

/* Instructional manipulation check abiding by Prolific's policy as of 2023
   (https://researcher-help.prolific.co/hc/en-gb/articles/360009223553) */

// Random number for the instructional_manipulation_check below
var random_number = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '',
  trial_duration: 20,
  choices: 'NO_KEYS',
  on_finish: function(data) {
    data.random_number = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)
    data.random_position = jsPsych.randomization.sampleWithoutReplacement([0, 1, 2, 3], 1)[0]
  }
};

var instructional_manipulation_check = {
  type: jsPsychHtmlKeyboardResponse,
  trial_duration: 10000,
  choices: 'ALL_KEYS',
  stimulus: function(data) {
    if(jsPsych.data.getLastTrialData().values()[0].random_position == 0) {
      return '<p><b>Attention check!</b> Please enter the ' +
        '<b>first</b> number in the following sequence: ' +
        '<span style="font-weight:bold;">' +
        jsPsych.data.getLastTrialData().values()[0].random_number +
        '</span></p>'
    } else if(jsPsych.data.getLastTrialData().values()[0].random_position == 1) {
      return '<p><b>Attention check!</b> Please enter the ' +
        '<b>second</b> number in the following sequence: ' +
        '<span style="font-weight:bold;">' +
        jsPsych.data.getLastTrialData().values()[0].random_number +
        '</span></p>'
    } else if(jsPsych.data.getLastTrialData().values()[0].random_position == 2) {
      return '<p><b>Attention check!</b> Please enter the ' +
        '<b>third</b> number in the following sequence: ' +
        '<span style="font-weight:bold;">' +
        jsPsych.data.getLastTrialData().values()[0].random_number +
        '</span></p>'
    } else if(jsPsych.data.getLastTrialData().values()[0].random_position == 3) {
      return '<p><b>Attention check!</b> Please enter the ' +
        '<b>fourth</b> number in the following sequence: ' +
        '<span style="font-weight:bold;">' +
        jsPsych.data.getLastTrialData().values()[0].random_number +
        '</span></p>'
    }
  },
  on_finish: function(data) {
    
    // Register current task and trial number
    data.task = jsPsych.data.get().last(3).values()[0].task;
    data.trial = TrialNum;
    
    // Categorise passed check
    if(data.response ==
    jsPsych.data.get().last(2).values()[0].random_number.toString().charAt(jsPsych.data.get().last(2).values()[0].random_position)) {
      data.instructional_manipulation_check = 'passed'
      
      // Categorise failed check
      } else data.instructional_manipulation_check = 'failed';
      
      // Terminate experiment if two instructional manipulation checks have been failed
      if(jsPsych.data.get().filter({
        instructional_manipulation_check: 'failed'
        }).count() == 2) {
          jsPsych.endExperiment('<div>Unfortunately, the experiment cannot continue because ' +
          'two instructional manipulation checks have been failed. Please return to Prolific ' +
          'and click <button>Stop without Completing</button>. ' +
          '<a href="https://app.prolific.co/submissions/complete?cc=CBXBRKZI">Click here to ' +
          'return to <b>Prolific</b></a>. Thank you very much.</div>', data)
    }
  }
};

