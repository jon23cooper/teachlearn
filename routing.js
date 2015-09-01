// Configure Global



////////////////
// BeforeHooks
////////////////

// (Global) Before hooks for any route
// only allow access to login page for non-logged in users


Router.onBeforeAction(function() {
    if (!Meteor.userId()){
        this.render('login');
        console.log("Not logged in");
    } else {
        console.log("Logged in as:" + Meteor.userId())
        this.next();
    }
});



/************* ROUTES *********************************************************/

//////Creation of accounts route////////
// uncomment to use
//Router.route("/secret", {
//    template: 'createUser',
//})
///////////////////////////////////////
 
 Router.route("/",{
   template: 'main'
 });
 
 Router.route("/admin", {
     template: 'admin',
     waitOn: function(){
         return Meteor.subscribe("subjects");
     }
 });
 
 Router.route("/main",{
   template: 'main'
 })
 
 Router.route("/teacher",{
   template: 'teachers'
 });
 
 Router.route("/addObservation/:id", {
     template: "addObservation",
     waitOn: function(){
        return Meteor.subscribe("teacherAndSubjects", this.params.id); 
     }
 });

/***************************** END ROUTES *************************************/