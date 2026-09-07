import mongoose from 'mongoose'


const ConnectDb = async () => {
    try {
       await mongoose.connect(process.env.MONGODB_URI)
       console.log('mongodb is connected successfully')
    } catch (error) {
        console.log(`mongodb is not connected`, error)
    }
}

export default ConnectDb;