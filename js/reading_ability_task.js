

/**********************************************/
/** READING ABILITY TASK (tag: 'ReadAbil')   **/
/**********************************************/

/***
This reading ability assessment is based on a lexical decision task,
supported by the findings of Yeatman et al. (2021;
https://doi.org/10.1038/s41598-021-85907-x). The stimuli are also
based on the materials of Yeatman et al. (see the script
'reading_ability_stimulus_preparation.R' in the 'data' folder). The 
stimuli created in 'ReadAbil_stimulus_preparation.R' are stored in
'reading_ability_stimuli.js', and that script is loaded into the 
present experiment. 

Begin programming the reading ability task by creating the 
components of the lexical decision trials. These components will 
be used in the practice block and in the main block. Some 
components are only used in a certain block. For instance, the 
instructions and the feedback are only shown in the practice. 
Another key difference across the different blocks is the 
`timeline_variables` they use. The practice block uses 
`ReadAbil_practice_stimuli`, whereas the main block uses 
`ReadAbil_main_STIMULI`.
***/


var ReadAbil_instructions = {
  type: jsPsychHtmlKeyboardResponse,
  prompt: '<p>Press the space bar to begin.</p>',
  choices: [' '],
  trial_duration: 40000,
  stimulus: [
    '<div>Welcome to the first task. Each screen will show a string of letters. Press ' +
    '<button>J</button> if the letters form a real word (for instance, <i>flask</i>), ' +
    'or press <button>F</button> if they do <i>not</i> (for instance, <i>wreet</i>). ' +
    'Please respond when you have read the letters and decided whether they form a ' +
    'real word. Please respond as accurately and fast as possible.</div>'
  ]
};
// Push to general timeline
language_vision_SemPri_TIMELINE.push(ReadAbil_instructions);

// Fixation cross
var ReadAbil_fixation = {
  type: jsPsychHtmlKeyboardResponse,
  timeline_variables: [ReadAbil_all_stimuli],
  stimulus: '+',
  // Choices set below to allow logging any premature response attempts
  choices: ['f', 'j'],
  response_ends_trial: false,
  trial_duration: function() {
    // Set fixations with a varying duration to boost participants' attention
    return jsPsych.randomization.sampleWithoutReplacement([400, 450, 500, 550, 600], 1)[0];
  },
  data: {
    task: jsPsych.timelineVariable('task')
  },
  css_classes: ['stimulus'],
  
  // Custom data to be included in output
  on_finish: function(data) {
    
  	// Adjust trial number
  	TrialNum += 1
    
	  // Save trial number
    data.trial = TrialNum;
  	
    // Log premature response attempts by writing 1
    if(data.response != null) {
      data.premature_response_attempts = 1;
    } else {
      data.premature_response_attempts = 0
    }
  }
};

/* Register any premature response attempts during the first 100 ms after
onset of the stimulus. These attempts are not considered as responses. */

var stim_100ms = {
  type: jsPsychHtmlKeyboardResponse,
  timeline_variables: [ReadAbil_all_stimuli],
  stimulus: jsPsych.timelineVariable('stim'),
  // Choices set below to allow logging any premature response attempts
  choices: ['f', 'j'],
  response_ends_trial: false,
  trial_duration: 100,
  data: {
    task: jsPsych.timelineVariable('task')
  },
  css_classes: ['stimulus'],
  
  // Custom data to be included in output
  on_finish: function(data) {
    
	  // Save trial number
    data.trial = TrialNum;
  	
    // Log premature response attempts by writing 1
    if(data.response != null) {
      data.premature_response_attempts = 1;
    } else {
      data.premature_response_attempts = 0
    }
  }
};

/* In the stim section of trials, all the key data are gathered, 
including information from previous sections of the same trial. */

