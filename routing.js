// Configure Global


////////////////
// BeforeHooks
////////////////

// (Global) Before hooks for any route
// only allow access to login page for non-logged in users


var IR_BeforeHooks ={
  isLoggingIn: function(pause){
    if (!Meteor.loggingIn()){
      this.next();
    } else {
      this.render('login');
    }
  },

  isUser: function(pause){
    if (!(Meteor.user())){
      this.render('login');
    } else {
      this.next();
    }
  },

  mustChangePwd: function(pause){
      if (Meteor.user().profile.forcePwdChange){
        this.render('changePwd');
      } else {
        this.next()
      }
  },

  isAdmin: function(pause){
    if (!Meteor.user().profile.isAdmin){
      this.render('unauthorised');
    } else {
      this.next();
    }
  },
}
Router.onBeforeAction(IR_BeforeHooks.isLoggingIn, {except: ['login']});
Router.onBeforeAction(IR_BeforeHooks.isUser, {except: ['login']});
Router.onBeforeAction(IR_BeforeHooks.mustChangePwd);
Router.onBeforeAction(IR_BeforeHooks.isAdmin, {only: ['addUser']});


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
