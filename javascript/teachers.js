if (Meteor.isClient){

/************  TEMPLATE teacher  **************************************/

  /***** SUBSCRIPTIONS  ***********/
  Template.teachers.onCreated(function(){
    this.subscribe('teachers');

  });

  /******* HELPERS  ****************************************************/

/***********************END TEMPLATE teacher  *************************/

/*******************  TEMPLATE addTeacher  *****************************/

  /**** EVENTS **********************/
  Template.addTeacher.events({

    "submit form": function(event){
      event.preventDefault();
      $("#alert").addClass("hidden");
      var id=event.target.addId.value;
      var name=event.target.addName.value;
      var periods=event.target.addPeriods.value;
      console.log(id + ", " + name + ", " + periods);
      var teacher = {code: id,
        name: name,
        periods: periods,
        observations: [],
      };
      if (Teachers.findOne({_id: id})){
        $("#alertText").text("");
        $("#alertText").append("Teacher with staff code: <strong>" + id + "</strong> already exists!");
        $("#alert").removeClass("hidden");
        event.target.addId.select();
        return;
      }
      Meteor.call("addTeacher", teacher, function(err, result){
          if (err){
            $("#alert").text("");
            $("#alert").append("<strong>Oops</strong> something went wrong. Unable to save teacher: " + err);
            $("#alert").removeClass("hidden");

            console.log("Error = " + err);
          } else {
            event.target.addId.value="";
            event.target.addName.value="";
            event.target.addPeriods.value="0";
            console.log("Result = " + result);
          }
        });
    },

    "click #closeAlert": function(event){
      console.log("")
      $("#alert").addClass("hidden");
    },

    "change .hide-completed input": function(event){
      Session.set("hideCompleted", event.target.checked);
    },

    "blur input": function(event){
      if (event.currentTarget.id == "periods"){
        if (isNaN(event.currentTarget.value) || (Number(event.currentTarget.value) < 0)){
          event.currentTarget.parentNode.className = "has-error";
        } else {
          event.currentTarget.parentNode.className = "has-success";
        }
      }
    },

    "input #_idInput": function(event){
      if (event.currentTarget.value.trim() != ""){
        $("#saveIcon").removeClass("disabled");
        console.log("enabling button")
      } else {
        $("#saveIcon").addClass("disabled");
        console.log("disabling button");
      }
    }
  });

  /****************  TEMPLATE listTeachers  *****************************/

  //creates a table and pulls in teachers from MongoDb.
  // responsive table parts are all part of teacher TEMPLATE
    /***** HELPERS ****************** */
    Template.listTeachers.helpers({
      teachers: function(){
        return Teachers.find({}, {sort:{code: true}});
      }
    });


  /***********************  END TEMPLATE listTeachers  ********************/

    /************************  TEMPLATE teacher ****************************/
    //Responsive part of listTeachers table that is repeated for each teacher
    Template.teacher.onCreated(function(){
      initialSetting = true;
    });

    /******HELPERS ************************/
    Template.teacher.helpers({
      obs: function(){
        return this.observations.length;
      }
    });
    /******EVENTS ************************/
    Template.teacher.events({
      //Events listed left to right
    /********* Editing Name Cell  ****************************/

      //////////////////////////////////////////////////////
      //
      // Name cell can be edited when double clicked
      // Clicking outside of name cell input will end editing
      // Pressing enter when in name cell input will end editing
      //
      /////////////////////////////////////////////////////////////

      ////////////////////////////////////////////////////////////////////
      // Double click starts editing
      // An input text box is add to the cell containing the current name
      // The input is given focus and the text selected
      ///////////////////////////////////////////////////////////////////
      "dblclick td#name, dblclick td#code": function(event){
        var currentValue = event.target.textContent;
        var valueEdit = document.createElement("input");
        valueEdit.value = currentValue.trim();
        valueEdit.id = event.target.id + "Edit";
        console.log("Created input: " + valueEdit.id);
        event.target.textContent="";
        var inputElem = event.target.appendChild(valueEdit);
        valueEdit.focus();
        valueEdit.select();
      },

      ////////////////////////////////////////////////////////////////////
      //Stop editing when user clicks outside of the name input
      //Saves new name to MongoDb
      // If the name hasn't changed then it is put back into the cell
      // this is because Meteor notices the name hasn't changed and so
      // doesn't expect to have to replace it (
      ////////////////////////////////////////////////////////////////////
      "blur input#codeEdit, blur input#nameEdit": function(event){
        if (event.target.id == "nameEdit"){
          if (this.name == event.target.value.trim()) {
            event.target.parentElement.textContent = this.name;
          } else {
            Meteor.call("updateTeacher", this._id, "name", event.target.value.trim());
          }
        } else {
            if (this.code == event.target.value.trim()){
              event.target.parentElement.textContent = this.code;
            } else {
              Meteor.call("updateTeacher", this._id, "code", event.target.value.trim());
            }
        }
        event.target.remove();
      },

      ////////////////////////////////////////////////////////////////////
      //Stop editing when user presses enter in the name input
      //Saves new name to MongoDb
      // If the name hasn't changed then it is put back into the cell
      // this is because Meteor notices the name hasn't changed and so
      // doesn't expect to have to replace it (
      ////////////////////////////////////////////////////////////////////
      "keydown input#nameEdit, keydown input#codeEdit": function(event){
        if (event.which == 13){
          if (event.target.id == "nameEdit"){
            if (this.name == event.target.value.trim()) {
              event.target.parentElement.textContent = this.name;
            } else {
              Meteor.call("updateTeacher", this._id, "name", event.target.value.trim());
            }
          } else {
            if (this.code == event.target.value.trim()){
              event.target.parentElement.textContent = this.code;
            } else {
              Meteor.call("updateTeacher", this._id, "code", event.target.value.trim());
            }
          }
          event.target.remove();
        }
      },
    /*************** END Editing Name Cell *********************************************/

    /*************** Editing Periods Cell **********************************************/

    //////////////////////////////////////////////////////
    //
    // Periods cell can be edited when double clicked
    // Clicking outside of periods cell input will end editing
    // Pressing enter when in periods cell input will end editing
    //
    /////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////
    // Double click starts editing
    // An input number box is added to the cell containing the current number of periods
    // The input is given focus and the text selected
    // .focus triggers blur event for number input so global initialSetting= true
    //  used to test for this event
    //
    ///////////////////////////////////////////////////////////////////



    "dblclick td#periods": function(event){
      var currentPeriods = event.target.textContent;
      event.target.textContent = "";
      var numberInput = document.createElement('input');
      var inputElem = event.target.appendChild(numberInput);
      inputElem.type="number";
      inputElem.min=1;
      inputElem.max=60;
      inputElem.value = currentPeriods;
      inputElem.focus();
      inputElem.select();
    },

    ////////////////////////////////////////////////////////////////////
    //Stop editing when user clicks outside of the periods input
    //Saves new period number to MongoDb
    //
    // If the number of periods hasn't changed then it is put back into the cell
    // this is because Meteor notices the number of periods hasn't changed and so
    // doesn't expect to have to replace it (
    ////////////////////////////////////////////////////////////////////


    "blur td#periods": function(event){

    //  if (initialSetting == true){
        if (event.target.value == this.periods){
          event.target.parentElement.textContent = this.periods;
          event.target.remove();
        } else {
          Meteor.call("updateTeacher", this._id, "periods", event.target.value);
          event.target.remove();
        }
     // } else {
     //   console.log("not intial setting")
    //  }
    },

    ////////////////////////////////////////////////////////////////////
    //Stop editing when user presses enter in the periods input
    //Saves new period number to MongoDb
    //
    // If the number of periods hasn't changed then it is put back into the cell
    // this is because Meteor notices the number of periods hasn't changed and so
    // doesn't expect to have to replace it (
    ////////////////////////////////////////////////////////////////////

    "keydown td#periods": function(event){
      if (event.which == 13){
        if (event.target.value == this.periods){
          event.target.parentElement.textContent = this.periods;
          event.target.remove();
        } else {
          Meteor.call("updateTeacher", this._id, "periods", event.target.value);
          event.target.remove();
        }
      }
    },

    /***********************  END EDITING Periods Cell  ****************************/

    /***********************  CLICK Observation Number Cell  ***********************/

    /////////////////////////////////////////
    //
    //  To be done
    //
    /////////////////////////////////////////

    /************************ END CLICK Observation Number Cell  *********************/

    /************************  CLICK Delete Teacher Cell  ****************************/

    //////////////////////////////////////////////
    //
    //  Click on delete button deletes Teacher
    //
    //  Does not delete any observations on that Teacher or warn of such
    //  Needs to warn of such *****  TO BE ADDED ****
    //
    ///////////////////////////////////////////////////////

    "click #delete": function(event){
      Meteor.call("deleteTeacher", this._id);
    },

    /*************************  END CLICK Delete Teacher Cell *************************/

    /************************* CLICK Add Obs Button  **********************************/

    ///////////////////////////////////////////////////////
    //
    // Click on Add Obs Button
    //
    // Go to Add Obs Page for chosen teacher
    //
    ///////////////////////////////////////////////////////

    "click #addObs": function(event){
        event.preventDefault();
        console.log("add obs clicked");
        Router.go("/addObservation/" + this._id);
     },


    });

}
