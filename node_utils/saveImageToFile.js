const path = require('path')
const saveImageToFile = (avatar) => {
    let returnedPath;

    try {
        function decodeBase64Image(dataString) {
            let matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            let response = {};

            if (matches.length !== 3) {
                return new Error('Invalid input string');
            }

            response.type = matches[1];
            response.data = new Buffer(matches[2], 'base64');

            return response;
        }

        // Regular expression for image type:
        // This regular image extracts the "jpeg" from "image/jpeg"
        const imageTypeRegularExpression = /\/(.*?)$/;
        const imageBuffer = decodeBase64Image(avatar);
        const userUploadedFeedMessagesLocation = '.' + path.sep + 'upload' + path.sep + 'img' + path.sep;
        const randomString = Math.random().toString(36).substring(2, 36);
        const uniqueRandomImageName = 'image-' + randomString;
        const imageTypeDetected = imageBuffer.type.match(imageTypeRegularExpression);
        const userUploadedImagePath = userUploadedFeedMessagesLocation + uniqueRandomImageName + '.' + imageTypeDetected[1];
        const indexOfNodeUtils = __dirname.indexOf('node_utils');
        const subStr = __dirname.substring(0, indexOfNodeUtils - 1);

        returnedPath = subStr + path.sep + 'upload' + path.sep + 'img' + path.sep + uniqueRandomImageName + '.' + imageTypeDetected[1];

        try {
            require('fs').writeFile(userUploadedImagePath, imageBuffer.data, (err) => {
                if (err) return new Error('Error in saving image');
            });
        } catch (error) {
            console.log('ERROR:', error);
        }

    } catch (error) {
        console.log('ERROR:', error);
    }

    return returnedPath
};

module.exports.saveImageToFile = saveImageToFile;
