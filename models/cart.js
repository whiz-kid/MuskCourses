var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cartSchema = Schema({
   courseName:String,
   courseLogo:String,
   email:String,
   startTime:{type:Date,default:Date.now()},
   duration:Number,
   status:String
});

cartSchema.methods.isFinished = function(){
    var currentDate = new Date();
    if(this.startTime.setMonth(CurrentDate.getMonth() + duration) == currentDate){
        return true;
    }
    else{
        console.log(this.startTime.setMonth(CurrentDate.getMonth() + duration))
    }

}

module.exports = mongoose.model("Cart",cartSchema);