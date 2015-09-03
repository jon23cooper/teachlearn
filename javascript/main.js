if (Meteor.isClient){

  Template.main.helpers({

    });

    Template.main.events({
      "click #teacherBtn": function(event){
        event.preventDefault();
        Router.go('teachers');
      }
    });
}