

// General variables and functions for the backward digit span task

var currentDigitList;  // current digit list
var reversedDigitString;  // reversed digit string
var totalCorrect = 0;  // counter for total correct
var totalTrials = 0;  // counter for total trials
var TrialNum = 0;  // counter for trials
var WorkMem_PracticeTrials = 3;  // number of trials in the practice part
var practice1_passed = 'no'  // first attempt
var practice2_over = 'no'  // second attempt
var WorkMem_MainTrials = 15;  // number of trials in the main part
var response = [];  // for storing partcipants' responses
var WorkMem_correct_ans;  // for storing the correct answer on a given trial
var staircaseChecker = [];  // for assessing whether the span should move up/down/stay
var staircaseIndex = 0;  // index for the current staircase
var digit_list = [1, 2, 3, 4, 5, 6, 7, 8, 9];  // digits to be used

var startingSpan = 3;  // where we begin in terms of span
var currentSpan;  // to reference where participants currently are
var spanHistory = [];  // easy logging of the participant's trajectory
var stimList;  // this is going to house the ordering of the stimuli for each trial
var idx = 0;  // for indexing the current digit to be presented
var exitDigits;  // for exiting the digit loop

const arrSum = arr => arr.reduce((a,b) => a + b, 0)  // simple variable for calculating sum of an array

// function to push button responses to array
var recordClick = function(elm) {
	response.push(Number($(elm).text()))
	document.getElementById('echoed_txt').innerHTML = response;
	// Separate digits with spaces rather than commas
	document.getElementById('echoed_txt').innerHTML = 
	  document.getElementById('echoed_txt').innerHTML.replace(/,/g, ' ')
}

// function to clear the response array
var clearResponse = function() {
	response = [];
	document.getElementById('echoed_txt').innerHTML = response;
}

// function to shuffle an array (Fisher-Yates)
function shuffle(a) {
	var j, x, i;
	for (i = a.length - 1; i > 0; i--) {
		j = Math.floor(Math.random() * (i + 1));
		x = a[i];
		a[i] = a[j];
		a[j] = x;
	}
	return a;
}

// function to get digit list for a trial
function getDigitList(len) {
	var shuff_final = [];
	//shuffle the digit list
	if(len <= digit_list.length) {
		shuff_final = shuffle(digit_list);
	} else {
		// this is overkill (generating too many digits) but it works and we slice it later anyway
		for (var j=0; j<len; j++){
			var interim_digits = shuffle(digit_list);
			shuff_final = [...shuff_final, ...interim_digits];
		}
	}
	var digitList = shuff_final.slice(0,len);  // array to hold the final digits
	return digitList;
}

// function to push the stimuli to an array
function getStimuli(numDigits) {
	var digit;
	var stimList = [];
	currentDigitList = getDigitList(numDigits);
	reversedDigitString = '';
	for (var i = 0; i < currentDigitList.length; i += 1) {
		digit = currentDigitList[i].toString();
			stimList.push('<p style="font-size:60px; font-weight:600;">' + digit + '</p>');
			reversedDigitString = digit + reversedDigitString;
	}
	WorkMem_correct_ans = currentDigitList.slice().reverse();  // this is the reversed array for assessing performance
	return stimList;
}

// function to update the span as appropriate (using a 1:2 staircase procedure)
function updateSpan() {
  
	// If they got the last trial correct, increase the span
	if (arrSum(staircaseChecker) == 1) {
		currentSpan += 1;  // add to the span if last trial was correct
		staircaseChecker = [];  // reset the staircase checker
		staircaseIndex = 0;  // reset the staircase index
		
	// If they got the last two trials incorrect or did not respond, decrease the span
	} else {
		if(currentSpan > startingSpan && staircaseChecker.length == 2) {
			currentSpan -= 1;  // lower the span if last two trials were incorrect
			staircaseChecker = [];  // reset the staircase checker
			staircaseIndex = 0;  // reset the staircase index
		}
	}
};


/* General components of the trials, which will be used 
in the practice trials and in the main trials. */

var response_grid =
  '<div class = numbox>' +
  '<button id = button_1 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>1</div></div></button>' +
  '<button id = button_2 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>2</div></div></button>' +
  '<button id = button_3 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>3</div></div></button>' +
  '<button id = button_4 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>4</div></div></button>' +
  '<button id = button_5 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>5</div></div></button>' +
  '<button id = button_6 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>6</div></div></button>' +
  '<button id = button_7 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>7</div></div></button>' +
  '<button id = button_8 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>8</div></div></button>' +
  '<button id = button_9 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>9</div></div></button>' +
  // '<button class = clear_button id = "ClearButton" onclick = "clearResponse()">Clear</button>' +
  // Padding space and user's input below
  '<p style="font-size:1px"> &nbsp; </p>' +
  '<button id=echoed_txt style="padding-top:5%; padding-right:8%; padding-bottom:5%; padding-left:8%;"><b></b></button>' +
  '</div>'

