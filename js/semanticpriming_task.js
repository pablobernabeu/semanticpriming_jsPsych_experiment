

/**********************************************/
/** SEMANTIC PRIMING TASK (tag: 'SemPri')   **/
/**********************************************/

/*
Create components of the semantic priming trials. These components will be 
used in the practice block and in the main blocks. Some components are 
only used in a certain block. For instance, the instructions and the 
feedback are only shown in the practice. Another key difference across the 
different blocks is the `timeline_variables` they use. The practice block 
uses `SemPri_practice_STIMULI`, Block 1 uses `SemPri_Block1_STIMULI`, and 
Block 2 uses `SemPri_Block1_STIMULI`.
*/

var SemPri_instructions = {
  type: jsPsychHtmlKeyboardResponse,
  prompt: '<p>Press the space bar to begin.</p>',
  choices: [' '],
  trial_duration: 70000,
  stimulus: [
    '<div>Each screen will first show a word in upper case very briefly, and afterwards, ' +
    'a word in lower case. Please read both words. When you see the lowercase word, ' +
    'please classify it as abstract or concrete. Abstract concepts are those that we ' +
    'cannot normally experience physically, whereas concrete concepts are those that ' +
    'we can experience more directly.<br>Press <button>F</button> if the lowercase word ' +
    'is primarily abstract (for instance, <i>wait</i>), or press <button>J</button> if ' +
    'it is primarily concrete (for instance, <i>water</i>). Please try to respond as ' +
    'accurately and fast as possible. Next, you can practise with some trials. Correct ' +
    'responses will be indicated with <green-button> &check; </green-button>; ' +
    'incorrect responses with <red-button> &#x2718; </red-button>; and unanswered ' +
    'trials with <red-button> 0 </red-button>.<br></div>'
  ]
};
// Add to general timeline
language_vision_SemPri_TIMELINE.push(SemPri_instructions);


// Fixation cross
var SemPri_fixation = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '+',
  // Choices set below to allow logging any premature response attempts
  choices: ['f', 'j'],
  response_ends_trial: false,
  trial_duration: function() {
    // Set fixations with a varying duration to boost participants' attention
    return jsPsych.randomization.sampleWithoutReplacement([400, 450, 500, 550, 600], 1)[0];
  },
  css_classes: ['stimulus'],
  // Custom data to be included in output
  on_finish: function(data) {
    
  	// Adjust trial number
  	TrialNum += 1
    
	  // Save trial number
    data.trial = TrialNum;
    
    // Track progress in the console
    console.log(
      'Trial ' + TrialNum + ', Minute ' +
      Math.round(jsPsych.data.getLastTrialData().values()[0].time_elapsed / 60000)
    );
    // Log premature response attempts by writing 1
    if(data.response != null) {
      data.premature_response_attempts = 1;
    } else {
      data.premature_response_attempts = 0
    }
  }
};

var prime = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: jsPsych.timelineVariable('prime'),
  // Choices set below to allow logging any premature response attempts
  choices: ['f', 'j'],
  response_ends_trial: false,
  trial_duration: 100,
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

