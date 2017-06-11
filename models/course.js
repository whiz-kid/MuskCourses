var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var courseSchema = Schema({
    courseLogo:String,
    courseName:String,
    courseDetails:String,
    period:Number,
    price:Number,
    type:String,
    _offeredBy:String
});

courseSchema.methods.similarCourses = function(course){
    return this.find({type:this.type},course);
}

module.exports = mongoose.model("Course",courseSchema);