var WorkMem_practice_instructions = {
  type: jsPsychHtmlButtonResponse,
  stimulus: 
    '<div>In the next task, you will see a sequence of digits and be asked to type ' +
    'them in the <b>reverse order</b>, using your mouse, and then to confirm by ' +
    'pressing the space bar. For example, if you saw the digits <button>1</button> ' +
    '<button>2</button> <button>3</button>, you would need to click on the numbers ' +
    '<button>3</button> <button>2</button> <button>1</button>. Please do the task ' +
    'solely in your head, and try to respond as accurately and fast as possible.' +
    '<br><br></div>',
  choices: ['Click to begin the practice'],
  trial_duration: 40000,
};

// Prepare repeated instructions
var repeat_WorkMem_practice_instructions = {
  type: jsPsychHtmlButtonResponse,
  stimulus: 
    "<div>Some responses were incorrect so let's try again. Like before, you will " +
    'see a sequence of digits and be asked to type them back in <b>reverse ' +
    'order</b>, using your mouse. For example, if you saw the digits ' +
    '<button>1</button> <button>2</button> <button>3</button>, you would need to ' +
    'click on the numbers <button>3</button> <button>2</button> and ' +
    '<button>1</button>. Please do the task solely in your head, and try to ' +
    'respond as accurately and fast as possible.<br><br></div>',
  choices: ['Click to repeat the practice'],
  trial_duration: 40000,
};

var WorkMem_instructions = {
  type: jsPsychHtmlButtonResponse,
  stimulus: 
    '<div>The following trials are similar to the previous ones. However, the ' +
    'number of digits presented will vary across trials, and the responses ' +
    'will need to be faster.<br><br></div>',
  choices: ['Click to proceed'],
  trial_duration: 40000
};

// set-up screen
var setup_fixation = {
	type: jsPsychHtmlKeyboardResponse,
	choices: 'NO_KEYS',
  stimulus: function(){
    return '+'
    },
  trial_duration: function() {
    // Set interval with a varying duration to boost participants' attention
    return jsPsych.randomization.sampleWithoutReplacement([1000, 1050, 1100, 1150, 1200], 1)[0];
  },
  post_trial_gap: 600,
  on_finish: function(){
  	
  	// Adjust span
  	if(TrialNum == 0) {
  		currentSpan = startingSpan;
  	}
  	stimList = getStimuli(currentSpan);  // get the current stimuli for the trial
  	spanHistory[TrialNum] = currentSpan;  // log the current span in an array
    
  	// Adjust trial number
  	TrialNum += 1
  	
  	/* Set trial number to 1 if the practice section 
  	   was finished in the previous trial. */
  	if( jsPsych.data.getLastTrialData().values()[0].task == 'WorkMem_practice' && 
  	jsPsych.data.get().last(5).values()[0].reset_TrialNum == 'yes' ||
  	jsPsych.data.getLastTrialData().values()[0].task == 'WorkMem_main' && 
  	jsPsych.data.get().last(6).values()[0].reset_TrialNum == 'yes') {
  	  TrialNum = 1
  	}
  	
  	idx = 0;  // reset the index prior to the digit presentation
  	exitDigits = 0;  // reset the exit digit variable
  }
};

// visual digit presentation
var digit_WorkMem_vis = {
	type: jsPsychHtmlKeyboardResponse,
	stimulus: function(){ return stimList[idx] },
	choices: 'NO_KEYS',
	trial_duration: 500,
	post_trial_gap: 250,
	on_finish: function(){
		idx += 1;  // update the index
		// check to see if we are at the end of the digit array
		if (idx == stimList.length) {
			exitDigits = 1;
		} else	{
			exitDigits = 0;
		}
	}
};

// conditional loop of digits for the length of stimList
var digit_proc = {
  type: jsPsychHtmlKeyboardResponse,
	timeline: [digit_WorkMem_vis],
	loop_function: function(){
		if(exitDigits == 0){
			return true;
		} else {
			return false;
		}
	}
};

