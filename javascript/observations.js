if (Meteor.isClient){

  Template.observations.onCreated(function () {
		this.subscribe('teachers');
    searchTerm=new RegExp(".");
    this.filter = new ReactiveVar("");
	});

	Template.observations.helpers({
		observations: function(){
			var teachersArray = Teachers.find({},{$sort:{code: 1}}).fetch();
			var observations =[];
			teachersArray.forEach(function(teacher, idx){
				teacher.observations.forEach(function(obs, i){
					observations.push({"teacher": teacher.code, "obs": obs});
				});
			});
      //sort by date most recent first
      observations.sort(function(a,b){

        var dateA = new Date(a.obs.date);
        var dateB = new Date(b.obs.date);

        return dateB-dateA;
      });
      if (Template.instance().filter.get().length != 0){
        observations = observations.filter(
        function(value){
          return Template.instance().filter.get().test(value.teacher);
        });
      }

			return observations;
		},

	  filter: function(){
      return Template.instance().filter.get();
    }

	});

  Template.observations.events({
    "click #searchId": function(event, template){
      template.filter.set($("#idFilter")[0].value.toUpperCase());
    },

    "keyup #idFilter": function(event, template){
      template.filter.set(new RegExp("^" + event.target.value.toUpperCase()));
    }
  });
}
