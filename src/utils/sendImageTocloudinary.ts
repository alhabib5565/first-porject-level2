import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import fs from 'fs'

// Configuration
cloudinary.config({
    cloud_name: "dqiqst28z",
    api_key: "154124958445442",
    api_secret: "SnXwvPE-AMlwXxG-q7j3E7kprxQ"
});

export const sendImageToCloudinary = async (path: string, imageName: string): Promise<Record<string, string>> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
            path,
            { public_id: imageName.trim() },
            function (error, result) {
                if (error) {
                    reject(error);
                }
                resolve(result as UploadApiResponse);
                // delete a file asynchronously
                fs.unlink(path, (err) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('File is deleted.');
                    }
                });
            },
        );
    });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.cwd() + '/uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

export const upload = multer({ storage: storage })