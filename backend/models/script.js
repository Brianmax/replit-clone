const {Schema, model} = require('mongoose');

const scriptSchema = Schema({
    name: {
        type:String,
        required: true
    },
    content: {
        type: String,
    },
    owners: [
        {
            type: Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
    ]
});

scriptSchema.methods.toJSON = function (){
    const {__v, _id, ...script} = this.toObject();
    script.id = _id;
    return script;
  }

module.exports = model('Script', scriptSchema);