var ISInterval = {
  type: jsPsychHtmlKeyboardResponse,
  trial_duration: jsPsych.timelineVariable('ISInterval'),
  response_ends_trial: false,
  stimulus: ' ',
  // Choices set below to allow logging any premature response attempts
  choices: ['f', 'j'],
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

/* Register any premature response attempts during the first 100 ms after
onset of the target word. These attempts are not considered as responses. */

var target_100ms = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: jsPsych.timelineVariable('target'),
  // Choices set below to allow logging any premature response attempts
  choices: ['f', 'j'],
  response_ends_trial: false,
  trial_duration: 100,
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

/* In the target word section of trials, all the key data are gathered, 
including information from previous sections of the same trial, such 
as the prime word and the interstimulus interval. */

var target = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: jsPsych.timelineVariable('target'),
  choices: ['f', 'j'],
  /* Set 3,000 ms as the maximum trial duration, the same as in the lexical decision task
  of Hutchison et al. (2013; https://doi.org/10.3758/s13428-012-0304-z) and the semantic 
  decision task of Pexman et al. (2017; https://doi.org/10.3758/s13428-016-0720-6). The 
  duration is formed of 100 ms in the 'target_100ms' item and 2,900 ms in the 'target' 
  item. */
  trial_duration: 2900,
  css_classes: ['stimulus'],
  data: { // add info to output
    task: jsPsych.timelineVariable('task'),
    prime: jsPsych.timelineVariable('prime'),
    target: jsPsych.timelineVariable('target'),
    corr_rsp: jsPsych.timelineVariable('corr_rsp'),
    ISInterval: jsPsych.timelineVariable('ISInterval')
  },

  // Custom data to be included in output
  on_finish: function(data) {
    
	  // Save trial number
    data.trial = TrialNum;

    if(data.response != null) {
      // Label correct responses
      if((data.corr_rsp == 'A' && data.response == 'f') ||
        (data.corr_rsp == 'C' && data.response == 'j')) {
        data.accuracy = 'correct'
        // Label incorrect responses
      } else if((data.corr_rsp == 'A' && data.response == 'j') ||
        (data.corr_rsp == 'C' && data.response == 'f')) {
        data.accuracy = 'incorrect'
      }
      // Label unanswered trials
    } else {
      data.accuracy = 'unanswered'
    };

    // Overall accuracy rate so far, ranging between 0 and 1

    var SemPri_total_correct =
      jsPsych.data.get().filter({
        task: jsPsych.timelineVariable('task'),
        accuracy: 'correct'
      }).count();
      
    var SemPri_total_incorrect =
      jsPsych.data.get().filter({
        task: jsPsych.timelineVariable('task'),
        accuracy: 'incorrect'
      }).count();
      
    var SemPri_total_unanswered =
      jsPsych.data.get().filter({
        task: jsPsych.timelineVariable('task'),
        accuracy: 'unanswered'
      }).count();

    data.accuracy_rate =
      SemPri_total_correct /
      (SemPri_total_correct +
        SemPri_total_incorrect +
        SemPri_total_unanswered);

    /* Aggregate any premature response attempts on this trial. 
    If there were any, write 'yes'. */

    if(jsPsych.data.get().last(5).values()[0].premature_response_attempts != 0 ||
      jsPsych.data.get().last(4).values()[0].premature_response_attempts != 0 ||
      jsPsych.data.get().last(3).values()[0].premature_response_attempts != 0 ||
      jsPsych.data.get().last(2).values()[0].premature_response_attempts != 0) {
      data.premature_response_attempts = 'yes';
    } else {
      data.premature_response_attempts = 'no'
    };

    /* By default, when all trials have been presented, the task will end. 
    In addition, a further condition is established below--namely, the 
    task will end if the start time of the last task is reached. */

    if(jsPsych.data.getLastTrialData().values()[0].time_elapsed >=
      time_to_begin_last_task) {
      jsPsych.endCurrentTimeline();
    }
  }
};

// On selected trials, administer instructional manipulation check if accuracy rate < 80%
var SemPri_conditional_instructional_manipulation_check = {
  timeline: [random_number, instructional_manipulation_check],
  on_timeline_start: function(data) {
    console.log(jsPsych.data.getLastTrialData().values()[0].accuracy_rate);
    console.log(jsPsych.data.getLastTrialData().values()[0].trial)
  },
  /* On selected trials, if last trial was incorrect, and average accuracy < .8,
  administer instructional manipulation check. */
  conditional_function: function(data) {
    if([20, 40, 60, 80, 100, 120, 140, 160, 180, 200].includes(jsPsych.data.getLastTrialData().values()[0].trial) &&
      jsPsych.data.getLastTrialData().values()[0].accuracy_rate < .65) {
      return true;
    } else {
      return false
    }
  }
};

