const io = require("socket.io")(8000, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});



// heloo

const mongoose = require('mongoose');

const { MongoClient, ServerApiVersion } = require('mongodb');

// Connect to MongoDB
mongoose.connect('mongodb+srv://viren25x:225518@virenserver1.mhksb.mongodb.net/?retryWrites=true&w=majority&appName=virenServer1', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
    socketTimeoutMS: 45000 // Increase socket timeout to 45 seconds
})

const messageSchema = new mongoose.Schema({
    name: String,
    type: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
   
});



const Message = mongoose.model('Message', messageSchema);
const User = mongoose.model('User', userSchema );

// Connect to MongoDB




const users = {};

io.on("connection", (socket) => {
    console.log("A user connected");

    // Retrieve and send previous messages
    Message.find().sort({ timestamp: 1 }).then((messages) => {
        socket.emit('previous-messages', messages);
    }).catch((err) => {
        console.error(err);
    });

    socket.on("new-user-joined", (name) => {
      
        users[socket.id] = name;
        socket.broadcast.emit("user-joined", name);
    });

    socket.on("sent", (data) => {
        const message = new Message({ name: users[socket.id], type: data.type, message: data.message });
        message.save().then(() => {
            socket.broadcast.emit("receive", { type: data.type, message: data.message, name: users[socket.id] });
        }).catch((err) => {
            console.error(err);
        });
    });

    socket.on("disconnect", () => {
        socket.broadcast.emit("user-left", users[socket.id]);
        delete users[socket.id];
    });
});



console.log("NodeServer Server is runing")