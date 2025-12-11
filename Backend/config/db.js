import mongoose from "mongoose" ;
export const connectDB = async()=>{
    await mongoose.connect('mongodb+srv://sunny3799:SINHA3799@cluster0.iiyakax.mongodb.net/ResumeBuilder')
    .then(()=> console.log('DB CONNECTED'));
}