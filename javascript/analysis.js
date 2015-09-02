if (Meteor.isClient){

  Template.summary.onCreated(function () {
		this.subscribe('observationsAndSubjects');
	});

  Template.summary.helpers({
    observations: function(){
      var obs = [];
      var results = [];
      Teachers.find({}).fetch().forEach(function(teacher, idx){
        //unpack the observation objects for each teacher
        var obsArray = teacher.observations;
        obsArray.forEach(function(ob, i){
          ob.periods = teacher.periods;
          obs.push(ob);
        });
      });
      //obs now contains an array of observations
      //{date: x, observer: x, subject:x, periods:x, yearGroup:x, grade: x}
      var subjects = Subjects.find({}, {sort:{_id: 1}}).fetch();
      // iterate through the observations
      // to produce an array of summary objects:
      //
      subjects.forEach(function(subject, idx){
        var subjectResult={
          subject:subject._id,
          grades:{'O':0,'G':0,'RI':0,'I':0},
          gradesPct:{'O':0, 'G':0, 'RI':0, 'I':0},
          count:0,
          periodTotal:0,
        };
        var relevant = obs.filter(function(ob){
          return (ob.subject == subject._id );
        });
        var gradeConvert = ['', 'O', 'G', 'RI', 'I'];
        relevant.forEach(function(ob, idx){
          subjectResult.grades[gradeConvert[ob.grade.substring(0,1)]] += Number(ob.periods);
          subjectResult.periodTotal += Number(ob.periods);
          subjectResult.count += 1;
        });
        for (var grd in subjectResult.grades){
          if (subjectResult.periodTotal != 0){
            subjectResult.gradesPct[grd] = (subjectResult.grades[grd]/subjectResult.periodTotal) * 100
          }
        }
        results.push(subjectResult);
      });

     // return results;
      return results;
    },

    subjects: function(){
      return Subjects.find({}, {sort:{_id: 1}}).fetch();
    },

    results: function(){
      var results = [];
      var subjects = Subjects.find({}, {sort:{_id: 1}}).fetch()
      var observations = Teachers.find({}).fetch();
      subjects.forEach(function(subject, idx){
        var result = {subject: subject._id};
        results.push(result);
      });
      return results;
    }
  });

  Template.summary.events({

  });

}