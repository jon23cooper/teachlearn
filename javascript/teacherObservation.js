if (Meteor.isClient){

    Template.teacherObservation.onCreated(function(){
        this.subscribe("teacherAndSubjects");

    });

    Template.teacherObservation.onRendered(function(){

        lessonGrades=["1a", "1b", "1c", "2a", "2b", "2c", "3a", "3b", "3c", "4a", "4b", "4c"];
        var fragment = document.createDocumentFragment();
        lessonGrades.forEach(function(grade, index){
           var option = document.createElement('option');
           option.innerHTML=grade;
           option.value=grade;
           fragment.appendChild(option);
        });
        var gradeSelect=this.find("#gradeSelect");
        gradeSelect.appendChild(fragment);

    });

    Template.teacherObservation.helpers({
        teacher: function(){
            return Teachers.find({_id: this.toString()});
        },
        subjects: function(){
            return Subjects.find({}, {sort:{_id:1}});
        },


    });

    Template.teacherObservation.events({

        "submit form": function(event){
            event.preventDefault();
            var teacherId = this["_id"];
            var obsDate = event.target.obsDate.value;
            var observer = event.target.observer.value;
            var subject = event.target.subject.value;
            var yearGroup = event.target.yearGroup.value;
            var grade = event.target.gradeSelect.value;
            var observation = {
                date: obsDate,
                observer: observer,
                subject: subject,
                yearGroup: yearGroup,
                grade: grade,
                periods: this.periods
            }
            Meteor.call("addObservation", teacherId, observation);
        },
        "click #edit": function(event){
          event.preventDefault();
          console.log("button clicked");
          <!-- NEEDS TO BE DONE -->
        },
        "click #delete": function(event){
          console.log("Deleting");
          // this = current observation

          console.log("this:" + this);
          console.log("id:" + Template.parentData(1));
          Meteor.call("deleteObservation", Template.parentData(1), this);
        },
    });


}
