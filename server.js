const exp = require('express')
const app = exp()
const cors = require('cors')
const mongoose = require('mongoose')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
app.use(cors())
app.use(exp.json())


const db = "mongodb+srv://jsunnybabu:SunnyJakka@drivetogether.kmuu5n1.mongodb.net/"
mongoose.connect(db).then(()=> {
    console.log("DB connected")
}).catch(err => {
    console.log(err)
})

const verifyToken = (req, res, next) => {
    // Get the user from the jwt token and add id to req object
    const token = req.header('auth-token');
    console.log(token);
    if (!token) {
        res.status(401).send({ error: "Please authenticate using a valid token" })
    }
    try {
        const data = jwt.verify(token, "kasjdh;wlekriu3wo;i4u2i343enrf,msn,fdnwaelrjwelrkjlk#$LKL@@@LKJ#@$");
        req.user = data.user;
        next();
    } catch (error) {
        next(error);
    }

}

const userSchema = new mongoose.Schema({
    Name: String,
    email: String,
    password: String,
    confirmpassword: String,
    phone: String
})

const postSchema = new mongoose.Schema({
    leavingFrom: String,
    goingTo: String,
    date: String,
    carName: String,
    numberOfSeats: Number,
    price: String,
    remainingSeats: Number,
    postingId: Number,
    email: String
})

const bookSchema = new mongoose.Schema({
    leavingFrom: String,
    goingTo: String,
    date: String,
    carName: String,
    numberOfSeats: Number,
    price: String,
    postingId: Number,
    email: String
})

const database = mongoose.model("users", userSchema)

const postdatabase = mongoose.model("posts", postSchema)

const bookingdatabase = mongoose.model("bookings", bookSchema)


const sendPostingEmail = async (user) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
              user: "b15productpricetracker@gmail.com",
              pass: "nucvokqwzbgmkogp",
            },
        });
        const mailOptions = {
            from: {
                name: "DriveTogether",
                address: "b15productpricetracker@gmail.com"
            },
            to: `${user.email}`,
            subject: `Posted Car Ride Details`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #007bff;">Posted Car Ride Details</h2>
                    <p><strong>Leaving From:</strong> ${user.leavingFrom}</p>
                    <p><strong>Going To:</strong> ${user.goingTo}</p>
                    <p><strong>Date:</strong> ${user.date}</p>
                    <p><strong>Car Name:</strong> ${user.carName}</p>
                    <p><strong>Number of Seats:</strong> ${user.numberOfSeats}</p>
                    <p><strong>Price:</strong> ${user.price}</p>
                    <p><strong>Remaining Seats:</strong> ${user.remainingSeats}</p>
                    <p><strong>Posting ID:</strong> ${user.postingId}</p>
                    <p>Thank you for posting the ride to DriveTogether</p>
                </div>
            `
        };
        
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    }
    catch(err) {
        console.log(err);
    }
}

const sendBookingEmailToDriver = async (bookedCar, userEmail, selectedSeats, userPhone) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
              user: "b15productpricetracker@gmail.com",
              pass: "nucvokqwzbgmkogp",
            },
        });
        const mailOptions = {
            from: {
                name: "DriveTogether",
                address: "b15productpricetracker@gmail.com"
            },
            to: `${bookedCar.email}`,
            subject: `Your car has been booked`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #007bff;">Car booking details</h2>
                    <p><strong>Booked User Email:</strong> ${userEmail}</p>
                    <p><strong>Booked User Phone:</strong> ${userPhone}</p>
                    <p><strong>Leaving From:</strong> ${bookedCar.leavingFrom}</p>
                    <p><strong>Going To:</strong> ${bookedCar.goingTo}</p>
                    <p><strong>Date:</strong> ${bookedCar.date}</p>
                    <p><strong>Car Name:</strong> ${bookedCar.carName}</p>
                    <p><strong>Number of Seats selected:</strong> ${selectedSeats}</p>
                    <p><strong>Price:</strong> ${bookedCar.price}</p>
                    <p><strong>Remaining Seats:</strong> ${bookedCar.remainingSeats}</p>
                    <p><strong>Posting ID:</strong> ${bookedCar.postingId}</p>
                    <p>Thank you DriveTogether</p>
                </div>
            `
        };
        
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    }
    catch(err) {
        console.log(err);
    }
}

