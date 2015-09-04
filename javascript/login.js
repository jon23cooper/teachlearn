if (Meteor.isClient) {


	Template.login.events({
		"submit form": function(event){
			event.preventDefault();
			Meteor.loginWithPassword(
				{username: event.target.username.value},
				event.target.password.value,
				function(error){
					if (error){
						$("#hider").removeClass("hidden");
						console.log(error.reason);
					} else {
            console.log(Meteor.user());
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

	var ErrorMessage = new ReactiveVar('');

	Template.usernameExists.helpers({
		errorMessage: function(){
			return 'Error! ' + ErrorMessage.get();
		}
	})

	Template.addUser.helpers({
		showModal: function(){
			return modalDialog.get();
		},

	});

	Template.addUser.events({
		"submit form": function(event){
			event.preventDefault();
			Meteor.call('addUser',
				event.target.username.value,
				event.target.password.value,
				function(err, result){
					if (err){
						if (err.error == 403){
							//username already exists
							ErrorMessage.set(err.message);
							$("#error"+err.error).removeClass('hidden');
						}
						console.log(err);
					} else {
						//show modal
						$(".modal").modal('show');

					}
				}
			);
		},

		"focus input": function(){
			if (! $("#hider").hasClass("hidden")){
				$("#hider").addClass("hidden");
			}
		}
	});


	Template.changePwd.events({
		"submit form": function(event){
			event.preventDefault();
			//new passwords don't match
			$("#hider").addClass("hidden");
			$("#noPwdMatch").addClass("hidden");
			$("#incorrectPwd").addClass("hidden");
			$("#noChange").addClass("hidden");
			if (event.target.new1.value != event.target.new2.value){
				$("#hider").removeClass("hidden");
				$("#noPwdMatch").removeClass("hidden");
				event.target.new1.select();
			} else if (event.target.new1.value == event.target.current.value){
				$("#hider").removeClass("hidden");
				$("#noChange").removeClass("hidden");
			} else {
				Accounts.changePassword(
					event.target.current.value,
					event.target.new1.value
				, function(err){
					if (err){
						$("#hider").removeClass("hidden");
						$("#incorrectPwd").removeClass("hidden");
					} else {
						console.log("Remove need for password change");
						Meteor.call('removeForcePwdChange');
						Router.go('/main');

					}
				});
			}
		}
	});
}
