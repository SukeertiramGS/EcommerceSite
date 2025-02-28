const mongoose=require('mongoose');

const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter product name"],
        trim:true,
        maxLength:[100,"Product name cannot exceed 100 characters"]
    },
    price:{
        type:Number,
        default:0.0
    },
    description:{
        type:String,
        required:[true,"Please enter product descriptin"]
    },
    ratings:{
        type:String,
        default:0
    },
    images:[{
        image:{
            type:String,
            required:true
        }
 } ],
    category:{
        type:String,
        required:[true,"Please enter product category"],
        enum:{
            values:[
                'Electronics',
                'Home',
                'Mobile Phone',
                'Laptops',
                'Clothing/shoes',
                'Headphones',
                'Food',
                'Books',
                'Beauty/Health',
                'Sports',
                'Outdoor',
                'Accessories'
            ],
            message:"Please select correct category"
        }
    },
    seller: {
         type:String,
         required:[true,"Please enter product seller"]
    },
    stock:{
        type:Number,
        required:[true,"Please enter product stock"],
        maxLength:[20,"Prodcut stock cannot exceed 20"]
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
           user:mongoose.Schema.Types.ObjectId,
            rating:{
                type:String,
                required:true
            },
            comment:{
                type:String,
                required:true
            }

        }
    ],
    user:{
        type: mongoose.Schema.Types.ObjectId
    }, 
    createdAt:{
        type:Date,
        default:Date.now()
    }

})


let schema=mongoose.model('Product',productSchema)
module.exports=schema