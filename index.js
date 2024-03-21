const axios = require("axios");
const fs = require("fs");
const readline = require("readline");
const path = require("path");

// Create a readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to download and save images
async function downloadAndSaveImages(quantity) {
  try {
    // Check if the 'dist' folder exists, if not, create it
    const distFolderPath = path.join(__dirname, "dist");
    if (!fs.existsSync(distFolderPath)) {
      fs.mkdirSync(distFolderPath);
    }

    // Iterate over the requested quantity of images
    for (let i = 1; i <= quantity; i++) {
      // Generate a unique number to insert in the Unsplash URL
      const uniqueId = Date.now(); // Using a timestamp to generate a unique number
      const url = `https://source.unsplash.com/random/${uniqueId}`;
      // Download the image using axios
      const response = await axios({
        method: "GET",
        url: url,
        responseType: "stream",
      });
      // Rename the image with an incremental name
      const fileName = `${i}.jpg`;
      // Full path of the image file
      const filePath = path.join(distFolderPath, fileName);
      // Save the image to the file system
      response.data.pipe(fs.createWriteStream(filePath));
      console.log(`Image downloaded and saved as ${filePath}`);
      // console.log(chalk.blue("descargado"));
    }
  } catch (error) {
    console.error("Error downloading images:", error);
  } finally {
    // Close the readline interface
    rl.close();
  }
}

// Ask the user how many images they want to download
rl.question("How many images do you want to download? ", (quantity) => {
  if (isNaN(quantity) || quantity <= 0) {
    console.log("Please enter a valid number greater than zero.");
    rl.close();
  } else {
    // Call the function to download and save images
    downloadAndSaveImages(parseInt(quantity));
  }
});