var SemPri_feedback = {
  type: jsPsychHtmlKeyboardResponse,
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
var SemPri_intertrial_interval = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: ' ',
  trial_duration: function() {
    // Set interval with a varying duration to boost participants' attention
    return jsPsych.randomization.sampleWithoutReplacement([1400, 1450, 1500, 1550, 1600], 1)[0];
  },
  response_ends_trial: false,
  css_classes: ['stimulus'],

  // Custom data to be included in output
  on_finish: function(data) {
    
	  // Save trial number
    data.trial = TrialNum;
  }
};



/*********************************************

  Semantic priming PRACTICE trials

*********************************************/


/* First, create set of interstimulus intervals from a range between 60 and 
1,200 ms. The range is split into as many integers as the minimum number of 
trials, equally for all participants. Afterwards, all SOAs are randomised 
within participants. */

// Create range of SOAs
ISIntervals_practice_trials =
  makeArr(60, 1200, SemPri_practice_stimuli.length);

// Randomise SOAs (hence the .5 below)
ISIntervals_practice_trials =
  ISIntervals_practice_trials.sort(function() {
    return 0.5 - Math.random()
  });

/* Repeat the random sequence of SOAs to cater for the repetition of the 
practice trials, which happens when the first round is insufficient. */
var ISIntervals_practice_trials =
  new Array(SemPri_practice_stimuli.length).fill(ISIntervals_practice_trials).flat();

// Create a new array to hold the updated stimuli
let updated_SemPri_practice_stimuli = [];

// Run loop to create practice block. Names of some variables are expanded.
for (let i = 0; i < SemPri_practice_stimuli.length; i++) {
  updated_SemPri_practice_stimuli.push({
    task: 'SemPri_practice',
    prime: SemPri_practice_stimuli[i].PW, // name changed to 'prime'
    target: SemPri_practice_stimuli[i].TW, // name changed to 'target'
    corr_rsp: SemPri_practice_stimuli[i].CR, // correct response
    ISInterval: ISIntervals_practice_trials[i]
  });
}

// Optionally, if you want to overwrite the original array:
SemPri_practice_stimuli = updated_SemPri_practice_stimuli;


/* Assemble practice trials timeline using some of the components 
created near the top of this script. */

var SemPri_practice_timeline = {
  timeline: [ SemPri_fixation, prime, ISInterval, target_100ms, 
    target, SemPri_feedback, SemPri_intertrial_interval ],
  timeline_variables: SemPri_practice_stimuli,
  randomize_order: true,
  // restart trial count at the beginning of this timeline
  on_timeline_start: function() {
    TrialNum = 0
  }
};
// Add to general timeline
language_vision_SemPri_TIMELINE.push(SemPri_practice_timeline);


// Overall feedback on all the initial practice trials
var SemPri_practice_debrief = {
  type: jsPsychHtmlKeyboardResponse,
  choices: [' '],
  trial_duration: 40000,

  stimulus: function() {

    var SemPri_practice_trials_total_correct =
      jsPsych.data.get().filter({
        task: 'SemPri_practice',
        accuracy: 'correct'
      }).count();
      
    var SemPri_practice_trials_total_incorrect =
      jsPsych.data.get().filter({
        task: 'SemPri_practice',
        accuracy: 'incorrect'
      }).count();
      
    var SemPri_practice_trials_total_unanswered =
      jsPsych.data.get().filter({
        task: 'SemPri_practice',
        accuracy: 'unanswered'
      }).count();
      
    var SemPri_practice_trials_accuracy_rate =
      SemPri_practice_trials_total_correct /
      (SemPri_practice_trials_total_correct +
        SemPri_practice_trials_total_incorrect +
        SemPri_practice_trials_total_unanswered);

    // Tailor message to the results. If results good, keep message short.
    if(jsPsych.data.get().filter({
        premature_response_attempts: 'yes'
      }).count() < 2 &&
      SemPri_practice_trials_accuracy_rate >= .65) {
      return '<div>Practice completed. In the next part, no feedback will be ' +
      'shown after your responses. Please press the space bar to begin.</div>'

      // If results not so good, present them
    } else {
      var message =
        '<div><b>Results of the practice</b><br>' +
        'Your accuracy rate was ' +
        Math.round(SemPri_practice_trials_accuracy_rate * 100) + '%.</div>'

      // Report any premature response attempts

      if(jsPsych.data.get().filter({
          premature_response_attempts: 'yes'
        }).count() == 1) {
        var message = message +
          '<div>There was a response attempt before the lowercase word had been presented. ' +
          'Please respond only when you have read the lowercase word and decided whether ' +
          'it is abstract or concrete.</div>';

      } else if(jsPsych.data.get().filter({
          premature_response_attempts: 'yes'
        }).count() > 1) {
        var message = message +
          '<div>There were ' +
          jsPsych.data.get().filter({
            premature_response_attempts: 'yes'
          }).count() +
          ' response attempts before the lowercase word had been presented. Please ' +
          'respond only when you have read the lowercase word and decided whether ' +
          'it is abstract or concrete.</div>';
      }

      // Display entire message
      return message +
        '<div>Please press the space bar to repeat the practice.</div>'
    }
  }
};
// Add to general timeline
language_vision_SemPri_TIMELINE.push(SemPri_practice_debrief);

