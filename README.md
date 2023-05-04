better to use anaconda3 to run our code
before run the code , you may need to install come package

yarn add react-qr-code  
npm install react-app-rewired --save-dev  
conda install -c conda-forge nodejs  
npm install hardhat  
npm install @mui/material @emotion/react @emotion/styled  

also our app is design for mobile, using mobile simulator to run our app is better  
https://chrome.google.com/webstore/detail/mobile-simulator-responsi/ckejmhbmlajgoklhgbapkiccekfoccmk

open first terminal  
cd "path\BC-BackEnd"  
npx hardhat node  

after that open second terminal  
cd "path\BC-BackEnd"  
npx hardhat run scripts/run.js --network localhost  

then open third terminal  
cd "path\BC\BC-Front-main"  
npm start  

you will see the app open on browser.  
you can connect your own MetaMask or hardhat provides an account for testing to try the app
