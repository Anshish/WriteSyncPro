const dotenv=require('dotenv');
dotenv.config();

const express=require('express');
const http=require('http');
const socketIO=require('socket.io');
const cors=require('cors');
const {connect,findDocument,saveDocument,getDocuments,createDocument}=require('./connection.js');


connect();


const app=express();
const server=http.createServer(app);
const io=socketIO(server,{
    cors:{
        origin:'*',
        methods:['GET','POST']
    }
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// app.use(cors({
//     origin: '*',
//     methods: ['GET','POST'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
// }));



io.on('connection',(socket)=>{ 
    console.log('New user connected');

    socket.on('get-document',async documentId=>{
        const defaultValue=""
        const document=await findDocument(documentId);
        socket.join(documentId)

        socket.emit('load-document',document);

        socket.on('send-changes',({content,delta})=>{
            console.log('inside save-changes',typeof content);
            socket.broadcast.to(documentId).emit('receive-changes',{content,delta});
        })

        socket.on('save-document',async data=>{
            console.log('inside save-document',typeof data);
            console.log('Saving document on server:',data);
            await saveDocument(documentId,data);
        })
    })

    socket.on('disconnect',()=>{
        console.log('User disconnected');
    })
})

app.get('/documents',async(req,res)=>{
    try {
        const result=await getDocuments()
        res.json(result);
        console.log('Documents found:', result);
    } catch (error) { 
        res.json({error:error.message}); 
    }  
})

app.post('/create-document',async(req,res)=>{
    const {title,_id}=req.body;
    try {
        const result=await createDocument(title,_id);
        res.json(result);
        console.log('Document created successfully:', result);
    } catch (error) {
        console.log('Error creating document:', error);
    }
})

server.listen(3000,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
})