import './App.css';
import React from "react";
import ReactDOM from "react-dom";
import QRCode from "react-qr-code";
import { useState, useEffect } from "react";
import lightabi from "./utils/LightControl.json";
import payabi from "./utils/PaymentContract.json";
import hotelabi from "./utils/Hotel.json";
// mui
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import WalletIcon from '@mui/icons-material/Wallet';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import SensorDoorOutlinedIcon from '@mui/icons-material/SensorDoorOutlined';
import ContentPasteSearchOutlinedIcon from '@mui/icons-material/ContentPasteSearchOutlined';
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined';
import SwitchAccessShortcutAddOutlinedIcon from '@mui/icons-material/SwitchAccessShortcutAddOutlined';
import SmokeFreeOutlinedIcon from '@mui/icons-material/SmokeFreeOutlined';
import BedOutlinedIcon from '@mui/icons-material/BedOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import backgroundImage from './image/hotel.jpg';
import vip from './image/vip.jpg';
import metamaskgif from './image/metamask.gif'
import { color, width } from '@mui/system';
import CircleOutlined from '@mui/icons-material/CircleOutlined';
import { Opacity } from '@mui/icons-material';


import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

import Typography from '@mui/material/Typography';


const { ethers } = require("ethers");

const LightcontractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
const LightcontractABI = lightabi.abi

const PaycontractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
const PaycontractABI = payabi.abi

const hotelAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
const hotelABI = hotelabi.abi

