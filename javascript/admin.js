
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
           console.log(document.getElementById("subject").value);
           Meteor.call("addSubject", document.getElementById("subject").value);
       } 
    });

}
