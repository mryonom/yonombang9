const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = 3000

const config = require('./config/key')

const { User } = require('./models/User')

app.use(bodyParser.urlencoded({extended: true}))

app.use(bodyParser.json())
const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
}).then(() => console.log('MongoDb Connected...'))
  .catch(err => console.log(err))




app.get('/', (req, res) => res.send('Hello World! GOOD'))

app.post('/register', (req, res) => {
    // 회원가입에 필요한 정보들을 client 에서 가져오면 DB에 저장한다.
    
    const user = new User(req.body)

    user.save((err, userInfo) => {
        if(err) return res.json({success: false, err})
        return res.status(200).json({
            success:true
        })
    })

})



app.listen(port, () => console.log(`Example app listening on port ${port}!`))