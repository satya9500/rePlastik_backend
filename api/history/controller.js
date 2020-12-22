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
    const userId = req.user.id;
    const fileName = Date.now();
    fs.writeFileSync(`./public/uploads/${fileName}`, image.data);
    const uploadData = await imgbbUploader(process.env.IMGBB_KEY, `./public/uploads/${fileName}`);
    const plasticType = `PVC`;
    const typeOfProcess = `reuse`;
    let searchQuery;
    if(typeOfProcess === 'reuse')
        searchQuery = `How to ${typeOfProcess} ${plasticType} plastic to save`;
    else
        searchQuery = `How to ${typeOfProcess} ${plasticType} plastic in your home itself`;
    const ytResult = await axios.get(`https://www.googleapis.com/youtube/v3/search?key=${process.env.YT_API_KEY}&type=video&part=snippet&maxResults=10&q=${searchQuery}`);
    res.status(200).json({
        success:true,
        imageUrl:uploadData.url,
        ytResult: ytResult.data
    })
});

exports.getNews = asyncHandler(async(req,res,next)=> {
    const query=req.body.query;
    const news = await axios.get(`https://newsapi.org/v2/everything?q=${query}&apiKey=${process.env.NEWS_API_KEY}`);
    res.status(200).json({
        success: true,
        count:news.length,
        news: news.data.articles
    });
})
