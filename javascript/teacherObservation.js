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
            return Teachers.find({});
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
                grade: grade
            }
            Meteor.call("addObservation", teacherId, observation);
        }
    });


}