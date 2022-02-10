//jshint esversion:6

const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");



const app = express();

app.set('view engine','ejs')

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/infoDB", {useNewUrlParser:true});

const userSchema = {
  firstname:String,
  lastname:String,
  email:String,
  password:String,
  address:String,
  country:String,
 state:String
};

const User = mongoose.model("user",userSchema);

app.get("/",function(req,res){

  res.render("home")

  });

app.post("/",function(req,res){
  res.redirect("/user");
});

app.get("/user/:userid", function(req,res){
  const requesteduserid = req.params.userid;
    console.log(requesteduserid);
    User.findOne({_id: requesteduserid}, function(err, founduser){
        res.render("form", {
          user: founduser
        });
      });
});


app.get("/user",function(req,res){
    var newuser = new User();
    res.render("form",{
      user: newuser
    });
});

app.post("/user",function(req,res){
  const user = new User ({
    firstname:req.body.firstName,
    lastname:req.body.lastName,
    email:req.body.emailId,
    password:req.body.passwordId,
       address:req.body.address,
         country:req.body.country

   });
  user.save();
  console.log(user);
  res.redirect("/users");
 });

app.get("/users",function(req,res){
  User.find({},function(err,persons){
  res.render("users",{
personlist:persons
  });

  });
});

app.post("/users",function(req,res){
const searchName = req.body.searchName;
console.log(searchName);
User.find({firstname:searchName},function(err,persons){
res.render("users",{
personlist:persons
});

});
});

app.get("/delete/:userid",function(req,res){
  const requesteduserid = req.params.userid;
    console.log(requesteduserid);
    User.deleteOne({_id:requesteduserid},function(err){
      res.redirect("/users");
    });
});




 app.listen(3000,function(req,res){
  console.log("server started on port 3000");
});
