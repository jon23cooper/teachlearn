
if (Meteor.isClient){

    Template.subjects.onCreated(function(){
        this.subscribe("subjects");
    });
    
    
    Template.subjects.helpers({
        subjects: function(){
            return Subjects.find({}, {sort:{_id: 1}});
        }
    })
    
    Template.subjects.events({
        "submit form": function(event){
           event.preventDefault();;
           Meteor.call("addSubject", event.target.subject.value);
            event.target.subject.value="";
        },
        
        "click #deleteSubject": function(event){
            Meteor.call("deleteSubject", this._id);
        }
        
    });

}
