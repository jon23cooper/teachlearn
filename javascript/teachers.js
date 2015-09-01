if (Meteor.isClient){

/************  TEMPLATE teacher  **************************************/

  /***** SUBSCRIPTIONS  ***********/
  Template.teachers.onCreated(function(){
    this.subscribe('teachers');

  });
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
      var teacher = {_id: id,
        name: name,
        periods: periods,
        observations: [],
        obsCount: 0
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
}