// Configure Global



////////////////
// BeforeHooks
////////////////

// (Global) Before hooks for any route
// only allow access to login page for non-logged in users


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

    /*
    if (!Meteor.userId()){
        this.render('login');
        console.log("Not logged in");
    } else {
        if (Meteor.user()){
          if (Meteor.user().profile.forcePwdChange){
          this.render('changePwd');
          this.stop();
          } else {
            this.next();
          }
        } else {
          this.next();
        }
    }
    */
});



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