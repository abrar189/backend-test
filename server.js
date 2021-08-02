'use strict'

const express = require('express');
const cors = require('cors');
const server = express();
require('dotenv').config;
server.use(cors());
server.use(express.json());
const PORT =process.env.PORT ||3005 ;
const { default: axios } = require('axios');


const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/test1', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(process.env.MONGODB || 'mongodb://abrar:12345@cluster0-shard-00-00.bezrw.mongodb.net:27017,cluster0-shard-00-01.bezrw.mongodb.net:27017,cluster0-shard-00-02.bezrw.mongodb.net:27017/test1?ssl=true&replicaSet=atlas-wtxjwi-shard-0&authSource=admin&retryWrites=true&w=majority',{ useNewUrlParser: true, useUnifiedTopology: true });


// http://localhost:3005
server.get('/', (req, res) => {
    res.send('hello')
})
const dragonSchema = new mongoose.Schema({
    name: String,
    img: String,
    level: String

});

const userSchema = new mongoose.Schema({
    email: String,
    datadragon:[dragonSchema]

   
});

const userModel = mongoose.model('user', userSchema);

function seedUser() {
    let userdata = new userModel({
        email: 'algourabrar@gmail.com',
       
        datadragon: [{
            name: "Koromon",
            img: "https://digimon.shadowsmith.com/img/koromon.jpg",
            level: "In Training"
        },
        {
            name: "Tsunomon",
            img: "https://digimon.shadowsmith.com/img/tsunomon.jpg",
            level: "In Training"
        },

        ]

    })
    let userdata2 = new userModel({
        email: 'algourabrar0@gmail.com',
       
        datadragon: [{
            name: "Koromon",
            img: "https://digimon.shadowsmith.com/img/koromon.jpg",
            level: "In Training"
        },
        {
            name: "Tsunomon",
            img: "https://digimon.shadowsmith.com/img/tsunomon.jpg",
            level: "In Training"
        },

        ]

    })
    userdata.save();
    userdata2.save();

}

// seedUser();
 


// https://digimon-api.vercel.app/api/digimon
server.get('/api', getApiData);
async function getApiData(req, res) {
    const url = 'https://digimon-api.vercel.app/api/digimon';
    const apiData = await axios.get(url);
    const apiMap = apiData.data.map(value => {
        return new DataOFobj(value)
    });
    res.send(apiMap);
}

class DataOFobj {
    constructor(data) {
        this.name = data.name;
        this.img = data.img;
        this.level = data.level;
    }
}

server.get('/alldata', getAllData);

function getAllData(req, res) {
   
    let email = req.query.email;
    userModel.find({ email: email }, (error, user) => {
        if(error){
            res.send(error)
        }else {
          res.send(user[0].datadragon)
        }
        console.log(user);
    })

}

server.post('/addtofav', addtofavfun);
function addtofavfun(req, res) {
    const {
        email, name, img, level
    } = req.body;

    userModel.find({email:email},(error,favedata)=>{

        if(error){
            res.send(error)
        }else{
        const newFav={
            name:name,
            img:img,
            level:level
        }
        favedata[0].datadragon.push(newFav);
      
    }
    favedata[0].save();
        res.send(favedata[0].datadragon);     
    })
}

// http://localhost:3005/update/index
server.put('/update/:id',updatefun)
function updatefun(req,res){
    const { email, name, img, level } = req.body
    let index= Number(req.params.id)
    userModel.findOne({email:email},(err,updetedata)=>{
        if(err){
            res.send('error')
        }else{
            updetedata.datadragon.splice(index,1 ,{
                name: name,
                img: img,
                level: level
            })
        }
        updetedata.save();
        res.send(updetedata.datadragon);
    })
}

// http://localhost:3005/delete/index
server.delete('/delete/:id', deletedata)
function deletedata(req, res) {
    let id = req.params.id
    let email = req.query.email
    userModel.findOne({ email: email }, (err, deleteddata) => {
        deleteddata.datadragon.splice(id,1);
        // if (err) {
        //     res.send('error')
        // } else {
        //     let newdeledata = deleteddata[0].bokemon.filter((el, ind) => {
        //         if (ind !== index) {
        //             return el;
        //         }
        //     })
        //     deleteddata[0].bokemon = newdeledata;
        // }
        deleteddata.save();
        res.send(deleteddata.datadragon)
    })
}
server.listen(PORT, () => {
    console.log(`listen on ${PORT}`);

})