var stim = {
  type: jsPsychHtmlKeyboardResponse,
  timeline_variables: [ReadAbil_all_stimuli],
  
  stimulus: function() {
    
    // In practice section, present instructions above stimulus word
    if(jsPsych.timelineVariable('task') == 'ReadAbil_practice') {
      return '<div><b>Reminder:</b> press <button>F</button> if the letters below ' +
        'form a real word (for instance, <i>flask</i>) or press <button>J</button> ' +
        'if they do <i><b>not</i></b> (for instance, <i>wreet</i>). Please respond ' +
        'as accurately and fast as possible.</div>' +
        '<div style="text-align:center; font-size: 105%;">' +
        jsPsych.timelineVariable('stim') +
        '</div>'
    } else {
      return jsPsych.timelineVariable('stim')
    }
  },
  choices: ['f', 'j'],
  
  /* Set 3,000 ms as the maximum trial duration, the same as in the lexical decision 
  task of Hutchison et al. (2013; https://doi.org/10.3758/s13428-012-0304-z) and in 
  the semantic decision task of Pexman et al. (2017; https://doi.org/10.3758/s13428-016-0720-6). 
  In the practice trials, prolong the duration. The duration is formed of 100 ms in 
  the 'stim_100ms' item and 2,900 ms in the 'stim' item. */
  trial_duration: function() {
    if(jsPsych.timelineVariable('task') == 'ReadAbil_practice') {
      return 40000
    } else {
      return 2900
    }
  },
  css_classes: ['stimulus'],
  data: { // add info to output
    task: jsPsych.timelineVariable('task'),
    stim: jsPsych.timelineVariable('stim'),
    corr_rsp: jsPsych.timelineVariable('corr_rsp')
  },

  // Custom data to be included in output
  on_finish: function(data) {
    
	  // Save trial number
    data.trial = TrialNum;

    if(data.response != null) {
      // Label correct responses
      if((data.corr_rsp == 'no' && data.response == 'f') ||
        (data.corr_rsp == 'yes' && data.response == 'j')) {
        data.accuracy = 'correct'
        // Label incorrect responses
      } else if((data.corr_rsp == 'no' && data.response == 'j') ||
        (data.corr_rsp == 'yes' && data.response == 'f')) {
        data.accuracy = 'incorrect'
      }
      // Label unanswered trials
    } else {
      data.accuracy = 'unanswered'
    };

    // Overall accuracy rate so far, ranging between 0 and 1

    var ReadAbil_total_correct =
      jsPsych.data.get().filter({
        task: jsPsych.timelineVariable('task'),
        accuracy: 'correct'
      }).count();
      
    var ReadAbil_total_incorrect =
      jsPsych.data.get().filter({
        task: jsPsych.timelineVariable('task'),
        accuracy: 'incorrect'
      }).count();
      
    var ReadAbil_total_unanswered =
      jsPsych.data.get().filter({
        task: jsPsych.timelineVariable('task'),
        accuracy: 'unanswered'
      }).count();

    data.accuracy_rate =
      ReadAbil_total_correct /
      (ReadAbil_total_correct +
        ReadAbil_total_incorrect +
        ReadAbil_total_unanswered);

    /* Aggregate any premature response attempts on this trial. 
    If there were any, write 'yes'. */

    if(jsPsych.data.get().last(3).values()[0].premature_response_attempts != 0 ||
      jsPsych.data.get().last(2).values()[0].premature_response_attempts != 0) {
      data.premature_response_attempts = 'yes';
    } else {
      data.premature_response_attempts = 'no'
    };
  }
};

// On selected trials, administer instructional manipulation check if accuracy rate < 80%
var ReadAbil_conditional_instructional_manipulation_check = {
  timeline: [random_number, instructional_manipulation_check],
  on_timeline_start: function(data) {
    console.log(jsPsych.data.getLastTrialData().values()[0].accuracy_rate);
    console.log(jsPsych.data.getLastTrialData().values()[0].trial)
  },
  /* On selected trials, if last trial was incorrect, and average accuracy < .8,
  administer instructional manipulation check. */
  conditional_function: function(data) {
    if([20, 40, 60, 80].includes(jsPsych.data.getLastTrialData().values()[0].trial) &&
      jsPsych.data.getLastTrialData().values()[0].accuracy_rate < .8) {
      return true;
    } else {
      return false
    }
  },
  // Custom data to be included in output
  on_finish: function(data) {
	  // Save trial number
    data.trial = TrialNum;
  }
};

