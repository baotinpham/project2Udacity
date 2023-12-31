import fs from "fs";
import Jimp = require("jimp");
import axios from 'axios';

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const outpath =
      "/tmp/filtered." + Math.floor(Math.random() * 2000) + ".jpg";
      axios({
        method: 'get',
        url: inputURL,
        responseType: 'arraybuffer'
      })
      .then(async function ({data: imageBuffer}) {
        const photo = (await Jimp.read(imageBuffer)).resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(__dirname + outpath, () => {
          resolve(__dirname + outpath);
        });
      })
    } catch (error) {
      reject(error);
    }
  });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files: Array<string>) {
  for (let file of files) {
    console.log(file)
    fs.unlinkSync(file);
  }
}

export async function getFilePathsFromDirectory(dir: string) {
  const files = fs.readdirSync(dir).map(file => dir + "/" + file)
  return files
}

export function isValidUrl(str: any) {
  let url = null;
  try {
    url = new URL(str);
  } catch (error) {
    console.error(error)
    return false;
  }

  return url != null;
}