function App() {
  const [isOn, setlight] = useState(false)
  const [account, setAccount] = useState(null);
  // const [checkin, setcCheckin] = useState(false);
  const [checkin, setcCheckin] = useState(true);
  const [messages, setMessages] = useState([]);
  const [VIPcheck, setVip] = useState(false);
  const [showPass,setShowPass] = useState(false);

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        console.log(`metamask is available`);
      } else {
        console.log(`metamask error`);
      }

      const accounts = await ethereum.request({
        method: "eth_accounts"
      })

      if (accounts.length !== 0) {
        const checkin = true
        setcCheckin(checkin)
        const account = accounts[0]
        console.log(`found account with address`, account);
        setAccount(account);
      } else {
        console.log(`no authorized account found`);
      }

    } catch (err) {
      console.error(err)
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert(`please install metamask`)
        return
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts"
      })
      console.log(accounts[0]);

      setAccount(accounts[0]);
    } catch (err) {
      console.error(err);
    }
  }

  const handleCheckIn = async () => {
    try {
      await connectWallet();
      await checkIn()
    } catch (error) {
      console.error(error); // Log any errors that occur
    }
  };

  const handleCheckOut = async () => {
    try {
      await checkOut(); // Wait for checkOut function to complete
    } catch (error) {
      console.error(error); // Log any errors that occur
    }
  };

  const light = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const LightContract = new ethers.Contract(
          LightcontractAddress, LightcontractABI, signer);

        if (isOn === false) {
          let tx = await LightContract.turnOn();
          await tx.wait()
          const isOn = await LightContract.isOn();
          setlight(isOn);
          console.log(isOn)
        } else {
          let tx = await LightContract.turnOff();
          await tx.wait()
          const isOn = await LightContract.isOn();
          setlight(isOn);
          console.log(isOn)
        }

      }
    } catch (err) {
      console.error(err);
    }
  }

  const pay = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        await ethereum.request({ method: 'eth_requestAccounts' });
        const signer = provider.getSigner();
        const paymentContract = new ethers.Contract(
          PaycontractAddress, PaycontractABI, signer);
        const receiverAddress = "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720";
        const paymentValue = ethers.utils.parseEther("1"); // 0.1 ETH
        const tx = await paymentContract.pay(receiverAddress, { value: paymentValue });
        console.log("Payment transaction hash:", tx.hash);
      }
    } catch (err) {
      console.error(err);
    }
  }

  const VIP = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        await ethereum.request({ method: 'eth_requestAccounts' });
        const signer = provider.getSigner();
        const paymentContract = new ethers.Contract(
          PaycontractAddress, PaycontractABI, signer);
        const receiverAddress = "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720";
        const paymentValue = ethers.utils.parseEther("10"); // 10 ETH
        const tx = await paymentContract.pay(receiverAddress, { value: paymentValue });
        console.log("Payment transaction hash:", tx.hash);
        setMessages(...messages, [])
        setMessages([...messages, { type: 'cert', text: tx.hash }, { type: 'username', text: "big_god" }]);
        setVip(true)
        
      }
    } catch (err) {
      console.error(err);
    }
  }

 

  const checkIn = async () => {
    try {
      const { ethereum } = window;
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const hotelContract = new ethers.Contract(hotelAddress, hotelABI, signer);
      const tx = await hotelContract.checkIn({ value: ethers.utils.parseEther("7") });
      await tx.wait()
      console.log("Payment transaction hash:", tx.hash);
      const checkin = true
      setcCheckin(checkin)
    } catch (err) {
      console.error(err);
    }
  }

  const checkOut = async () => {
    try {
      const { ethereum } = window;
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const hotelContract = new ethers.Contract(hotelAddress, hotelABI, signer);
      const tx = await hotelContract.checkOut();
      await tx.wait()
      console.log("refund transaction hash:", tx.hash);
      await withdraw();
    } catch (err) {
      console.error(err);
    }
  }

  const withdraw = async () => {
    try {
      const { ethereum } = window;
      await ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(ethereum);
      const privateKey = "0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6"; // Replace with your owner private key
      const wallet = new ethers.Wallet(privateKey, provider);
      const hotelContract = new ethers.Contract(hotelAddress, hotelABI, wallet);
      const tx = await hotelContract.withdraw();
      console.log("Withdraw transaction hash:", tx.hash);
      await tx.wait()
      setAccount(null)
    } catch (err) {
      console.error(err);
    }
  }


  function toggle() {
    var button = document.getElementById("toggleButton");
    var details = document.getElementById("details");
    setShowPass(!showPass);
    if (details.innerHTML === `<h4 align="center">Check In as ***********</h4>`) {
      details.innerHTML = `<h4 align="center">Check In as ${account.substring(0, 4)}...${account.substring(account.length - 4)}</h4>`;
      button.innerHTML = "Show Off";
    } else {
      details.innerHTML = `<h4 align="center">Auth with ***********</h4>`;
      button.innerHTML = "Show On";
    }
  }


  return (
    
    <div className="container" >
    
      {!checkin ? (
        <>
          <div className="centerup">
            <h1>Welcome to B.C. Hotel</h1>
            <br></br>
            <div className="ButtonM">
              <button className="button1" onClick={handleCheckIn}>
                Check In
              </button>
              
            </div>
          </div>
        </>
      ) : (
        <>
        
        <div className="bg-fixed" style={{ backgroundImage: `url(${backgroundImage})`,backgroundRepeat: "no-repeat", width:"100%", height:250}}>
  
        {/* <img className="bg-fixed" src={backgroundImage} alt="Hotel image" style={{width:"100%"}} />  */}
        {/* style={{ backgroundImage: `url(${backgroundImage})`,backgroundRepeat: "no-repeat", width:"100%"}} */}
        <div class="headline-container"><h1 class="headline headline--themovement headline--large">Exprience Blockchain Hotel</h1></div>
          
        
        </div>

        <div>
          <br/>
    <Card sx={{ maxWidth: 358,height:300 }}>
      <CardMedia
        sx={{ height: 170 }}
        image={metamaskgif}
        title="green iguana"
      />
      <CardContent>
      <h2 align="center">Welcome, Mr. Cheng</h2>
          <div id="container">
            <h4 align="center"><p id="details">Auth with ***********</p></h4>
            <>&nbsp;</>
  
            <IconButton aria-label="fingerprint" onClick={toggle}>
              {showPass ? <VisibilityIcon /> : <VisibilityOffIcon/>}
              
            </IconButton></div>
      </CardContent>
      
    </Card>
  </div>
          <br></br>
          <div className="row">
            <div className="col">
              <div className="tabs">
                <div className="tab text-center">
                  <input type="checkbox" id="chck1"></input>
                  <label className="tab-label" htmlFor="chck1"><SensorDoorOutlinedIcon/>Smart Door</label>
                  <div className="tab-content">
                  
                    
                  
                    {!isOn ? (
                      <>The door should be <b style={{ color: 'red' }}>Lock</b> now <br/><br/> Click it to Unlock<br></br>
    
                        <IconButton aria-label="fingerprint" color="error" onClick={light}>
                          <LockOutlinedIcon sx={{ fontSize: 80 }}/>
                        </IconButton> 
                      </>
                    ) : (
                      
                      <>The door should be <b style={{ color: 'green' }}>UnLock</b> now <br/> Click it to Lock<br></br><br></br>
                        
                        <IconButton aria-label="fingerprint" color="success" onClick={light}>
                          <LockOpenOutlinedIcon sx={{ fontSize: 80 }}/>
                        </IconButton> 
                        </>

                    )}
                  </div>
                </div>
                <div className="tab text-center" >
                  <input type="checkbox" id="chck2"></input>
                  <label className="tab-label" htmlFor="chck2"><ContentPasteSearchOutlinedIcon/>Check In Details</label>
                  <div className="tab-content">
                    <b>Mr. Cheng</b><br/>
                    Room:1701<br/><br/>
                    <p>Check in  date: 10 Apr,2023</p>
                    <p>Check out date: 17 Apr,2023</p>
                    <p><SmokeFreeOutlinedIcon/> Smoke Free Room</p>
                    <p><BedOutlinedIcon/> Double bed</p>
                    Room fee: 1 ETH / day<br/>
                    -----------------------------------<br/>
                    Deposit : 7 ETH<br/><br/>
                    
                    
                    <CheckCircleIcon sx={{ fontSize: 35}} color="success"/><CheckCircleIcon sx={{ fontSize: 35}} color="success"/><CheckCircleIcon sx={{ fontSize: 35}} color="success"/><CheckCircleIcon sx={{ fontSize: 35}} color="success"/><CheckCircleIcon sx={{ fontSize: 35}} color="success"/><CircleOutlined sx={{ fontSize: 35}}/><CircleOutlined sx={{ fontSize: 35}}/>
                    Remaining <b>2</b> days  <br/>
                    
                  </div>
                </div>
                <div className="tab text-center">
                      <input type="checkbox" id="chck3"></input>
                      <label className="tab-label" htmlFor="chck3"><RequestQuoteOutlinedIcon/>Extra Fees</label>
                      <div className="tab-content">
                        Coke 1 x 0.1 ETH<br></br>
                        Pizza 1 x 0.3 ETH<br></br>
                        French Fries 1 x 0.1 ETH<br></br>
                        Turkey Meat 1 x 0.5 ETH<br></br>
                        ---------------<br></br>
                        Total <b>1 ETH</b><br></br><br></br>

                        <button class="button-17" role="button" onClick={pay}>Payment  </button>
                      </div>
                    </div>
                
                    <div className="tab text-center">
                      <input type="checkbox" id="chck4"></input>
                      <label className="tab-label" htmlFor="chck4"><SwitchAccessShortcutAddOutlinedIcon/>VIP Service</label>
                      <div className="tab-content">
                        {!VIPcheck? (
                          <>
                          <img src={vip} alt="VIP image" />
                          <>Just 10 ETH to enjoy <b>VIP</b> service</>
                          <br></br>
                          <br></br>
                
                        <button class="button-85" role="button" onClick={VIP}>Join VIP</button>
                        </>
                        ):(
                          <>
                        <div style={{ height: "auto", margin: "0 auto", maxWidth: 200, width: "100%" }}>
                        <QRCode 
                        style={{ height: "auto", maxWidth: "100%", width: "100%", size:256}}
                        value={JSON.stringify(messages)} />
                      </div>
                      
                      </>
                      
                      )}
                      </div>
                      
                    </div>


                    <div className="tab text-center">
                      <input type="checkbox" id="chck5"></input>
                      <label className="tab-label" htmlFor="chck5"><LogoutIcon/>Check out</label>
                      <div className="tab-content">
                          Are you sure to Check out ?<br/><br/>    
                          <button class="button-17" role="button" onClick={handleCheckOut}>Logout <LogoutIcon fontSize="small"/></button>
                      </div>
                    </div>

                    
              </div>
              <div className='text-center p-4' style={{ backgroundColor: '#ecf0f1'}}>
                      © 2023 Copyright:<br/>
                      <a className='text-reset fw-bold' href='https://mdbootstrap.com/'>
                        Powered by Blockchain Hotel System 
                      </a>
                </div>
            </div>
           
          </div>
        </>
      )}
      <div>
      </div>
      <div className="selection-box">
  <div className="row">
    <div className="col">
      <div className="tab">
        ...
      </div>
    </div>
    <div className="col">
      <div className="tab">
        ...
      </div>
    </div>
  </div>
  <div className="row">
    <div className="col">
      <div className="tab">
        ...
      </div>
    </div>
    <div className="col">
      <div className="tab">
        ...
      </div>
    </div>
  </div>
</div>

{/* <div className='container'><button class="button-53" role="button">Button 53</button></div> */}
</div>
  );
}

export default App;