var ReadAbil_feedback = {
  type: jsPsychHtmlKeyboardResponse,
  timeline_variables: [ReadAbil_all_stimuli],
  data: {
    task: jsPsych.timelineVariable('task')
  },
  stimulus: function() {
    if(jsPsych.data.getLastTrialData().values()[0].accuracy == 'correct') {
      return '<p><green-button> &check; </green-button></p>'
    } else if(jsPsych.data.getLastTrialData().values()[0].accuracy == 'incorrect') {
      return '<p><red-button> &#x2718; </red-button></p>'
    } else if(jsPsych.data.getLastTrialData().values()[0].accuracy == 'unanswered') {
      return '<p><red-button> 0 </red-button></p>'
    }
  },
  choices: 'NO_KEYS',
  trial_duration: 800,
  // Custom data to be included in output
  on_finish: function(data) {
	  // Save trial number
    data.trial = TrialNum;
  }
};

// The intertrial interval is the last part of every trial
var ReadAbil_intertrial_interval = {
  type: jsPsychHtmlKeyboardResponse,
  timeline_variables: [ReadAbil_all_stimuli],
  stimulus: ' ',
  trial_duration: function() {
    // Set interval with a varying duration to boost participants' attention
    return jsPsych.randomization.sampleWithoutReplacement([1400, 1450, 1500, 1550, 1600], 1)[0];
  },
  data: {
    task: jsPsych.timelineVariable('task')
  },
  response_ends_trial: false,
  css_classes: ['stimulus'],
  // Custom data to be included in output
  on_finish: function(data) {
	  // trial number
    data.trial = TrialNum;
  }
};


// PRACTICE TRIALS with comprehension check

/* Neither of these practice trials are present in the main part of the 
reading ability task or in the semantic priming task. These trials are 
also used as comprehension checks, which following Prolific's policy 
(https://researcher-help.prolific.co/hc/en-gb/articles/360009223553).
First, the checks appear at the beginning of the experiment. If two 
attempts are failed, the experiment ends and the participant is asked 
to return to Prolific and click on 'Stop without Completing'. */

var ReadAbil_practice_stimuli = [{
    'stim': 'wreet',
    'corr_rsp': 'no',
    'task': 'ReadAbil_practice',
    'trial': 1
  },
  {
    'stim': 'flask',
    'corr_rsp': 'yes',
    'task': 'ReadAbil_practice',
    'trial': 2
  }
];

// Merge with main stimuli
var ReadAbil_all_stimuli = ReadAbil_practice_stimuli.concat(ReadAbil_stimuli);

/* Assemble practice trials timeline using some of the components 
created at the top of this script. */

var ReadAbil_practice_timeline = {
  timeline: [ ReadAbil_fixation, stim_100ms, stim,
    ReadAbil_feedback, ReadAbil_intertrial_interval ],
  timeline_variables: ReadAbil_practice_stimuli,
  randomize_order: true,
  // restart trial count at the beginning of this timeline
  on_timeline_start: function() {
    TrialNum = 0
  }
};
// Push to general timeline
language_vision_SemPri_TIMELINE.push(ReadAbil_practice_timeline);

