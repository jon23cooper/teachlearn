

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
    return Teachers.find({}, {fields:{_id: 1}});
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

	addTeacher: function(teacher){
		//Make sure the user is logged in before adding a teacher
		if (!Meteor.userId()){
			throw new Meteor.Error("not authorized");
		} else {
			//make all teacher ids (SIMS Ids) uppercase
			// because they should be!
			teacher._id = teacher._id.toUpperCase();
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

	addObservation: function(teacherId, observation){
		if (!Meteor.userId()){
			throw new Meteor.Error("not authorized");
		} else {
			var obsCount = Teachers.find({_id: teacherId}, {observations: true, _id: false}).fetch()[0].observations.length
			Teachers.update(teacherId, {$push:{observations: observation}, $set:{obsCount: obsCount+1}});
		}
	},
});
