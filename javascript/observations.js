if (Meteor.isClient){
	
	
	
	Template.observations.onCreated(function () {
		this.subscribe('teachers');
		
	});
	
	Template.observations.helpers({
		observations: function(sortBy){
			var teachersArray = Teachers.find({},{$sort:{_id: 1}}).fetch();
			var observations =[];
			teachersArray.forEach(function(teacher, idx){
				teacher.observations.forEach(function(obs, i){
					observations.push({"teacher": teacher._id, "obs": obs});
				});
			});
			return observations;
		},
		
		sortByDate: function(){
			observations.sort(function(a, b){
				return new Date(b.date) - new Date(a.date);
			})
		},

	});
}