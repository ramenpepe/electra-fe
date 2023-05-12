import React, { useState, useEffect } from 'react';

function Trx() {
  const [wallet, setWallet] = useState("electra16n5tnkck6rcg7gxmalc057daputvac5pzjeal9");
  const [data, setData] = useState([]);

  const handleWalletChange = (event) => {
    setWallet(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://electra.alkia.net:26657/status?`);
        const json = await response.json();
        const datasrc = json.result.sync_info;

        // Append new record to existing data
        setData(prevData => [
          {
            time: datasrc.latest_block_time,
            height: datasrc.latest_block_height,
            hash: datasrc.latest_block_hash
          },
          ...prevData.slice(0, 29) // Limit data to 30 entries
        ]);
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
    <div className='Trx'>
      Block Transactions<br />
      <div >

        <table>
          <thead>
            <tr>
              <th>Block Time</th>
              <th>Height</th>
              <th>Hash</th>
            </tr>
          </thead>
          <tbody>
            {data.map((record, index) => (
              <tr key={index}>
                <td>{record.time}</td>
                <td>{record.height}</td>
                <td>{record.hash}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}

export default Trx;