const sendBookingEmailToUser = async (bookedCar, userEmail, selectedSeats, driverPhone) => {
    
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
              user: "b15productpricetracker@gmail.com",
              pass: "nucvokqwzbgmkogp",
            },
        });
        const mailOptions = {
            from: {
                name: "DriveTogether",
                address: "b15productpricetracker@gmail.com"
            },
            to: `${userEmail}`,
            subject: `Car booking confirmation`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #007bff;">Car booking details</h2>
                    <p><strong>Driver Email:</strong> ${bookedCar.email}</p>
                    <p><strong>Driver Phone:</strong> ${driverPhone}</p>
                    <p><strong>Leaving From:</strong> ${bookedCar.leavingFrom}</p>
                    <p><strong>Going To:</strong> ${bookedCar.goingTo}</p>
                    <p><strong>Date:</strong> ${bookedCar.date}</p>
                    <p><strong>Car Name:</strong> ${bookedCar.carName}</p>
                    <p><strong>Number of Seats selected:</strong> ${selectedSeats}</p>
                    <p><strong>Price:</strong> ${bookedCar.price}</p>
                    <p><strong>Posting ID:</strong> ${bookedCar.postingId}</p>
                    <p>Thank you for booking the ride with DriveTogether</p>
                </div>
            `
        };
        
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    }
    catch(err) {
        console.log(err);
    }
}

app.get('/helloWorld', (req, res) => {
    res.status(200).send("Hello World");
})

app.post('/register', async(req, res) => {
    const { Name, email, password, confirmPassword, phone } = req.body
    try{
        const user = await database.findOne({email: email})
        if(user){
            res.send({message: "User already exists", status: false})
        }else{
            const user = new database({Name, email, password, confirmPassword, phone});
            await user.save()
            res.send({message: "Successfully Registered", status: true})
        }
    }
    catch (err){
        console.log(err)
    }
})


app.post("/login", async(req, res) => {
    const { email, password } = req.body
    try{
        const user = await database.findOne({email: email})
        if(user){
            if(user.password === password){
                const token = await jwt.sign({ email: user.email }, 'kasjdh;wlekriu3wo;i4u2i343enrf,msn,fdnwaelrjwelrkjlk#$LKL@@@LKJ#@$');
                res.send({message: "Login Successful", user: user.Name, status: true, email: user.email, phone: user.phone, token: token})
            }else{
                res.send({message: "Invalid details", status: false})
            }
        }else{
            res.send({message: "Invalid details", status: false})
        }
    }
    catch(err){
        console.log(err)
    }
})

app.post("/postride", verifyToken, async(req, res) => {
    const { leavingFrom, goingTo, date, carName, numberOfSeats, price, postingId, email } = req.body
    const remainingSeats = numberOfSeats;
    try{
        const user = new postdatabase({leavingFrom, goingTo, date, carName, numberOfSeats, price, remainingSeats, postingId, email});
        await user.save()
        await sendPostingEmail(user);
        res.send({message: "Successfully Posted", status: true, data: user})
    }
    catch (err){
        console.log(err)
    }
})

app.post("/bookcar", verifyToken, async (req, res) => {
    const { leavingFrom, goingTo, date, numberOfSeats } = req.body;
    let cars = await postdatabase.find({ 
        leavingFrom: leavingFrom,
        goingTo: goingTo,
        date: date,
    })
    console.log(cars)
    if(cars.length === 0) {
        res.json({ status: false, message: 'No cars available for the specified criteria' });
    }
    else {
        res.status(200).json({ status: true, message: 'Cars found', data: cars });
    }
});

app.post("/makeBooking", verifyToken, async (req, res) => {
    const { leavingFrom, goingTo, date, carName, numberOfSeats, price, selectedSeats, postingId, userEmail, userPhone } = req.body;
    console.log(postingId);
    
    // Find the booked car
    let bookedCar = await postdatabase.findOne({ postingId: postingId });
    let driverDetails = await database.findOne({ email: bookedCar.email });
    console.log(driverDetails.phone);
    
    if (!bookedCar) {
        return res.send({ status: false, message: 'Car not found' });
    }

    if(selectedSeats === "0") {
        return res.send({ status: false, message: 'Please select minimum 1 seat' });
    }
    if(selectedSeats === 0) {
        return res.send({ status: false, message: 'Please select number of seats' });
    }
    // Check if there are enough remaining seats
    if (bookedCar.remainingSeats < selectedSeats) {
        return res.send({ status: false, message: 'Not enough remaining seats' });
    }

    // Update remaining seats
    bookedCar.remainingSeats -= selectedSeats;

    try {
        // Save the updated car
        await bookedCar.save();
        console.log(bookedCar.email);
        const user = new bookingdatabase({
            leavingFrom: bookedCar.leavingFrom,
            goingTo: bookedCar.goingTo,
            date: bookedCar.date,
            carName: bookedCar.carName,
            numberOfSeats: selectedSeats,
            price: bookedCar.price,
            postingId: bookedCar.postingId,
            email: userEmail,
        });
        await user.save()
        await sendBookingEmailToUser(bookedCar, userEmail, selectedSeats, driverDetails.phone);
        await sendBookingEmailToDriver(bookedCar, userEmail, selectedSeats, userPhone);
        res.send({ status: true, message: 'Booking successful', data: bookedCar });
    } catch (err) {
        res.status(500).send({ status: false, message: 'Error updating remaining seats' });
    }
});

app.post('/myBookings', verifyToken, async (req, res) => {
    try {
        const bookings = await bookingdatabase.find({ email: req.body.userEmail });
        res.send({ status: true, message: 'Bookings fetched successfully', data: bookings });
    } catch (err) {
        res.status(500).send({ status: false, message: 'Error fetching bookings' });
    }
})
app.post('/myPostings', verifyToken, async (req, res) => {
    try {
        const postings = await postdatabase.find({ email: req.body.userEmail });
        console.log(postings)
        res.send({ status: true, message: 'Postings fetched successfully', data: postings });
    } catch (err) {
        res.status(500).send({ status: false, message: 'Error fetching postings' });
    }
})

app.post("/userProfile", verifyToken, async (req, res) => {
    const { userEmail } = req.body
    console.log(userEmail)
    const userDetails = await database.findOne({ email: userEmail });
    const totalBookings = await bookingdatabase.find({ email: userEmail }).count();
    const totalPostings = await postdatabase.find({ email: userEmail }).count();
    const user = { userDetails, totalBookings, totalPostings };
    res.send({ status: true, message: 'User fetched successfully', data: user });
})

app.listen(3001, () => {
    console.log("Server is running on port 3001")
})