// Overall feedback on all the initial practice trials
var ReadAbil_practice_debrief = {
  type: jsPsychHtmlKeyboardResponse,
  choices: [' '],
  trial_duration: 40000,

  stimulus: function() {

    var ReadAbil_practice_trials_total_correct =
      jsPsych.data.get().filter({
        task: 'ReadAbil_practice',
        accuracy: 'correct'
      }).count();
      
    var ReadAbil_practice_trials_total_incorrect =
      jsPsych.data.get().filter({
        task: 'ReadAbil_practice',
        accuracy: 'incorrect'
      }).count();
      
    var ReadAbil_practice_trials_total_unanswered =
      jsPsych.data.get().filter({
        task: 'ReadAbil_practice',
        accuracy: 'unanswered'
      }).count();
      
    var ReadAbil_practice_trials_accuracy_rate =
      ReadAbil_practice_trials_total_correct /
      (ReadAbil_practice_trials_total_correct +
        ReadAbil_practice_trials_total_incorrect +
        ReadAbil_practice_trials_total_unanswered);

    // Tailor message to the results
    
    // If more than one comprehension checks were failed, stop experiment
    if(jsPsych.data.get().filter({
          task: 'ReadAbil_practice',
          accuracy: 'unanswered'
          }).count() +
          jsPsych.data.get().filter({
            task: 'ReadAbil_practice',
            accuracy: 'incorrect'
            }).count() > 1) {
              return '<div>Unfortunately, the experiment cannot continue because two ' +
              'comprehension checks were failed. Please return to Prolific and click ' +
              '<button>Stop without Completing</button>. ' +
              '<a href="https://app.prolific.co/submissions/complete?cc=CBXBRKZI"> ' +
              'Click here to return to <b>Prolific</b></a>. Thank you very much.</div><br>'
    
    // If results good, keep message short
    } else if(jsPsych.data.get().filter({
      premature_response_attempts: 'yes'
      }).count() == 0 &&
      ReadAbil_practice_trials_accuracy_rate >= .8) {
        return '<div>Practice completed. In the next part, neither the instructions ' +
        'nor the feedback will be shown, and trials will be faster. Please press the ' +
        'space bar to begin.</div>'

      // If results valid but not so good, present them
    } else {
      var message =
        '<div><b>Results of the practice</b><br>' +
        'Your accuracy rate was ' +
        Math.round(ReadAbil_practice_trials_accuracy_rate * 100) + '%.</div>'

      // Report any premature response attempts

      if(jsPsych.data.get().filter({
          premature_response_attempts: 'yes'
        }).count() == 1) {
        var message = message +
          '<div>There was a response attempt before the word had been presented. ' +
          'Please respond only when you have read the letters and decided whether ' +
          'they form a real word.</div>';

      } else if(jsPsych.data.get().filter({
          premature_response_attempts: 'yes'
        }).count() > 1) {
        var message = message +
          '<div>There were ' +
          jsPsych.data.get().filter({
            premature_response_attempts: 'yes'
          }).count() +
          ' response attempts before the word had been presented. Please ' +
          'respond only when you have read the letters and decided whether ' +
          'they form a real word.</div>';
      }

      // Display entire message
      return message +
        '<div>Please press the space bar to repeat the practice.</div>'
    }
  },

  on_finish: function(data) {
    
	  // Save trial number
    data.trial = TrialNum;
    
    if(jsPsych.data.get().filter({
      task: 'ReadAbil_practice',
      accuracy: 'unanswered'
      }).count() +
      jsPsych.data.get().filter({
        task: 'ReadAbil_practice',
        accuracy: 'incorrect'
        }).count() > 1) {
          jsPsych.endExperiment('<div>Unfortunately, the experiment cannot continue because ' +
          'two comprehension checks have been failed. Please return to Prolific and click ' +
          '<button>Stop without Completing</button>. ' +
          '<a href="https://app.prolific.co/submissions/complete?cc=CBXBRKZI">Click here to ' +
          'return to <b>Prolific</b></a>. Thank you very much.</div>', data)
    }
  }
};
// Push to general timeline
language_vision_SemPri_TIMELINE.push(ReadAbil_practice_debrief);

// Prepare repeated instructions
var repeat_ReadAbil_instructions = {
  type: jsPsychHtmlKeyboardResponse,
  prompt: '<p>Press the space bar to begin.</p>',
  choices: [' '],
  trial_duration: 40000,
  stimulus: [
    '<div>Please consider the instructions again. Each screen will show a string of ' +
    'letters. Please press <button>J</button> if the letters form a real word (for ' +
    'instance, <i>flask</i>), or press <button>F</button> if they do <i><b>not</i></b> ' +
    '(for instance, <i>wreet</i>). Please try to respond as accurately and fast as ' +
    'possible.</div>'
  ]
};

/* Present repeated instructions if there were any premature 
response attempts or if accuracy rate < 65%. */
var conditional_repeat_ReadAbil_instructions = {
  timeline: [repeat_ReadAbil_instructions],
  conditional_function: function() {
    if(jsPsych.data.get().filter({
        premature_response_attempts: 'yes'
      }).count() > 0 ||
      jsPsych.data.get().last(4).values()[0].accuracy_rate < .8) {
        return true;
        } else {
          return false
          }
  }
};
// Push to general timeline
language_vision_SemPri_TIMELINE.push(conditional_repeat_ReadAbil_instructions);

/* Repeat practice trials if there were any premature 
response attempts or if accuracy rate < 65%. */
var ReadAbil_repeated_practice_trials = {
  timeline: [ReadAbil_practice_timeline],
  data: {
    practice_round: 2
  },
  conditional_function: function() {
    if(jsPsych.data.get().filter({
        premature_response_attempts: 'yes'
      }).count() > 0 ||
      jsPsych.data.get().last(5).values()[0].accuracy_rate < .8) {
      return true;
    } else {
      return false
    }
  }
};
// Push to general timeline
language_vision_SemPri_TIMELINE.push(ReadAbil_repeated_practice_trials);

