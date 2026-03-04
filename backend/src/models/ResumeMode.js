import mongoose from "mongoose";


const ResumeSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    title:{type:String,default:'Untitled resume'},
    public:{type:Boolean,default:false},
    template:{type:String,default:'classic'},
    accent_color:{type:String,default:'#3B82F6'},
    professional_summary :{type:String,default:""},
    skills:[{type:String}],
    personal_info:{
         image:{type:String,default:""},
         full_name:{type:String,default:""},
         profession:{type:String,default:""},
         email:{type:String,default:""},
         linkedin:{type:String,default:""},
         website:{type:String,default:""},
         phone:{type:String,default:""},
         location:{type:String,default:""}
    },
    experience:[
        {
           company:{type:String},
           position:{type:String},
           description:{type:String},
           end_date:{type:String},
           start_date:{type:String},
           is_current:{type:Boolean},
         
        }
    ],
     education:[
        {
            institute:{type:String},
            degree:{type:String},
            field:{type:String},
            graduation_date:{type:String},
            gpa:{type:String},
            marks:{type:String}
        }
    ],
    projects:[
        {
            name:{type:String},
            description:{type:String},
            type:{type:String},
            link:{type:String},
            code_link:{type:String}
        }
    ],
    


},{timestamps:true,minimize:true});

const Resume = mongoose.model('Resume',ResumeSchema);

export default Resume