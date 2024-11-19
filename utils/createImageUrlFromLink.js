import axios from "axios";

export const createImageUrlFromLink = (urlsList, directory) => new Promise((resolve, reject) => {
    let uploadedImages = [];
    let iteration = 0;

    urlsList.forEach((url) => {
        const formData = new FormData();
        formData.append("file", url);
        formData.append("upload_preset", directory);

        axios.post('https://api.cloudinary.com/v1_1/joaoserafinadm/image/upload', formData)
            .then(res => {
                uploadedImages.push({
                    original_url: url,
                    cloudinary_url: res.data.secure_url,
                    id: res.data.public_id
                });
                iteration++;
                if (iteration === urlsList.length) resolve(uploadedImages);
            })
            .catch(error => {
                uploadedImages.push({
                    original_url: url,
                    error: error.message
                });
                iteration++;
                if (iteration === urlsList.length) reject(uploadedImages);
            });
    });
});