// Prepare repeated instructions
var repeat_SemPri_instructions = {
  type: jsPsychHtmlKeyboardResponse,
  prompt: '<p>Press the space bar to begin.</p>',
  choices: [' '],
  trial_duration: 40000,
  stimulus: [
    '<div>Please consider the instructions again. Each screen will first show a word in ' +
    'upper case very briefly, and afterwards, a word in lower case. Please read both ' +
    'words, and classify the second word only as abstract or concrete. Abstract ' +
    'concepts are those that we cannot normally experience physically, whereas ' +
    'concrete concepts are those that we can experience more directly. Press ' +
    '<button>F</button> if the word is primarily abstract (for instance, <i>wait</i>), ' +
    'or press <button>J</button> if the word is primarily concrete (for instance, ' +
    '<i>water</i>). Please try to respond as accurately and fast as possible.</div>'
  ]
};

/* Present repeated instructions if there were any premature 
response attempts or if accuracy rate < 65%. */
var conditional_repeat_SemPri_instructions = {
  timeline: [repeat_SemPri_instructions],
  conditional_function: function() {
    if(jsPsych.data.get().filter({
        premature_response_attempts: 'yes'
      }).count() > 1 ||
      jsPsych.data.get().last(4).values()[0].accuracy_rate < .65) {
      return true;
    } else {
      return false
    }
  }
};
// Add to general timeline
language_vision_SemPri_TIMELINE.push(conditional_repeat_SemPri_instructions);

/* Repeat practice trials if there were any premature 
response attempts or if accuracy rate < 65%. */
var SemPri_repeated_practice_trials = {
  timeline: [SemPri_practice_timeline],
  data: {
    practice_round: 2
  },
  conditional_function: function() {
    if(jsPsych.data.get().filter({
        premature_response_attempts: 'yes'
      }).count() > 1 ||
      jsPsych.data.get().last(5).values()[0].accuracy_rate < .65) {
      return true;
    } else {
      return false
    }
  }
}
// Add to general timeline
language_vision_SemPri_TIMELINE.push(SemPri_repeated_practice_trials);

