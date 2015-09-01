/**********************  MONGODB COLLECTIONS  *********************************/
Teachers = new Mongo.Collection("teachers");
Subjects = new Mongo.Collection("subjects");

/**********************  END MONGODB COLLECTIONS  *****************************/



/*************************  METEOR IS SERVER  *********************************/


/*************************  END METEOR IS SERVER  *****************************/
 
 
/************************** METEOR IS CLIENT **********************************/ 

if (Meteor.isClient) {
  // This code only runs on the client
  
  /***********************  SUBSCRIPTIONS  ************************************/
  
  //moved to templates
  
  /**********************  ACCOUNT CONFIG  **************************************/

  Accounts.config({
    forbidClientAccountCreation : true,
    //forbidClientAccountCreation: false;
  });
  
  /****************************  TEMPLATES JS  ********************************/
  
  /************  TEMPLATE home  **********************************************/

  
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
      Router.go('main');
    }
  });

}

  
/*************************  END METEOR IS CLIENT  *****************************/

/*************************  METEOR METHODS  ***********************************/



/***************************  END METEOR METHODS  *****************************/