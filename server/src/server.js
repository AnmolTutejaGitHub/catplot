require('dotenv').config();
const express = require('express');
const app  = express();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const cors = require('cors');
const PORT = process.env.PORT || 8080;
const axios = require('axios');
const Groq = require('groq-sdk');

app.use(express.json());

app.use(cors({
    origin: `${process.env.FRONTEND_URL}`,
    credentials: true
}));

const groq = new Groq({
    apiKey: process.env.GROQ_API,
 });
  

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads',
        resource_type: 'image',
    }
});
const filter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
};

const upload = multer({ storage: storage, limits: { fileSize: 10000000 },fileFilter: filter });

app.post('/fileupload', upload.single('uploadfile'), async (req, res) => {
    try{
    const cloudinaryUrl =  req.file?.path;
    console.log(cloudinaryUrl);
    const { base64, mimeType } = await fetchBase64FromURL(cloudinaryUrl);
    // console.log(base64,mimeType);
    const json = await geminiResponse(base64,mimeType);

    let groqResponse = null;
    if(json.isCat){
        groqResponse = await  GroqResponse(json);
    }
    res.status(200).send({
        imageurl : cloudinaryUrl,
        catDetection : json,
        groqResponse : groqResponse
    });
}catch(err){
    res.status(400).send(err);
}
});

async function geminiResponse(base64,mimeType){
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
    Only respond with JSON. 
    Does this image contain a cat? 
    If yes, what is its emotion (e.g., angry, sleepy, cute, relaxed, suspicious)?
    Format your answer like this:
    {
      "isCat": true,
      "emotion": "sleepy"
    }
    `;
    
      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64,
            mimeType: mimeType,
          },
        },
      ]);
    
    const text = result.response.text();
    //console.log(text);
    const match = text.match(/\{[\s\S]*?\}/);
    const json = JSON.parse(match[0]);
    //console.log(json);
    return json;
}

async function fetchBase64FromURL(imageUrl) {
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
    });
    const base64 = Buffer.from(response.data, 'binary').toString('base64');
    const mimeType = response.headers['content-type'];
    return { base64, mimeType };
}

async function GroqResponse(json){
    const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: `My cat has ${json.emotion} anger likelihood. Is it plotting to kill me? Respond in a funny way.`,
          },
        ],
        model: "llama3-8b-8192",
      });

      return completion.choices[0]?.message?.content || "No response generated.";
}

app.listen(PORT,()=>{
    console.log(`server is listening on port ${PORT}`);
})