


/************************** METEOR IS CLIENT **********************************/

if (Meteor.isClient) {
  // This code only runs on the client

  /**********************  ACCOUNT CONFIG  **************************************/

  Accounts.config({
    forbidClientAccountCreation : true,
    //forbidClientAccountCreation: false,
  });

  /****************************  TEMPLATES JS  ********************************/

  /************  TEMPLATE navbar  *********************************************/

  /******* HELPERS *****************/
  Template.navbar.onCreated(function(){
    this.subscribe('teacher_ids');
  });

  Template.navbar.helpers({
    teacherIds: function(){
     return Teachers.find();
    }
  });

  /******** EVENTS *****************/

  Template.navbar.events({
    "click .logout": function(event){
      event.preventDefault();
      Meteor.logout();
      Router.go('main');
    }
  });

}


/*************************  END METEOR IS CLIENT  *****************************/