// Overall feedback on all the repeated practice trials
var ReadAbil_repeated_practice_debrief = {
  type: jsPsychHtmlKeyboardResponse,
  choices: [' '],
  trial_duration: 20000,

  stimulus: function() {

    // Tailor message introduction to the results
    if(jsPsych.data.get().filter({
        task: 'ReadAbil_practice',
        accuracy: 'unanswered'
      }).count() +
      jsPsych.data.get().filter({
        task: 'ReadAbil_practice',
        accuracy: 'incorrect'
      }).count() < 2) {

      // Begin message (div closed below)
      var message = '<div>Practice completed. '

      // Report any premature response attempts

      if(jsPsych.data.get().filter({
          task: 'ReadAbil_practice',
          premature_response_attempts: 'yes'
        }).count() == 1) {
        var message = message +
          '<br>There was a response attempt before the word had been presented. ' +
          'Please respond only when you have read the letters and decided whether ' +
          'they form a real word.<br>';

      } else if(jsPsych.data.get().filter({
          task: 'ReadAbil_practice',
          practice_round: 2,
          premature_response_attempts: 'yes'
        }).count() > 1) {
        var message = message +
          '<br>There were ' +
          jsPsych.data.get().filter({
            task: 'ReadAbil_practice',
            premature_response_attempts: 'yes'
          }).count() +
          ' response attempts before the word had been presented. ' +
          'Please respond only when you have read the letters and ' +
          'decided whether they form a real word.<br>';
      }

      // Finish message and display it
      return message + 'In the next part, neither the instructions nor the ' +
        'feedback will be shown, and trials will be faster. Please press ' +
        'the space bar to begin.</div><br>'

      /* Specify feedback if more than one comprehension checks were failed, 
      in which case the experiment must be terminated. */
    } else {
      return '<div>Unfortunately, the experiment cannot continue because two ' +
        'comprehension checks have been failed. Please return to Prolific ' +
        'and click <button>Stop without Completing</button>. ' +
        '<a href="https://app.prolific.co/submissions/complete?cc=CBXBRKZI"> ' +
        'Click here to return to <b>Prolific</b></a>. Thank you very much.' +
        '</div><br>'
    }
  },

  on_finish: function(data) {
    if(jsPsych.data.get().filter({
        accuracy: 'incorrect'
      }).count() > 1) {
      jsPsych.endExperiment('<div>Unfortunately, the experiment cannot continue because ' +
      'two comprehension checks have been failed. Please return to Prolific and click ' +
      '<button>Stop without Completing</button>. ' +
      '<a href="https://app.prolific.co/submissions/complete?cc=CBXBRKZI">Click here to ' +
      'return to <b>Prolific</b></a>. Thank you very much.</div>', data)
    }
  }
};

// Show second-round feedback if practice trials were repeated
var conditional_ReadAbil_repeated_practice_debrief = {
  timeline: [ReadAbil_repeated_practice_debrief],
  conditional_function: function() {
    if(jsPsych.data.get().filter({
        task: 'ReadAbil_practice',
        practice_round: 2
      }).count() >= 1) {
      return true;
    } else {
      return false
    }
  },
  repetitions: 1
};
// Push to general timeline
language_vision_SemPri_TIMELINE.push(conditional_ReadAbil_repeated_practice_debrief);


/* Assemble main trials timeline using some of the 
components created near the top of this script. */

var ReadAbil_timeline = {
  timeline: [ ReadAbil_fixation, stim_100ms, stim,
    ReadAbil_conditional_instructional_manipulation_check,
    ReadAbil_intertrial_interval ],
  timeline_variables: ReadAbil_stimuli,
  randomize_order: true,
  // restart trial count at the beginning of this timeline
  on_timeline_start: function() {
    TrialNum = 0
  }
};
// Push to general timeline
language_vision_SemPri_TIMELINE.push(ReadAbil_timeline);


// Transition to next task
language_vision_SemPri_TIMELINE.push(break_between_tasks);

