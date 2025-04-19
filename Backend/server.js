const express = require('express');
const mongoose = require('mongoose');
const cors=require('cors');
const User=require('./models/user.js');
const cookieparser=require('cookie-parser')
const {Server}=require('socket.io')
const http=require('http');
const jwt=require('jsonwebtoken');
const { act } = require('react');

const dataBase_url="mongodb://localhost:27017/uber"
const app=express()
const locationIqToken='pk.abf50dd0cdfa0150a86849d06f465ba1';
const secret='snfksjnsfkjsnfsjfsj';

app.use(express.json())
app.use(cookieparser())
app.use(cors({origin:'http://localhost:5173',credentials:true}))
mongoose.connect(dataBase_url).then(()=>{
    console.log("Connected");
})

const server=http.createServer(app)
const io=new Server(server,{
    cors:{
        origin:'http://localhost:5173',
        methods:['GET','POST'],
        credentials:true
    }
})

let users={}
let drivers={}
let activeRides={}
let rideTimeouts={}
io.on('connection',(socket)=>{
    //console.log("Connected",socket.id);
    socket.on('getconnected',(message)=>{
        users[message.username]={socketId: socket.id, vehicle: message.role === "driver" ? message.vehicle : null};
        console.log("Connecting Socket",message.username,users);
        if(message.role==="driver"){
            drivers[message.username]=socket.id
            Object.keys(activeRides).forEach(ride=>{
                if(ride.vehicle===message.vehicle){
                    io.to(socket.id).emit('newride',{username:ride.username,source:ride.source,destination:ride.destination})
                }
            })
        }
    })

    socket.on('bookride',(message)=>{
        console.log("Booking Ride",message)
        activeRides[message.username]={username:message.username,source:message.source,destination:message.destination}
        Object.keys(drivers).forEach(driverUsername=>{
            if (users[driverUsername].vehicle === message.vehicle) {
                io.to(users[driverUsername].socketId).emit('newride',{username:message.username,source:message.source,destination:message.destination})
            }
        })
        console.log(drivers);

        rideTimeouts[message.username]=setTimeout(()=>{
            console.log("Ride Timed Out");
            delete rideTimeouts[message.username];
            delete activeRides[message.username];
            Object.keys(drivers).forEach(driverUsername=>{
                if (users[driverUsername].socketId) {
                    io.to(users[driverUsername].socketId).emit('ridecancelled',{username:message.username})
                }
            })
        },10000) // Moved the closing parenthesis here
    })

    socket.on('acceptride',(message)=>{
        if(activeRides[message.username]){
            console.log("Ride Accepted",message)
            clearTimeout(rideTimeouts[message.username]);
            delete rideTimeouts[message.username];
            delete activeRides[message.username];
            Object.keys(drivers).forEach(driverUsername=>{
                if (users[driverUsername].socketId) {
                    io.to(users[driverUsername].socketId).emit('ridecancelled',{username:message.username})
                }
            })
        }

        if(users[message.username]){
            io.to(users[message.username].socketId).emit('rideaccepted',{driver:message.driver})
        }
    })

    socket.on('cancelride',(message)=>{
        console.log("Cancelling Ride",message)
        if(activeRides[message.username]){
            delete activeRides[message.username];
            clearTimeout(rideTimeouts[message.username]);
            delete rideTimeouts[message.username];
            Object.values(drivers).forEach(driver=>{
                if (users[driver]) {
                    io.to(users[driver].socketId).emit('ridecancelled',{username:message.username})
                }
            })
        }
    })

    socket.on('disconnect', () => {
        console.log('user disconnected:', socket.id);
        const username = Object.keys(users).find(key => users[key].socketId === socket.id);
        if (username) {
            delete users[username];
            if (drivers[username]) {
                delete drivers[username];
            }
            if(activeRides[username]){
                delete activeRides[username];
            }
        }
    });
})

app.get('/mylocation',async (req,res)=>{
    const {lat,long}=req.query;

    const addressDataJson=await fetch(`https://us1.locationiq.com/v1/reverse?key=${locationIqToken}&lat=${lat}&lon=${long}&format=json`)

    const addressData=await addressDataJson.json();

    console.log(addressData)

    res.json({address:addressData.display_name});
})

app.post('/driver/register',async (req,res)=>{
    const {username,password,role,vehicleType}=req.body;

    const registerDetails=await User.create({username,password,role,vehicleType: role === "driver" ? vehicleType : null});

    try{
        jwt.sign({username,id:registerDetails._id},secret,{},(err,token)=>{
            if(err) throw err;
            res.cookie('token',token).status(201).json({register:true,username:registerDetails.username,role:registerDetails.role})
            console.log("Registered");
        })
    }
    catch(err){
        console.log(err);
    }

})

app.post('/driver/login',async (req,res)=>{
    const {username,password}=req.body;

    const loginDetails=await User.find({username});

    try{
        jwt.sign({username,id:loginDetails._id},secret,{},(err,token)=>{
            if(err) throw err;
            const sendInfo={login:true,username:loginDetails[0].username,role:loginDetails[0].role,vehicleType: loginDetails[0].vehicleType};
            res.cookie('token',token).status(201).json(sendInfo)
        })
    }
    catch(err){
        console.log(err);
    }

})


app.get('/login/test',async (req,res)=>{
    const {token}=req.cookies;
    jwt.verify(token,secret,{},async (err,info)=>{
        if (err){res.json({message:"Unauthorized"})}
        else{
            const userDetails=await User.find({username:info.username});
            res.json({message:"Authorized",username:info.username,role:userDetails[0].role,vehicleType:userDetails[0].vehicleType})
        }
    })
})


server.listen(3000,()=>{
    console.log("Listening")
})
