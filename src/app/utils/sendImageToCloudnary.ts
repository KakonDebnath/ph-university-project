import { v2 as cloudinary } from 'cloudinary';

export const sendImageToCloudinary = () => {
  cloudinary.config({
    cloud_name: 'dsu11kun4',
    api_key: '875512472645688',
    api_secret: '6QjQZIb-UZOW2m9--0hV3xAWicw',
  });

  cloudinary.uploader.upload(
    'https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg',
    { public_id: 'olympic_flag' },
    function (error, result) {
      console.log(result);
    },
  );
};
