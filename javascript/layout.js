


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
     return Teachers.find({},{sort:{'code':1}});
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
