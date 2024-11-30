const express = require("express");
const app = express();
app.use(express.json());
const mongoose = require('mongoose');
const cors = require("cors");
app.use(cors());
app.use("/files",express.static("files"));


const mongoUrl = "mongodb+srv://arvapallivagdevi:vagdevi17@cluster0.lm3bvvk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
.connect(mongoUrl, {
  useNewUrlParser: true,
  
})
.then(() => {
  console.log('Connected to database');
})
.catch((e) => console.log(e));



const multer  = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './files');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() ;
    cb(null, uniqueSuffix+file.originalname);
  },
});

require("./pdfDetails");
const PdfSchema=mongoose.model("PdfDetails");
const upload = multer({ storage: storage });

app.post("/upload-files",upload.single("file"),async(req,res)=>{
  console.log(req.file);
  const title=req.body.title;
  const fileName=req.file.filename;
  try {
    await PdfSchema.create({title: title,pdf: fileName });
    res.send({status:"ok"});
  } catch (error) {
    res.json({status:error});
  }
});

app.get("/get-files", async(req,res)=>{
  try {
    PdfSchema.find({}).then((data)=>{
      res.send({status:"ok",data: data});
    });
  } catch (error) {}
});


app.get("/", async(req,res)=>{
  res.send("Success!!!!!!");
});
app.listen(5000,()=>{
    console.log("Server Started");
});