// Overall feedback on all the repeated practice trials
var SemPri_repeated_practice_debrief = {
  type: jsPsychHtmlKeyboardResponse,
  choices: [' '],
  trial_duration: 20000,

  stimulus: function() {

    var SemPri_repeated_practice_trials_total_correct =
      jsPsych.data.get().filter({
        task: 'SemPri_practice',
        practice_round: 2,
        accuracy: 'correct'
      }).count();
      
    var SemPri_repeated_practice_trials_total_incorrect =
      jsPsych.data.get().filter({
        task: 'SemPri_practice',
        practice_round: 2,
        accuracy: 'incorrect'
      }).count();
      
    var SemPri_repeated_practice_trials_total_unanswered =
      jsPsych.data.get().filter({
        task: 'SemPri_practice',
        practice_round: 2,
        accuracy: 'unanswered'
      }).count();
      
    var SemPri_repeated_practice_trials_accuracy_rate =
      SemPri_repeated_practice_trials_total_correct /
      (SemPri_repeated_practice_trials_total_correct +
        SemPri_repeated_practice_trials_total_incorrect +
        SemPri_repeated_practice_trials_total_unanswered);

    // Tailor message introduction to the results
    if(jsPsych.data.get().filter({
        task: 'SemPri_practice',
        practice_round: 2,
        premature_response_attempts: 'yes'
      }).count() < 2 &&
      SemPri_repeated_practice_trials_accuracy_rate >= .65) {
      var message =
        '<div>Practice completed.</div>'
    } else {
      var message =
        '<div>The results were not so good. <br>Your accuracy rate was ' +
        Math.round(SemPri_repeated_practice_trials_accuracy_rate * 100) + '%.' +'</div>'
    }

    // Report any premature response attempts

    if(jsPsych.data.get().filter({
        task: 'SemPri_practice',
        practice_round: 2,
        premature_response_attempts: 'yes'
      }).count() == 1) {
      var message = message +
        '<div>There was a response attempt before the lowercase word had been presented. ' +
        'Please respond only when you have read the lowercase word and decided whether ' +
        'it is abstract or concrete.</div>';

    } else if(jsPsych.data.get().filter({
        task: 'SemPri_practice',
        practice_round: 2,
        premature_response_attempts: 'yes'
      }).count() > 1) {
      var message = message +
        '<div>There were ' +
        jsPsych.data.get().filter({
          task: 'SemPri_practice',
          practice_round: 2,
          premature_response_attempts: 'yes'
        }).count() +
        ' response attempts before the lowercase word had been presented. Please ' +
        'respond only when you have read the lowercase word and decided whether ' +
        'it is abstract or concrete.</div>';
    }

    // Finish message
    var message = message +
      '<div>In the next part, no feedback will be shown after your ' +
      'responses. Please press the space bar to begin.</div>'

    // Display message
    return message + '<br>'
  }
};

// Show second-round feedback if practice trials were repeated
var conditional_SemPri_repeated_practice_debrief = {
  timeline: [SemPri_repeated_practice_debrief],
  conditional_function: function() {
    if(jsPsych.data.get().filter({
        task: 'SemPri_practice',
        practice_round: 2
      }).count() >= 1) {
      return true;
    } else {
      return false
    }
  },
  repetitions: 1
};
// Add to general timeline
language_vision_SemPri_TIMELINE.push(conditional_SemPri_repeated_practice_debrief);


/*************************************************************************

 After the practice trials, create stimuli for the main part of the task.

*************************************************************************/

/* Merge the two variables containing the main stimuli, which 
were separated due to the 100 MB limit of files on GitHub. */
var SemPri_main_stimuli = SemPri_main_stimuli_1.concat(SemPri_main_stimuli_2);

// Delete original variables
// var SemPri_main_stimuli_1 = null;
// var SemPri_main_stimuli_2 = null;

// Randomly select a stimulus list for the current participant

var list_number = SemPri_main_stimuli.map(function(el) {
  return el.list;
});

var random_list_number = jsPsych.randomization.sampleWithoutReplacement(list_number)[0];

var SemPri_main_stimuli =
  SemPri_main_stimuli.filter(function(el) {
    return el.list == random_list_number
  });

/* Set number of trials in Block 1 and in Block 2. Important: the present script 
requires that the total number of Main stimuli (i.e., `SemPri_main_stimuli.length`) 
and the total number of Block 1 trials (i.e., `number_of_SemPri_Block1_trials`) 
both be even numbers. */

var number_of_SemPri_Block1_trials = 170;
var number_of_SemPri_Block2_trials =
  SemPri_main_stimuli.length - number_of_SemPri_Block1_trials

/* Set time at which the second block of semantic priming should 
finish and the last task should begin (minutes before '* 60000'). */
var time_to_begin_last_task = 52 * 60000;


