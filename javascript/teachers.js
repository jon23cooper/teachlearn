if (Meteor.isClient){

/************  TEMPLATE teacher_table  **************************************/
  
  /***** SUBSCRIPTIONS  ***********/
  Template.teacher_table.onCreated(function(){
    this.subscribe('teachers');
  });
  
  /***** HELPERS ****************** */
  Template.teacher_table.helpers({
    teachers: function(){
      return Teachers.find({});
    }
  });
  
  /**** EVENTS **********************/
  Template.teacher_table.events({
      
    "submit form": function(event){
      event.preventDefault();
      var id=event.target.addId.value;
      var name=event.target.addName.value;
      var periods=event.target.addPeriods.value;
      var teacher = {_id: id, 
        name: name, 
        periods: periods, 
        observations: [],
        obsCount: 0
      };
      Meteor.call("addTeacher", teacher, function(err, result){
          if (err){
            $("#alert").text("<strong>Oops</strong> something went wrong. Unable to save teacher: " + err); 
            $("#alert").removeClass("hidden");

            console.log("Error = " + err);
          } else {
            console.log("Result = " + result);
          }
        });
    },
    "click #closeAlert": function(event){
      console.log("")
      $("#alert").addClass("hidden");
    },
    
    "click #saveIcon": function (event){
      //cannot save without _id so return

      console.log("Saving teacher");

      var id = document.getElementById("_id").value;
      var name= document.getElementById("name").value;
      var periods = Number(document.getElementById("periods").value);
      var teacher = {_id: id, name: name, periods:periods, observations:[], obsCount:0};

      
      // Insert a teacher into the collection
      Meteor.call("addTeacher", teacher);
      
      //Clear form
      document.getElementById("_id").value = "";
      document.getElementById("name").value="";
      document.getElementById("periods").value="0";
      
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
  
  
  /************************  TEMPLATE teacher ****************************/
  
  /******HELPERS ************************/
  Template.teacher.helpers({

  });
  
  /******EVENTS ************************/
  Template.teacher.events({
    "click #delete": function(){
      Meteor.call("deleteTeacher", this._id);
    }, 
    
    "dblclick td.editable": function(event){
      var input = document.createElement('input');
      input.type = "text";
      input.className = "form-control";
      input.id = event.currentTarget.id;
      event.currentTarget.innerHTML="";
      input.value =  this[event.currentTarget.id];
      event.currentTarget.appendChild(input);
      event.currentTarget.firstChild.select();
    },
    
  "blur input": function(event){
      if (event.currentTarget.id == "periods"){
        if (isNaN(event.currentTarget.value) || (Number(event.currentTarget.value) < 0)){
          event.currentTarget.parentNode.className += " has-error";
        } else {
          event.currentTarget.parentNode.className += " has-success";
          var value = event.currentTarget.value;
          if (value != this.periods){
            event.currentTarget.parentNode.innerHTML="";
            Meteor.call("updatePeriods", this._id, value);
          } else {
            event.currentTarget.parentNode.innerHTML=this.periods;
          }
          
        }
      } else {
      if (event.currentTarget.parentNode.className == "editable"){
        var cell = event.currentTarget.parentNode;
        var input = event.currentTarget;
        console.log("input value " + input.value);
        if (Number(input.value) < 0) {
          input.parentNode.className = "hasError";
          throw new Meteor.Error("out of range");
        }
        var myText = input.value;
        cell.removeChild(input);
        console.log(cell.id);
        if (myText == this[cell.id]){
          //no change
          cell.innerHTML=myText;
        } else {
          cell.innerHTML="";
          Meteor.call("updateTeacher", this._id, cell.id, myText);
        }
      }
    }
  },
    
    //add observation
  "click #addObs": function(event){
      event.preventDefault();
      console.log("add obs clicked");
      Router.go("/addObservation/" + this._id);
    }
  }); 

}