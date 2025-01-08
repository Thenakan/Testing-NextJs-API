import mongoose from "mongoose";
const MONGODB_URI = process.env.MONGODB_URI;
const connectToDatabase = async () => {
    const connectionState = mongoose.connection.readyState;
    if (connectionState === 1) {
        console.log("MongoDB is already connected ");
        return
    }
    if (connectionState === 2) {
        console.log("MongoDB connection is connecting ");
        return
    }
    try{
        mongoose.connect(MONGODB_URI!,{
            dbName: 'cluster0',
            bufferCommands: true,
        } );
    } catch (error: any){
        console.log("MongoDB connection error: ", error);
        throw new Error ("MongoDB connection error", error);
    }
}
export default connectToDatabase;






