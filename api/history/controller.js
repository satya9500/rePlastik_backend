const ErrorResponse = require('../../util/errorResponse');
const asyncHandler = require('../../middleware/async');
const History = require('./model');
const axios = require('axios');
const imgbbUploader = require('imgbb-uploader');
const fs = require('fs');

exports.findAndStore = asyncHandler(async (req, res, next) => {
    if(!req.files) {
        return next(new ErrorResponse('Please Upload an Image!', 400))
    }
    const image = req.files.img;
    const fileName = Date.now();
    fs.writeFileSync(`./public/uploads/${fileName}`, image.data);
    const uploadData = await imgbbUploader(process.env.IMGBB_KEY, `./public/uploads/${fileName}`);
    return res.status(200).json({
        success:true,
        imageUrl:uploadData.url,
    })
});

exports.getYtVideos = asyncHandler(async(req,res,next)=>{
    const plasticType = req.body.plasticType||`PVC`;
    await History.create({userId: req.user.id, imageLink: req.body.imageUrl, plasticType, productName: req.body.productName});
    const plasticProduct = req.body.plasticProduct;
    const searchQuery = `How to recycle ${plasticType} ${plasticProduct}`;
    const ytResult = await axios.get(`https://www.googleapis.com/youtube/v3/search?key=${process.env.YT_API_KEY}&type=video&part=snippet&maxResults=10&q=${searchQuery}`);
    return res.status(200).json({
        success:true,
        ytResult: ytResult.data
    })
})

exports.getNews = asyncHandler(async(req,res,next)=> {
    const query=req.body.query;
    const news = await axios.get(`https://newsapi.org/v2/everything?q=${query}&apiKey=${process.env.NEWS_API_KEY}`);
    res.status(200).json({
        success: true,
        count:news.length,
        news: news.data.articles
    });
})

exports.getHistory = asyncHandler(async(req,res,next)=>{
    const userHistory = await History.find({userId: req.user.id});
    return res.status(200).json({
        userHistory
    })
})
