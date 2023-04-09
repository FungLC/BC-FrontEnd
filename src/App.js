import './App.css';
import React from "react";
import ReactDOM from "react-dom";
import QRCode from "react-qr-code";
import { useState, useEffect } from "react";
import lightabi from "./utils/LightControl.json";
import payabi from "./utils/PaymentContract.json";
import hotelabi from "./utils/Hotel.json";
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
  const [checkin, setcCheckin] = useState(false);
  const [messages, setMessages] = useState([]);
  const [VIPcheck, setVip] = useState(false);

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

    if (details.innerHTML === `<h4 align="center">Check In as ***********</h4>`) {
      details.innerHTML = `<h4 align="center">Check In as ${account.substring(0, 4)}...${account.substring(account.length - 4)}</h4>`;
      button.innerHTML = "Show Off";
    } else {
      details.innerHTML = `<h4 align="center">Check In as ***********</h4>`;
      button.innerHTML = "Show On";
    }
  }


  return (
    <div className="container">
      {!checkin ? (
        <>
          <div className="centerup">
            <h1>Welcome to Big God Hotel</h1>
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
          <h1>Welcome to Big God Hotel</h1>
          <h2 align="center">Welcome, Mr.Big God</h2>
          <div id="container">
            <h4><p id="details">Check In as ***********</p></h4>
            <>&nbsp;</>
            <button id="toggleButton" onClick={toggle}>Show On</button>
          </div>
          <div className="ButtonM">
            <button className="button4" onClick={handleCheckOut}>
              CheckOut
            </button>
          </div>
          <br></br>
          <div className="row">
            <div className="col">
              <div className="tabs">
                <div className="tab">
                  <input type="checkbox" id="chck1"></input>
                  <label className="tab-label" htmlFor="chck1">Light</label>
                  <div className="tab-content">
                    {!isOn ? (
                      <>The light should be <b>Off</b> now, Click it to On<br></br><br></br>
                        <button className="button4" onClick={light}>On</button>
                      </>
                    ) : (
                      <>The light should be <b>On</b> now, Click it to Off<br></br><br></br>
                        <button className="button5" onClick={light}>Off</button></>

                    )}
                  </div>
                </div>
                <div className="tab">
                  <input type="checkbox" id="chck2"></input>
                  <label className="tab-label" htmlFor="chck2">Check In Details</label>
                  <div className="tab-content">
                    You have paid : 7 ETH (1 ETH per day)for Check In
                    <br></br>
                    Now you had Check in 5 days 
                  </div>
                </div>
                <div className="tab">
                      <input type="checkbox" id="chck3"></input>
                      <label className="tab-label" htmlFor="chck3">Fees</label>
                      <div className="tab-content">
                        Coke 1 x 0.1 ETH<br></br>
                        Pizza 1 x 0.3 ETH<br></br>
                        French Fries 1 x 0.1 ETH<br></br>
                        Turkey Meat 1 x 0.5 ETH<br></br>
                        ---------------<br></br>
                        Total <b>1 ETH</b><br></br><br></br>

                        <button className="button4" onClick={pay}>
                          Pay
                        </button>
                      </div>
                    </div>
                    <div className="tab">
                      <input type="checkbox" id="chck4"></input>
                      <label className="tab-label" htmlFor="chck4">VIP</label>
                      <div className="tab-content">
                        {!VIPcheck? (
                          <>
                          <>10 ETH for <b>VIP</b> service</>
                          <br></br>
                          <br></br>
                        <button className="button4" onClick={VIP}>Request for VIP</button>
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
              </div>
            </div>
          </div>
        </>
      )}
      <div>
      </div>
    </div>
  );
}

export default App;

