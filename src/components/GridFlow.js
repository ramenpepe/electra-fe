import React, { useState, useEffect } from 'react';

function Bill() {
  const [wallet, setWallet] = useState("electra16n5tnkck6rcg7gxmalc057daputvac5pzjeal9");
  const [data, setData] = useState([]);

  const handleWalletChange = (event) => {
    setWallet(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        //Weather readings using bob's meter, can use weather oracle instead
        const response = await fetch(`http://electra.alkia.net:1317/electra/meter/listrecordings_100/electra16n5tnkck6rcg7gxmalc057daputvac5pzjeal9/true`);

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
            ...filteredData.slice(0, 29)
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
      <div > Bill <br />

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
          <tbody>
            {data.map((record, index) => (
              <tr key={index}>
                <td>{record.startt}<br /><sub>{record.startd}</sub></td>
                <td>{record.startt}<br /><sub>{record.startd}</sub></td>
                <td>{record.cid}</td>
                <td>{record.in}</td>
                <td>{record.out}</td>
                <td>{record.cur}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}

export default Bill;
