const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const PORT =process.env.PORT || 8000;
const mongoose = require("mongoose");
const dotenv =  require('dotenv');
dotenv.config()
// middleware
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

const MONGODB_DATABASE =`mongodb+srv://dilnozaaabd:efSt4a@L5NWW7_r@cluster0.9vrli.mongodb.net/AppNoteDB`
mongoose.connect(MONGODB_DATABASE || "mongodb://localhost:27017/AppNoteDB");

const AppNoteDBSchema = {
  title: String,
  explanation: String,
 
};


const NoteDB = mongoose.model("NoteDB", AppNoteDBSchema);



app.get("/", (req, res) => {
  NoteDB.find({}, (err, note )=>{
    res.render("index", {note: note});
  });
});






app.get("/create", (req, res) => {
  res.render("create");
});



app.post("/create_note", (req, res) => {console.log(req.body)
    const newNote = new NoteDB(req.body)
    newNote.save()

    NoteDB.find({}, (err,note)=>{
      if(!err){
        console.log("success");
        res.redirect("/");
      } else {
        console.log("error is", err);
      }
    });
});

app.get('/delete/:id' , (req, res) => {

  NoteDB.findByIdAndDelete(req.params.id,(err)=>{
    err ? console.error(err) : console.log("deleted successfully")

    res.redirect('/')
  });
});


app.get('/edit/:id', (req,res)=>{
NoteDB.find({_id: req.params.id},(err, result)=>{
  console.log(req.body)
  console.log(result)
  res.render('update',{note: result})
})
})


app.post('/edit/:id', (req, res) => {
  NoteDB.findOneAndUpdate(
    {_id: req.params.id},
    {$set: req.body },
    (err, result) => {
      if (!err){
        console.log(req.body)

        res.redirect('/')
        console.log("success")
      }
      else {
        console.log(err)
      }
})  
  }
)





app.listen(PORT, ()=>{
    console.log('listening on port  8001');
});