// response screen
var WorkMem_response_screen = {
  type: jsPsychHtmlKeyboardResponse,
  data: { WorkMem_section: 'response' },
  trial_duration: function() {
    if(jsPsych.data.getLastTrialData().values()[0].task == 'WorkMem_practice'){
      return 40000
    } else if(currentSpan == 3) {
      return 6000
    } else if(currentSpan == 4) {
      return 7000
    } else if(currentSpan == 5) {
      return 9000
    } else if(currentSpan == 6) {
      return 10000
    } else if(currentSpan == 7) {
      return 13000
    } else if(currentSpan == 8) {
      return 15000
    } else if(currentSpan == 9) {
      return 17000
    } else if(currentSpan == 10) {
      return 20000
    } else if(currentSpan == 11) {
      return 22000
    } else if(currentSpan > 11) {
      return 30000
    }
  },
  post_trial_gap: function() {
    // Set interval with a varying duration to boost participants' attention
    return jsPsych.randomization.sampleWithoutReplacement([1400, 1450, 1500, 1550, 1600], 1)[0];
  },
  stimulus: response_grid,
  choices: [' '],
  
  // Custom data to be included in output
	on_finish: function(data){
	  
	  // Save trial number
    data.trial = TrialNum;
    
    // Accuracy
	  if(data.response !== null) {
  		if(JSON.stringify(response) === JSON.stringify(WorkMem_correct_ans)) {
  			data.accuracy = 1;
  			console.log('correct');
  			staircaseChecker[staircaseIndex] = 1;
  		} else {
  			data.accuracy = 0;
  			console.log('incorrect');
  			staircaseChecker[staircaseIndex] = 0;
  		}
	  } else { 
	    data.accuracy = 'unanswered';
	    console.log('unanswered');
	    staircaseChecker[staircaseIndex] = 0;
	    };

    // Calculate practice1_accuracy_rate

    WorkMem_total_correct =
      jsPsych.data.get().filter({
        task: 'WorkMem_practice',
        practice_round: 1,
        accuracy: 1
      }).count();
      
    WorkMem_total_incorrect =
      jsPsych.data.get().filter({
        task: 'WorkMem_practice',
        practice_round: 1,
        accuracy: 0
      }).count();
      
    WorkMem_total_unanswered =
      jsPsych.data.get().filter({
        task: 'WorkMem_practice',
        practice_round: 1,
        accuracy: 'unanswered'
      }).count();
      
    practice1_accuracy_rate =
      WorkMem_total_correct /
      (WorkMem_total_correct +
        WorkMem_total_incorrect +
        WorkMem_total_unanswered);
    
    // Transform any NA values to 0
    if(isNaN(practice1_accuracy_rate)) practice1_accuracy_rate = 0;

    data.practice1_accuracy_rate = practice1_accuracy_rate;

    // Calculate practice2_accuracy_rate

    WorkMem_total_correct =
      jsPsych.data.get().filter({
        task: 'WorkMem_practice',
        practice_round: 2,
        accuracy: 1
      }).count();
      
    WorkMem_total_incorrect =
      jsPsych.data.get().filter({
        task: 'WorkMem_practice',
        practice_round: 2,
        accuracy: 0
      }).count();
      
    WorkMem_total_unanswered =
      jsPsych.data.get().filter({
        task: 'WorkMem_practice',
        practice_round: 2,
        accuracy: 'unanswered'
      }).count();
      
    practice2_accuracy_rate =
      WorkMem_total_correct /
      (WorkMem_total_correct +
        WorkMem_total_incorrect +
        WorkMem_total_unanswered);
    
    // Transform any NA values to 0
    if(isNaN(practice2_accuracy_rate)) practice2_accuracy_rate = 0;

    data.practice2_accuracy_rate = practice2_accuracy_rate;

    // Calculate main_accuracy_rate

    WorkMem_total_correct =
      jsPsych.data.get().filter({
        task: 'WorkMem_main',
        accuracy: 1
      }).count();
      
    WorkMem_total_incorrect =
      jsPsych.data.get().filter({
        task: 'WorkMem_main',
        accuracy: 0
      }).count();
      
    WorkMem_total_unanswered =
      jsPsych.data.get().filter({
        task: 'WorkMem_main',
        accuracy: 'unanswered'
      }).count();
      
    main_accuracy_rate =
      WorkMem_total_correct /
      (WorkMem_total_correct +
        WorkMem_total_incorrect +
        WorkMem_total_unanswered);
    
    // Transform any NA values to 0
    if(isNaN(main_accuracy_rate)) main_accuracy_rate = 0;

    data.main_accuracy_rate = main_accuracy_rate;
    
		console.log(staircaseChecker);
		data.span = currentSpan;
		data.answer = response;
		data.correct = WorkMem_correct_ans;
		data.spanHistory = spanHistory;
		data.maxSpan = Math.max(...spanHistory)
		
		// clear the response for the next trial
		response = [];
		
		// update the staircase index
		staircaseIndex += 1;
		
		console.log('trial = ', data.trial)
		console.log('jsPsych.data.get().count() = ', jsPsych.data.get().count())
    
    // If practice1 has been passed, record state and reset trial number for next stage
    
    if( data.trial == WorkMem_PracticeTrials &&
    ( jsPsych.data.get().filter({task:'WorkMem_practice', practice_round:1, accuracy:'unanswered'}).count() +
    jsPsych.data.get().filter({task:'WorkMem_practice', practice_round:1, accuracy:0}).count() ) == 0 ) {
      
      practice1_passed = 'yes';
      data.reset_TrialNum = 'yes';
      
      // If practice1 is failed, reset trial number for next stage
      
      } else if( data.trial == WorkMem_PracticeTrials &&
      ( jsPsych.data.get().filter({task:'WorkMem_practice', practice_round:1, accuracy:'unanswered'}).count() +
      jsPsych.data.get().filter({task:'WorkMem_practice', practice_round:1, accuracy:0}).count() ) > 0 ) {
        
        data.reset_TrialNum = 'yes';
        
        // If practice2 is over, record state and reset trial number for next stage
        
      } else if( jsPsych.data.get().filter({
        task: 'WorkMem_practice',
        WorkMem_section: 'response',
        practice_round: 2 }).count() ==
        WorkMem_PracticeTrials ) {
          
          practice2_over = 'yes';
          data.reset_TrialNum = 'yes';
        }
	}
};

