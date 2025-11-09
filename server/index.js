const express=require("express")
const cors=require("cors")
const fs=require("fs")
require("dotenv").config()
const pdfParse = require("pdf-parse");
const {callAI}=require("./utils/aiCon");
const multer=require("multer")
const PORT=process.env.port||8080
const app=express()
app.use(cors({origin:"*"}))
const upload = multer({ dest: "uploads/" });
app.use(express.json())
app.get("/",(req,res)=>{
    res.send("AntiPlag API is running....")
})
app.post("/check",upload.single("file"),async(req,res)=>{
    try{const {prompt}=req.body
    // if(!prompt)return res.status(404).json({success:false, reason:"a prompt is required"})
      const pdfBuffer = fs.readFileSync(req.file.path);
      const pdfData = await pdfParse(pdfBuffer)
      const pdfText = pdfData.text;
    const data=await callAI(pdfText)
    return res.status(200).json({success:true,response:data})}
    catch(err){
        console.log(err)
        return res.status(400).json({error:err.stack})
    }
})
app.get("/check",async(req,res)=>{
    const prompt=req.query.prompt
    if(!prompt)return res.status(404).json({success:false, reason:"a prompt is required"})
    const data=await callAI(prompt)
    return res.status(200).json({success:true,response:data})
})
 app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
 })