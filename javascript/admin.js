
if (Meteor.isClient){

    Template.admin.onCreated(function(){
        this.subscribe("subjects");
    });
    
    
    Template.admin.helpers({
        subjects: function(){
            return Subjects.find({}, {sort:{_id: 1}});
        }
    })
    
    Template.admin.events({
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
