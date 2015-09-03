if (Meteor.isClient) {

	Template.login.events({
		"submit form": function(event){
			event.preventDefault();
			Meteor.loginWithPassword(
				{username: event.target.username.value},
				event.target.password.value,
				function(error){
					if (error){
						$("#hider").removeClass("hidden")
						console.log(error.reason);
					} else {
            console.log('Meteor.user()');
            if (Meteor.user().profile.forcePwdChange){
              Router.go('changePwd');
            } else {
						  Router.go('main');
            }
					}
			});
		},

		"focus input": function(){
			if (! $("#hider").hasClass("hidden")){
				$("#hider").addClass("hidden");
			}
		}
	});

	Template.createUser.events({
		"submit form": function(event){
			event.preventDefault();
			Accounts.createUser({
				username: event.target.username.value,
				password: event.target.password.value
			});
		},

		"focus input": function(){
			if (! $("#hider").hasClass("hidden")){
				$("#hider").addClass("hidden");
			}
		}
	});
}