const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const port = 3000

const config = require('./config/key')
const { auth } = require('./middleware/auth')
const { User } = require('./models/User')

app.use(bodyParser.urlencoded({extended: true}))

app.use(bodyParser.json())
app.use(cookieParser())
const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
}).then(() => console.log('MongoDb Connected...'))
  .catch(err => console.log(err))




app.get('/', (req, res) => res.send('Hello World! GOOD'))

app.post('/api/users/register', (req, res) => {
    // 회원가입에 필요한 정보들을 client 에서 가져오면 DB에 저장한다.
    
    const user = new User(req.body)

    user.save((err, userInfo) => {
        if(err) return res.json({success: false, err})
        return res.status(200).json({
            success:true
        })
    })

})

app.post('/api/users/login', (req,res) => {
    User.findOne({ email: req.body.email}, (err, user) => {
        if(!user) {
            return res.json({
                loginSuccess: false,
                message: "이메일이 없습니다."
            })
        }

        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch) {
                return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."})
            }

            user.generateToken((err, user) => {
                if(err) return res.status(400).send(err)

                res.cookie("x_auth", user.token)
                .status(200)
                .json({ loginSuccess: true, userId: user._id })

            })
        } ) 

    })
})

app.post('/api/users/auth', auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image

    })
})

app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id},
        { token: "" }, (err, user) => {
            if (err) return res.json({ 
                success: false, err
            })
            return res.status(200).send({ 
                success: true
            })
        })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))