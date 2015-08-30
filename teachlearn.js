/**********************  MONGODB COLLECTIONS  *********************************/
Teachers = new Mongo.Collection("teachers");
Subjects = new Mongo.Collection("subjects");

/**********************  END MONGODB COLLECTIONS  *****************************/



/*************************  METEOR IS SERVER  *********************************/
if (Meteor.isServer){
    Accounts.config({
    forbidClientAccountCreation : true
  });
  
  Meteor.publish("subjects", function(){
    return Subjects.find({});
  });
  
  Meteor.publish("teachers", function(){
    return Teachers.find({});
  });
  
  Meteor.publish("teacher", function(teacherId){
    //console.log(this.params);
    
    return Teachers.find({_id: teacherId});
  });
  
  Meteor.publish("teacherAndSubjects", function(teacherId){
    return [
      Teachers.find({_id: teacherId}),
      Subjects.find({})
      ];
  });
  
}

/*************************  END METEOR IS SERVER  *****************************/
 
 
/************************** METEOR IS CLIENT **********************************/ 

if (Meteor.isClient) {
  // This code only runs on the client
  
  /***********************  SUBSCRIPTIONS  ************************************/
  
  //moved to templates
  
  /**********************  ACCOUNT CONFIG  **************************************/
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY",
    
  });

  Accounts.config({
    forbidClientAccountCreation : true
  });
  
  /****************************  TEMPLATES JS  ********************************/
  
  /************  TEMPLATE home  **********************************************/
  
  /******* HELPERS ****************/
  Template.home.helpers({

  });

  /******  EVENTS  *****************/
  Template.home.events({
    "submit form": function(event){
      event.preventDefault();
      var user = document.getElementById('username').value;
      var pwd = document.getElementById('password').value;
      Meteor.loginWithPassword(user, pwd, function(error){
        if (error){
          $("#hider").removeClass("hidden")
          console.log(error.reason);
        } else {
          Router.go('main');
        }
      });
    },
    
    "focus input": function(){
      if (! $("#hider").hasClass("hidden")){
        $("#hider").addClass("hidden");
      }
    }
  });
  
  /************  TEMPLATE main  ***********************************************/
  
  /******** HELPERS ****************/
  Template.main.helpers({
    
  });
  
  Template.main.events({
    "click #teacherBtn": function(event){
      event.preventDefault();
      Router.go('teacher');
    }
  });
  
  /************  TEMPLATE navbar  *********************************************/
  
  /******* HELPERS *****************/
  Template.navbar.helpers({
    
  });
  
  /******** EVENTS *****************/
  
  Template.navbar.events({
    "click .logout": function(event){
      event.preventDefault();
      Meteor.logout();
      Router.go('home');
    }
  });

}

  
/*************************  END METEOR IS CLIENT  *****************************/

/*************************  METEOR METHODS  ***********************************/

Meteor.methods({

  addTeacher: function(teacher){
    //Make sure the user is logged in before adding a teacher
    if (!Meteor.userId()){
      throw new Meteor.Error("not authorized");
    } else {
      Teachers.insert({ _id: "COP" });
    }
  }, 
  
  deleteTeacher: function(teacherId){
        if (!Meteor.userId()){
      throw new Meteor.Error("not authorized");
    } else {
      Teachers.remove(teacherId);
    }
  }, 
  
  updateTeacher: function(teacherId, attr, value){
    console.log("update");
    if (!Meteor.userId()){
      throw new Meteor.Error("not authorized");
    } else {
      console.log("id: " + teacherId + " attr: " + attr + "value: " + value);
      var selector={};
      selector[attr] = value;
      Teachers.update(teacherId, {$set: selector});
    }
    
  }, 
  
  updatePeriods: function(teacherId, value){
    if (!Meteor.userId()){
      throw new Meteor.Error("not authorized");
    } else {
      Teachers.update(teacherId, {$set: {periods: value}});
    }
  },
  
  addSubject: function(subject){
    if (!Meteor.userId()){
      throw new Meteor.Error("not authorized");
    } else {
      Subjects.insert({_id: subject});
    }
  },
  
  addObservation: function(teacherId, observation){
    if (!Meteor.userId()){
      throw new Meteor.Error("not authorized");
    } else {
      var obsCount = Teachers.find({_id: teacherId}, {observations: true, _id: false}).fetch()[0].observations.length
      Teachers.update(teacherId, {$push:{observations: observation}, $set:{obsCount: obsCount+1}});
    }
  },
});


/***************************  END METEOR METHODS  *****************************/