// Trial feedback
var WorkMem_feedback = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function() {
    if(jsPsych.data.getLastTrialData().values()[0].accuracy == 1) {
      return '<p><green-button> &check; </green-button></p>'
    } else if(jsPsych.data.getLastTrialData().values()[0].accuracy == 0) {
      return '<p><red-button> &#x2718; </red-button></p>'
    } else if(jsPsych.data.getLastTrialData().values()[0].accuracy == 'unanswered') {
      return '<p><red-button> 0 </red-button></p>'
    }
  },
  choices: 'NO_KEYS', trial_duration: 800
};

// Call function to update the span
var staircase_assess = {
  type: jsPsychCallFunction,
  func: updateSpan
};



/********************************************/
/** WORKING MEMORY TASK (tag: 'WorkMem')   **/
/********************************************/

/* 
The working memory task is operationalised with a backward digit span task.
This task draws on the code shared by Stephen Van Hedger at 
https://github.com/svanhedger/jspsych/blob/master/scripts/backward-digit-span 

Procedure. On each trial, participants see a string of digits. Then, they 
must click on buttons to report these digits in reverse order. The task 
is adaptive based on a 1:2 staircase procedure. That is, a correct answer 
will increase the digit span by one, whereas two incorrect answers in a 
row will decrease the span by one.
*/


/* Instructional manipulation check abiding by Prolific's policy 
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
  stimulus: function(data) {
    if(jsPsych.data.getLastTrialData().values()[0].random_position == 0) {
      return '<p>Performance has been low. Please enter the ' +
        '<b>first</b> number in the following sequence: ' +
        '<span style="font-weight:bold;">' +
        jsPsych.data.getLastTrialData().values()[0].random_number +
        '</span></p>'
    } else if(jsPsych.data.getLastTrialData().values()[0].random_position == 1) {
      return '<p>Performance has been low. Please enter the ' +
        '<b>second</b> number in the following sequence: ' +
        '<span style="font-weight:bold;">' +
        jsPsych.data.getLastTrialData().values()[0].random_number +
        '</span></p>'
    } else if(jsPsych.data.getLastTrialData().values()[0].random_position == 2) {
      return '<p>Performance has been low. Please enter the ' +
        '<b>third</b> number in the following sequence: ' +
        '<span style="font-weight:bold;">' +
        jsPsych.data.getLastTrialData().values()[0].random_number +
        '</span></p>'
    } else if(jsPsych.data.getLastTrialData().values()[0].random_position == 3) {
      return '<p>Performance has been low. Please enter the ' +
        '<b>fourth</b> number in the following sequence: ' +
        '<span style="font-weight:bold;">' +
        jsPsych.data.getLastTrialData().values()[0].random_number +
        '</span></p>'
    }
  },
  on_finish: function(data) {
    
    // Register current task and trial number
    data.task = jsPsych.data.get().last(3).values()[0].task;
    data.trial = jsPsych.data.get().last(3).values()[0].trial;
    
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

// On selected trials, administer instructional manipulation check if accuracy rate < 80%
var WorkMem_conditional_instructional_manipulation_check = {
  timeline: [random_number, instructional_manipulation_check],
  on_timeline_start: function(data) {
    console.log(jsPsych.data.getLastTrialData().values()[0].main_accuracy_rate);
    console.log(jsPsych.data.getLastTrialData().values()[0].trial)
  },
  /* On selected trials, if last trial was incorrect, and average accuracy < .8,
  administer instructional manipulation check. */
  conditional_function: function(data) {
    if([7, 12].includes(jsPsych.data.getLastTrialData().values()[0].trial) &&
      jsPsych.data.getLastTrialData().values()[0].main_accuracy_rate < .6) {
      return true;
    } else {
      return false
    }
  }
};



