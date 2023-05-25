import React, { useState, useEffect } from 'react';

function Bill() {
  //electra12lhecv88myvrmgv92syj782dxjfsnjjg3lzvv
  const [wallet, setWallet] = useState("electra12lhecv88myvrmgv92syj782dxjfsnjjg3lzvv7");
  const [data, setData] = useState([]);
  const [cdata, setCdata] = useState({});
  const [walletl, setWalletL] = useState("Factory");
  const [swallet, setSWallet] = useState(false);
  const [gain, setGain] = useState(false);

  const cycleurl = "http://electra.alkia.net:1317/electra/meter/currentcycle_id";
  const producerurl = "http://electra.alkia.net:1317/electra/meter/getproducerbill/" + wallet + "/";
  const customerurl = "http://electra.alkia.net:1317/electra/meter/getcustomerbill/" + wallet + "/";

  const handleWalletChange = (event) => {
    setWallet(event.target.value);
    setData([]);
  };


  const handleWalletChangeL = (event) => {
    setWalletL(event.target.value);
    setWallet(wallet);
    console.log(event.target.value, walletl);
  };


  const handleSWalletChange = () => {
    setSWallet(!swallet);
    console.log(swallet);
  };


  useEffect(() => {
    const fetchCData = async (purl, curl, cycleC) => {
      console.log(purl + cycleC, curl + cycleC);
      const responseC = await fetch(curl + "/" + cycleC);
      const responseP = await fetch(purl + "/" + cycleC);
      const datasrc2 = await responseC.json();
      const datasrc = await responseP.json();
      console.log(datasrc, datasrc2);
      var datanew = cdata;
      datanew[cycleC].producerbillinglines = [0]
      datanew[cycleC].customerbillinglines = [0];
      if (typeof datasrc.customerbillinglines !== "undefined") {
        var arr = [];
        datasrc.customerbillinglines.forEach(element => {
          var line = JSON.parse(element);
          arr.push("Contract:"+line.billContractID +" - Address:"+line.customerDeviceID+" - Unit Price:"+line.lineWhPrice+" - Total Charges:"+line.lineWhTotalPrice); 
      });
      datanew[cycleC].customerbillinglines = arr; 
    }

      if (typeof datasrc2.producerbillinglines !== 'undefined') {
        var arr = [];
        datasrc2.producerbillinglines.forEach(element => {
          var line = JSON.parse(element);
          arr.push("Contract:"+line.billContractID +" - Address:"+line.customerDeviceID+" - Unit Price:"+line.lineWhPrice+" - Total Charges:"+line.lineWhTotalPrice); 
        });
        datanew[cycleC].producerbillinglines = arr; //datasrc2.producerbillinglines;
      }

      console.log(datanew[cycleC]);

      setCdata(datanew);
    }
    const fetchData = async () => {

      try {

        //get current ID
        const response = await fetch(cycleurl);
        const datasrc = await response.json();
        const sdate = new Date(datasrc.begin * 1000);
        const edate = new Date(datasrc.end * 1000);

        const begind = sdate.toLocaleDateString(); // Get the date in a readable format
        const begint = sdate.toLocaleTimeString();


        const endd = edate.toLocaleDateString(); // Get the date in a readable format
        const endt = edate.toLocaleTimeString();

        // Append new record to existing data

        setData(prevData => {
          const filteredData = prevData.filter(item => item.cid !== datasrc.cycleID);

          if (filteredData.length > 0 || prevData.length == 0) {
            console.log(customerurl + datasrc.cycleID);
            var datanew = cdata;
            datanew[datasrc.cycleID] = { "producerbillinglines": [], "customerbillinglines": [] };
            setCdata(datanew);
            fetchCData(customerurl, producerurl, datasrc.cycleID);


          }
          return [
            {

              startd: begind,
              startt: begint,
              endd: endd,
              endt: endt,
              cid: datasrc.cycleID,
              in: datasrc.whin,
              out: datasrc.whout,
              cur: datasrc.curency
            },
            ...filteredData.slice(0, 3)
          ];


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
    <div className='Bill'>
      <div > Bill Cycles
        {swallet ? (
          <div className="address-input">
            <label>Wallet Label</label><br />
            <input placeholder="Wallet Label" onChange={handleWalletChangeL} value={walletl} />
            <br></br><label>Wallet Address</label><br />

            <input placeholder="Wallet Address" onChange={handleWalletChange} onBlur={handleSWalletChange} value={wallet} /></div>
        ) : (
          <div class="walletid"><div onClick={handleSWalletChange}> <sup>[ {walletl} ]</sup> </div></div>
        )}
        <table>
          <thead>
            <tr>
              <th>Starting Period</th>
              <th>Ending Period</th>
              <th>Billing Cycle ID</th>
              <th>Inflow</th>
              <th>Outflow</th>
              <th>Currency</th>
            </tr>

          </thead>
          {data.map((record, index) => (
            <tbody key={index}>
              <tr>
                <td>{record.startt}<br /><sub>{record.startd}</sub></td>
                <td>{record.startt}<br /><sub>{record.startd}</sub></td>
                <td>{record.cid}</td>
                <td>{record.in}</td>
                <td>{record.out}</td>
                <td>{record.cur}</td>
              </tr>
              <tr>
                <td colspan="6">

                {cdata[record.cid].customerbillinglines.length>0? (<h4>Receivable</h4>):('')}

                  {cdata[record.cid].customerbillinglines}

                  {cdata[record.cid].producerbillinglines.length>0? (<h4>Payable</h4>):('')}

                  {cdata[record.cid].producerbillinglines}
                </td></tr>

            </tbody>
          ))}

        </table>

      </div>
    </div>
  );
}

export default Bill;
