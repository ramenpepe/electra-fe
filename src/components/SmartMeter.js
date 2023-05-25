import React, { useState, useEffect } from 'react';

function SmartMeter() {
  const [wallet, setWallet] = useState("electra12lhecv88myvrmgv92syj782dxjfsnjjg3lzvv7");
  const [walletl, setWalletL] = useState("Factory");

  const [data, setData] = useState({ date: "", time: parseInt('000', 10), produce: parseInt('000', 10), demand: parseInt('000', 10) });
  const [swallet, setSWallet] = useState(false);
  const [gain, setGain] = useState(false);

  const handleWalletChangeL = (event) => {
    setWalletL(event.target.value);
    setWallet(wallet);
    console.log(event.target.value, walletl);
  };

  const handleWalletChange = (event) => {
    setWallet(event.target.value);
  };

  const handleSWalletChange = () => {
    setSWallet(!swallet);
    console.log(swallet);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://electra.alkia.net:1317/electra/meter/listrecordings_100/${wallet}/true`);
        const json = await response.json();
        const datasrc = JSON.parse(json.meterreadings[json.meterreadings.length - 1]);
        const date = new Date(datasrc.timestamp * 1000); // Convert Unix timestamp to milliseconds

        const dateString = date.toLocaleDateString(); // Get the date in a readable format
        const timeString = date.toLocaleTimeString();
        if (walletl.trim() === "greenman") { datasrc.whin = 0; }
        if (typeof datasrc.whin === "undefined") { datasrc.whin = 0; }

        if (datasrc.whin - datasrc.whout < 0) { console.log(1); setGain(true); } else { setGain(false); }
        console.log(walletl, datasrc.whin - datasrc.whout);
        setData({
          date: dateString,
          time: timeString,
          produce: datasrc.whout,
          demand: datasrc.whin
        });
      } catch (error) {
        console.error(error);
      }
    };

    const interval = setInterval(() => {
      fetchData();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [wallet]);

  return (
    <div>
      <div className="smartmeter-main">
        <div>
          <div className="time">
            {swallet ? (
              <div className="address-input">
                <label>Wallet Label</label><br />
                <input placeholder="Wallet Label" onChange={handleWalletChangeL} value={walletl} />
                <label>Wallet Address</label><br />
                <input placeholder="Wallet Address" onChange={handleWalletChange} onBlur={handleSWalletChange} value={wallet} />
              </div>
            ) : (
              <div class="walletid">
                <div onClick={handleSWalletChange}>
                  <sup>[ {walletl} ]</sup>
                </div>
              </div>
            )}
            {data.time}
            <br /><sup>{data.date}</sup>
          </div>
        </div>
        <div className="demand">{data.demand}</div>
        <div className="produce">{data.produce}</div>
        <div className={gain ? ("gain flow") : ("flow")}>
          {gain ? (<span>SELLING</span>) : (<span>BUYING</span>)}
        </div>
      </div>
    </div>
  );
}

export default SmartMeter;
