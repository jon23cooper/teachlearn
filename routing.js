// Configure Global


////////////////
// BeforeHooks
////////////////

// (Global) Before hooks for any route
// only allow access to login page for non-logged in users

var IR_BeforeHooks ={
  isUser: function(){
    if (!(Meteor.user())){
      this.render('login');
      this.stop();
    } else {
      this.next();
    }
  },

  mustChangePwd: function(){
      if (Meteor.user().profile.forcePwdChange){
        this.render('changePwd');
        pause();
      } else {
        this.next()
      }
  },

  isAdmin: function(){
    if (!Meteor.user().profile.isAdmin){
      this.render('unauthorised');
    } else {
      this.next();
    }
  },
}

Router.onBeforeAction(IR_BeforeHooks.isUser, {except: ['login']});
Router.onBeforeAction(IR_BeforeHooks.mustChangePwd);
Router.onBeforeAction(IR_BeforeHooks.isAdmin, {only: ['addUser']});

/*
Router.onBeforeAction(function() {
    if (Meteor.user()){
      console.log("Is meteor user");
      if (Meteor.user().profile.forcePwdChange){
        console.log("must change password");
        this.render('changePwd');
      } else {
        console.log("doesn't have to change password")

        this.next();
      }
    } else {
      console.log("Is not meteor user");
      this.render('login');
    }

});
*/


/************* ROUTES *********************************************************/

//////Creation of accounts route////////
// Uncomment to use
// also update accounts.config to allow user creation
//Router.route("/secret", {
//  template: 'createUser',
//});
///////////////////////////////////////

 Router.route("/",{
   template: 'main'
 });

 Router.route("/addUser", {
   template: 'addUser'
 });

Router.route("/analysis", {
  template: 'summary'
});

Router.route("/changePwd",{
  template: 'changePwd'
});

 Router.route("/subjects", {
     template: 'subjects',
     waitOn: function(){
         return Meteor.subscribe("subjects");
     }
 });

 Router.route("/main",{
   template: 'main'
 });

Router.route("/observations", {
  template: 'observations',
});

 Router.route("/teachers",{
   template: 'teachers'
 });

 Router.route("/addObservation/:id", {
   name: 'addObservation',
   template: "teacherObservation",
   waitOn: function(){
     return Meteor.subscribe("teacherAndSubjects", this.params.id);
   },
   data: function(){
     return this.params.id;
   }
 });

/***************************** END ROUTES *************************************/
