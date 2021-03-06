Meteor.startup(function(){
  if (Meteor.users.find({}).count() == 0){
    Accounts.createUser(
      {
        username: 'jon.cooper',
        email: 'jon.cooper@robertsutton.staffs.sch.uk',
        password: '734ch134rn',
        profile:{isAdmin: true, forcePwdChange: true,},
      }
    );
  }
});



if (Meteor.isServer){
	//change if you want to create a new user

	Accounts.config({
		//forbidClientAccountCreation: true,
		forbidClientAccountCreation : false,
	});

	Meteor.publish("subjects", function(){
		return Subjects.find({});
	});

  Meteor.publish("teacher", function(teacherId){
		//console.log(this.params);

		return Teachers.find({_id: teacherId});
	});

	Meteor.publish("teachers", function(){
		return Teachers.find({});
	});


  Meteor.publish("teacher_ids", function(){
    return Teachers.find({}, {fields:{_id: 1, code:1}});
  });


	Meteor.publish("teacherAndSubjects", function(teacherId){
		return [
			Teachers.find({_id: teacherId}),
			Subjects.find({})
			];
	});

  Meteor.publish("observationsAndSubjects", function(){
     return [
       Teachers.find({},{fields:{observations: 1, periods: 1}}),
       Subjects.find({})
     ]
  });

}


Meteor.methods({

	updatePeriods: function(teacherId, value){
		if (!Meteor.userId()){
			throw new Meteor.Error("not authorized");
		} else {
			Teachers.update(teacherId, {$set: {periods: value}});
		}
	},

	addSubject: function(subject){
		if (!Meteor.userId()){
			throw new Meteor.Error("not authorized");
		} else {
			Subjects.insert({_id: subject});
		}
	},

	deleteSubject: function(subject){
		if (!Meteor.userId()){
			throw new Meteor.Error("not authorized");
		} else {
			Subjects.remove({_id: subject});
		}
	},

	addTeacher: function(teacher){
		//Make sure the user is logged in before adding a teacher
		if (!Meteor.userId()){
			throw new Meteor.Error("not authorized");
		} else {
			//make all teacher ids (SIMS Ids) uppercase
			// because they should be!
			teacher.code = teacher.code.toUpperCase();
			Teachers.insert(teacher);
		}
	},

	deleteTeacher: function(teacherId){
		if (!Meteor.userId()){
			throw new Meteor.Error("not authorized");
		} else {
			Teachers.remove(teacherId);
		}
	},

	updateTeacher: function(teacherId, attr, value){
		console.log("update");
		if (!Meteor.userId()){
			throw new Meteor.Error("not authorized");
		} else {
			console.log("id: " + teacherId + " attr: " + attr + "value: " + value);
			var selector={};
			selector[attr] = value;
			Teachers.update(teacherId, {$set: selector});
		}

	},

	addUser: function(username, password){
		if (!Meteor.userId()){
			throw new Meteor.Error("Not authorized");
		} else {
			if (Meteor.user().profile.isAdmin){
				Accounts.createUser({
					username: username,
					password: password,
					profile: {
						isAdmin: false,
						forcePwdChange: true
					}
				});
        if (Meteor.users.find({username: username}).count() == 1){
          console.log("found user" + username);
          return "found user";
        } else {
          throw new Meteor.console.error("Failed to create user");
        }
			} else {
				throw new Meteor.Error("Not authorized");
			}
		}
	},

	addObservation: function(teacherId, observation){
		if (!Meteor.userId()){
			throw new Meteor.Error("not authorized");
		} else {
			Teachers.update(teacherId, {$push:{observations: observation}});
		}
	},
  updateObservation: function(teacherId, observation){
    if (!Meteor.userId()){
      throw new Meteor.Error("not authorized");
    } else {
      console.log("update " + teacherId);
      console.log("Observation " + observation);
      return Teachers.update({'_id':teacherId, 'observations': {$elemMatch: {'_id': observation._id}}},
        {$set: {'observations.$': observation}});
    }
  },
  deleteObservation: function(teacherId, observation){
    if (!Meteor.userId()){
      throw new Meteor.Error("not authorized");
    } else {
      Teachers.update({_id: teacherId}, {$pull:{observations: observation}});
    }
  },

	removeForcePwdChange: function(){
		console.log("Is there a user? " + this.userId);
		if (this.userId){
      console.log("changing need to change pwd for " + Meteor.user().name);
			Meteor.users.update({_id: this.userId},{$set:{'profile.forcePwdChange': false}});
		} else {
			throw new Meteor.error("Not authorized");
		}
	},
});