/* Split up Abstract and Concrete trials. Next, create Block 1 by 
selecting equal number of Abstract and Concrete trials. Last, do 
the same to create Block 2. */

var abstract_trials =
  SemPri_main_stimuli.filter(function(el) {
    return el.CR == 'A'
  });

var concrete_trials =
  SemPri_main_stimuli.filter(function(el) {
    return el.CR == 'C'
  });

var abstract_trials_Block1 =
  abstract_trials.slice(0, number_of_SemPri_Block1_trials / 2);

var concrete_trials_Block1 =
  concrete_trials.slice(0, number_of_SemPri_Block1_trials / 2);

var SemPri_Block1_stimuli =
  abstract_trials_Block1.concat(concrete_trials_Block1);

var abstract_trials_Block2 =
  abstract_trials.slice((number_of_SemPri_Block1_trials / 2),
    SemPri_main_stimuli.length / 2);

var concrete_trials_Block2 =
  concrete_trials.slice((number_of_SemPri_Block1_trials / 2),
    SemPri_main_stimuli.length / 2);

var SemPri_Block2_stimuli =
  abstract_trials_Block2.concat(concrete_trials_Block2);


/* Next, create set of interstimulus intervals from a range between 60 and 
1,200 ms. First, the range is split into as many integers as the number of
trials in Block 1, equally for all participants. Afterwards, all SOAs are 
randomised within participants. Finally, to accommodate any trials in 
Block 2, which are subject to the pace of the session, the random SOAs are 
repeated enough times to accommodate all trials. This pseudorandomisation 
process ensures that the range of SOAs administered to every participant 
is broad and balanced. */

// Create range of SOAs
ISIntervals_main_trials = makeArr(60, 1200, number_of_SemPri_Block1_trials);

// Randomise SOAs (hence the .5 below)
ISIntervals_main_trials =
  ISIntervals_main_trials.sort(function() {
    return 0.5 - Math.random()
  });

/* Repeat the random sequence of SOAs as many times as the total number of trials. 
This caters for any Block 2 trials. */
var ISIntervals_main_trials =
  new Array(SemPri_main_stimuli.length).fill(ISIntervals_main_trials).flat();


/* Create timeline variables iteratively over trials using for-of loops. 
Two preparatory steps are performed before running the loops. */

// 1. Initialise stimuli arrays 
var SemPri_Block1_STIMULI = [];
var SemPri_Block2_STIMULI = [];

// 2. Randomise trial order in each block

var Block1_trial_order =
  Array.from({length: number_of_SemPri_Block1_trials}, (v, k) => k);

var randomised_Block1_trial_order =
  jsPsych.randomization.sampleWithoutReplacement(Block1_trial_order,
    number_of_SemPri_Block1_trials);

var Block2_trial_order =
  Array.from({length: number_of_SemPri_Block2_trials}, (v, k) => k);

var randomised_Block2_trial_order =
  jsPsych.randomization.sampleWithoutReplacement(Block2_trial_order,
    number_of_SemPri_Block2_trials);

// 3. Run loops to create Block 1 and Block 2 trials. Names of some variables are expanded.

for(const i of randomised_Block1_trial_order) {
  SemPri_Block1_STIMULI.push({
    task: 'SemPri_main',
    prime: SemPri_Block1_stimuli[i].PW, // name changed to 'prime'
    target: SemPri_Block1_stimuli[i].TW, // name changed to 'target'
    corr_rsp: SemPri_Block1_stimuli[i].CR, // name changed to 'corr_rsp', correct response
    ISInterval: ISIntervals_main_trials[i]
  })
}

for(const i of randomised_Block2_trial_order) {
  SemPri_Block2_STIMULI.push({
    task: 'SemPri_main',
    prime: SemPri_Block2_stimuli[i].PW, // name changed to 'prime'
    target: SemPri_Block2_stimuli[i].TW, // name changed to 'target'
    corr_rsp: SemPri_Block2_stimuli[i].CR, // name changed to 'corr_rsp', correct response
    ISInterval: ISIntervals_main_trials[i]
  })
}


