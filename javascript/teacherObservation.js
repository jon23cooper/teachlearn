if (Meteor.isClient){

    Template.teacherObservation.onCreated(function(){
        this.subscribe("teacherAndSubjects");

    });

    Template.teacherObservation.helpers({
        teacher: function(){
            return Teachers.find({_id: this.toString()});
        },
        subjects: function(){
            return Subjects.find({}, {sort:{_id:1}});
        },
        lessonGrades: function(){
          return ["1a", "1b", "1c", "2a", "2b", "2c", "3a", "3b", "3c", "4a", "4b", "4c"];
        }

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
                _id: Random.id(),
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
          this.teacherId = Template.parentData(1);
          Modal.show("editObservationModal", this);
          console.log("Editing: " + Template.parentData(1));
          $("#editSubject option[value='" + this.subject + "']").prop('selected', true);
          $("#editGrade option[value='" + this.grade + "']").prop('selected', true);
        },
        "click #delete": function(event){
          console.log("Deleting");
          // this = current observation

          console.log("this:" + this);

          Meteor.call("deleteObservation", Template.parentData(1), this);
        },
    });

    Template.editObservationModal.helpers({
      subjects: function(){
          return Subjects.find({}, {sort:{_id:1}});
      },
      grades: function(){
        return ["1a", "1b", "1c", "2a", "2b", "2c", "3a", "3b", "3c", "4a", "4b", "4c"];
      }

    });

    Template.editObservationModal.events({
      "submit #editObsForm": function(event){
        event.preventDefault();
        console.log("Observation id = " + this._id);
        console.log("TeacherId= " + this.teacherId);
        var observation = {
          _id: this._id,
          date: event.target.editObsDate.value,
          observer: event.target.editObserver.value,
          subject: event.target.editSubject.value,
          yearGroup: event.target.editYearGroup.value,
          grade: event.target.editGrade.value,
          periods: this.periods
        };

        Meteor.call("updateObservation", this.teacherId, observation, function(error, result) {
          console.log("updating number");
          console.log("error" + error);
          console.log("result " + result);
          if (error) {
            Modal.show('updateErrorModal');
          } else {
            console.log("updated " + result + "records");
            Modal.hide();
          }
          });
        }

    });


}
