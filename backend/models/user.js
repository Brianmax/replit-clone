const {Schema, model} = require('mongoose');

const userSchema = Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    scripts: [
        {
            type: Schema.Types.ObjectId,
            ref:'Script'
        },
    ]
});

userSchema.methods.toJSON = function (){
    const {__v, _id, ...user} = this.toObject();
    user.uid = _id;
    return user;
  }
  
module.exports = model('User', userSchema);