/* Trial numbers. jsPsych provides a 'trial_index' value in the output of the task. 
A unique trial_index is assigned to each component of every trial (e.g., fixation,
prime, etc.). The trial_index value is used in jsPsych functions such as `last()`, 
which is used in this script to delimit the data to the last N trial_index values. 
Regular trials must be manually labelled, which is done below.

Important: the names of three variables used below ('prime', 'target', 'corr_rsp') 
were set in the for loops above. */

// Create trial numbers for Block 1

var final_SemPri_Block1_STIMULI = [];

for(const i of Array.from({length:SemPri_Block1_STIMULI.length},(v,k)=>k)) {
  final_SemPri_Block1_STIMULI.push({
    task: 'SemPri_main',
    trial: i + 1, // 1 added to override the default beginning from 0
    prime: SemPri_Block1_STIMULI[i].prime, // prime word
    target: SemPri_Block1_STIMULI[i].target, // target word
    corr_rsp: SemPri_Block1_STIMULI[i].corr_rsp, // correct response
    ISInterval: SemPri_Block1_STIMULI[i].ISInterval
  })
}


// Create trial numbers for Block 2

var final_SemPri_Block2_STIMULI = [];

for(const i of Array.from({length:SemPri_Block2_STIMULI.length},(v,k)=>k)) {
  final_SemPri_Block2_STIMULI.push({
    task: 'SemPri_main',
    trial: (i + 1 + // 1 added to override the default beginning from 0
      SemPri_Block1_STIMULI.length), // add number of Block 1 trials to count continuously across blocks
    prime: SemPri_Block2_STIMULI[i].prime, // prime word
    target: SemPri_Block2_STIMULI[i].target, // target word
    corr_rsp: SemPri_Block2_STIMULI[i].corr_rsp, // correct response
    ISInterval: SemPri_Block2_STIMULI[i].ISInterval
  })
}


/*********************************************

 Semantic priming BLOCK 1

*********************************************/

/* Assemble Block 1 timeline using some of the components 
created near the top of this script. */

var SemPri_Block1_timeline = {
  timeline: [ SemPri_fixation, prime, ISInterval, target_100ms, 
  target, SemPri_conditional_instructional_manipulation_check, 
  SemPri_intertrial_interval ],
  timeline_variables: final_SemPri_Block1_STIMULI,
  randomize_order: true,
  // restart trial count at the beginning of this timeline
  on_timeline_start: function() {
    TrialNum = 0
  }
};
// Add to general timeline
language_vision_SemPri_TIMELINE.push(SemPri_Block1_timeline);


// Add break to general timeline
language_vision_SemPri_TIMELINE.push(break_between_blocks);



/*********************************************

 Semantic priming BLOCK 2

*********************************************/

// Introduce block
var introduce_SemPri_Block2 = {
  type: jsPsychHtmlKeyboardResponse,
  trial_duration: 15000,
  choices: [' '],
  stimulus: function() {
    return '<div>Please remember: press <button>F</button> if the lowercase word is ' +
      'primarily abstract (for instance, <i>wait</i>), or press <button>J</button> ' +
      'if it is primarily concrete (for instance, <i>water</i>). <br>' +
      'Press the space bar to proceed.</div>';
  }
};
// Add to general timeline
language_vision_SemPri_TIMELINE.push(introduce_SemPri_Block2);

/* Assemble Block 2 timeline using some of the components 
created near the top of this script. */

var SemPri_Block2_timeline = {
  timeline: [ SemPri_fixation, prime, ISInterval, target_100ms,
  target, SemPri_conditional_instructional_manipulation_check, 
  SemPri_intertrial_interval ],
  timeline_variables: final_SemPri_Block2_STIMULI,
  randomize_order: true,
  // restart trial count at the beginning of this timeline
  on_timeline_start: function() {
    TrialNum = 0
  }
};
// Add to general timeline
language_vision_SemPri_TIMELINE.push(SemPri_Block2_timeline);

// Transition to next task
language_vision_SemPri_TIMELINE.push(break_between_tasks);