// Main trials

var WorkMem_main_trials = {
	timeline: [ setup_fixation, digit_proc, 
    WorkMem_response_screen, staircase_assess, 
    WorkMem_conditional_instructional_manipulation_check ],
	data: {task: 'WorkMem_main'},
	// When total number of trials have been completed, exit
	loop_function: function(){
		if(TrialNum <= WorkMem_MainTrials) {
			return true;
		} else {
			return false;
		}
	}
};

// Complete main trials timeline (incl. instructions)

var WorkMem_main_timeline = {
	timeline: [ WorkMem_instructions, WorkMem_main_trials ],
	data: { task: 'WorkMem_practice' }
};


// PRACTICE TRIALS

var WorkMem_practice_timeline = {
	timeline: [ setup_fixation, 
	digit_proc, WorkMem_response_screen, 
	WorkMem_feedback, staircase_assess ],
	data: { task: 'WorkMem_practice' },
	// When total number of trials have been completed, exit
	loop_function: function(){
		if( jsPsych.data.getLastTrialData().values()[0].practice_round == 1 &&
		jsPsych.data.get().filter({
		  task: 'WorkMem_practice',
		  WorkMem_section: 'response',
		  practice_round: 1 }).count() <=
		  WorkMem_PracticeTrials - 1 ||
		  
      jsPsych.data.getLastTrialData().values()[0].practice_round == 2 &&
		jsPsych.data.get().filter({
		  task: 'WorkMem_practice',
		  WorkMem_section: 'response',
		  practice_round: 2 }).count() <=
		  WorkMem_PracticeTrials - 1 ) {
			return true;
		} else {
			return false;
		}
	}
};

// Round 1 timeline
var WorkMem_practice1_timeline = {
  timeline: [ WorkMem_practice_instructions,
    WorkMem_practice_timeline ],
  data: { practice_round: 1 },
  conditional_function: function() {
    if( jsPsych.data.get().filter({
        task: 'WorkMem_practice',
        WorkMem_section: 'response',
        practice_round: 1 }).count() <= 
        WorkMem_PracticeTrials - 1 ) {
      return true;
      } else {
        return false;
      }
  }
};
  
  
// Prepare repeated practice timeline, which will be presented if accuracy < 100%

// Overall feedback on second round of practice trials
var WorkMem_practice2_debrief = {
  type: jsPsychHtmlKeyboardResponse,
  choices: [' '],
  trial_duration: 40000,

  stimulus: function() {

    // Tailor message to the results
    
    // If results good, keep message short
    if(jsPsych.data.get().last(3).values()[0].practice2_accuracy_rate >= .7) {
        return '<div>The practice was completed successfully. Please press ' +
        'the space bar to read the instructions about the next stage.</div>'
    
    // If results not so good, present them
    } else {
      return '<div><b>Results of the practice</b><br>Your accuracy rate was ' +
      Math.round(jsPsych.data.get().last(3).values()[0].practice2_accuracy_rate * 100) + '%. ' +
      'Please press the space bar to read the instructions about the next ' +
      'stage.</div>'
    }
  }
};

var WorkMem_practice2_timeline = {
  timeline: [ 
    repeat_WorkMem_practice_instructions,
    WorkMem_practice_timeline,
    WorkMem_practice2_debrief ],
  data: { practice_round: 2 },
  conditional_function: function() {
    if( practice1_passed == 'no' && 
    practice2_over == 'no' ) {
      return true;
      } else {
        return false;
      }
  }
};

// Complete timeline of the working memory task
var working_memory_task = {
	timeline: [ WorkMem_practice1_timeline,
	  WorkMem_practice2_timeline,
	  WorkMem_main_timeline ]
};

