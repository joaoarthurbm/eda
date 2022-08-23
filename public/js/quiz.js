"use strict";


var questions = {}


/**
 * Quiz
 * @param {string} id
 * @param {array} questions
 * 
 */
function Quiz(id) {
    this.id = id;
    this.questions = questions[id];
    this.create();
}


Quiz.prototype.getId = function() {
    return this.id;
}

Quiz.prototype.setId = function(id) {
    this.id = id;
    return this.name;
};


Quiz.prototype.getQuestions = function() {
    return this.questions
};


Quiz.prototype.setQuestions = function(questions) {
    this.questions = questions;
    return this.questions;
};


Quiz.prototype.addQuestion = function(question) {
    return this.questions.push(question);
};


Quiz.prototype.removeQuestion = function(question) {
    console.info("Remove question from the quiz");
    return this.questions;
};


Quiz.prototype.create = function() {

  var root = document.getElementById(this.id);

  var form = document.createElement("form"),
      submit = document.createElement("input"),
      self = this;

  submit.type = "submit";
  submit.value = "responder";

  form.addEventListener("submit", function(e) {
      e.preventDefault();
      self.submit();
  })

  for (var i in this.questions) {
      form.appendChild(this.questions[i].render());

  }

  form.appendChild(submit);
  root.appendChild(form);
};


Quiz.prototype.submit = function() {
    var missing = 0,
        right = 0,
        wrong = 0;

    for (var q of this.getQuestions()) {
        var choices = [];

        // validate
        choices = q.getSelected()   
        

        if (choices.length == 0){
            // skip evaluation
            q.renderMissing();
            missing += 1;
            continue;
        } else if (choices.length < q.rightOptions.length){
            // not enough selected
            q.renderWrong()
        } else {
            q.renderRight();
            for (var choice of choices){             

                // evaluate    
                if (!q.isRight(choice)) {
                    q.renderWrong();
                    wrong += 1;
                    break;
                }    
            }
        }
    }
    right = this.getQuestions().length - wrong - missing  

    // show result
    var result = new Result(missing, right, wrong).render(this.id);
};


/**
 * @param {integer} missing
 * @param {integer} right
 * @param {integer} wrong
 */
function Result(missing, right, wrong) {
    this.html = document.createElement("table");

    var icons = [
      '<i class="fas fa-circle-notch"></i>',
      '<i class="fas fa-check"></i>',
      '<i class="fas fa-times"></i>'
    ]

    var labels = ["Missing", "Right", "Wrong"],
        tr = document.createElement("tr");

    for (var i = 0; i < arguments.length; i += 1) {
        var label = document.createElement("td")
            // score = document.createElement("td");

        label.className = labels[i].toLowerCase() + "-label";
        // score.className = labels[i].toLowerCase() + "-score";

        label.innerHTML = icons[i] + " " + labels[i] +': ' + arguments[i];
        //score.innerHTML = arguments[i];

        tr.appendChild(label);
        // tr.appendChild(score);
    }

    this.html.appendChild(tr);
}


Result.prototype.render = function(id) {
    var root = document.getElementById(id)
    var old = root.getElementsByTagName("table")[0]
    if (old) {
        root.removeChild(old);
    }
    root.appendChild(this.html);
    return this;
};


/**
 * @param {string} question to ask
 * @param {array} options to choose from
 * @param {integer} right option array index
 */
function Question(question, options, rightOptions) {
    this.question = question;
    this.rightOptions = rightOptions;
    this.uid =  this._uid();
    this.options = this._createOptions(options);

    this.RNDR_RIGHT = "#74b559",
    this.RNDR_WRONG = "#D01F3C",
    this.RNDR_MISSING = "#CECBC2";
}


/**
 * @return {string} question id
 */
Question.prototype._uid = function() {
    // https://stackoverflow.com/questions/3242324/javascript-dateobj-gettime-for-a-uid-is-the-length-not-fixed
    return "q" + Math.random().toString(36).substr(2,9);
};


/**
 * @param  {array} options
 * @return {array} of Option objects
 */
Question.prototype._createOptions = function(_options) {
    var options = [];

    for (var i = 0; i < _options.length; i += 1) {
        options[i] = new Option(_options[i], this.uid);
    }

    return options;
}

Question.prototype.getSelected = function() {
    var checkboxes = document.querySelectorAll("input[name='" + this.uid + "']:checked");
    var choices = []
    checkboxes.forEach((checkbox) => {
        choices.push(checkbox.value);
    });
    return choices
};


/**
 * @return {array}
 */
Question.prototype.getOptions = function() {
    return this.options;
};


/**
 * @return {DOM Element}
 */
Question.prototype.render = function() {
    var fieldset = document.createElement("fieldset"),
        legend = document.createElement("legend"),
        self = this;

    fieldset.id = this.uid;

    legend.innerHTML = this.question;

    fieldset.appendChild(legend);

    for (var i = 0; i < this.options.length; i += 1) {
        fieldset.appendChild(this.options[i].render());
    }

    fieldset.classList.add('animated', 'fadeIn')



    return fieldset;
};


Question.prototype.renderMissing = function() {
    document.getElementById(this.uid).style.borderColor = this.RNDR_MISSING;
};


Question.prototype.renderRight = function(first_argument) {
    document.getElementById(this.uid).style.borderColor = this.RNDR_RIGHT;
};


Question.prototype.renderWrong = function() {
    document.getElementById(this.uid).style.borderColor = this.RNDR_WRONG;
};

/**
 * @param  {Option}
 * @return {boolean}
 */
Question.prototype.isRight = function(choice) {

    for (const rightOption of this.rightOptions){
        if (choice == this.options[rightOption-1].value){
            return true;
        }
    }
    return false;   
};


/**
 * @param {string} option value
 * @param {string} Question uid
 */
function Option(value, uid) {
    this.value = value;
    this.uid = uid;
    this.checked = false;
}


/**
 * Renders HTML.
 * @return {DOM Element}
 */
Option.prototype.render = function() {
    var label = document.createElement("label"),
        option = document.createElement("input"),
        self = this;


    option.value = this.value;
    option.type = "radio";
    option.name = this.uid;


    option.addEventListener("change", function(e) {
        self.checked = this.checked;
    });

    label.appendChild(option);
    label.appendChild(document.createTextNode(option.value));

    return label;
};


/**
 * @return {string}
 */
Option.prototype.getValue = function() {
    return this.value;
};

