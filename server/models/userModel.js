import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, 
      required: true 
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    isSeller: { type: Boolean, required: true, default: false },
    profilePicture:{
      type:String,
      default:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    },
    seller: {
      name: { type: String, required: false },
      logo: { type: String, required: false },
      description: { type: String, required: false },
      rating: { type: Number, default: 0, required: true },
      reviews: { type: Number, default: 0, required: true },
    },
  },
  {
    timestamps: true, 
  }
);

const User = mongoose.model('User', userSchema);

export default User;