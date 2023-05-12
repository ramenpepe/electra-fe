import React, { useState, useEffect } from 'react';

function Weather() {
  const [data, setData] = useState("one");
  // /  const [weatheri, setWeatheri] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://electra.alkia.net:1317/electra/meter/listrecordings_100/electra12lhecv88myvrmgv92syj782dxjfsnjjg3lzvv7/true`);

        if (typeof response !== "undefined") {
          const json = await response.json();
          var maxmi = JSON.parse(json.meterreadings[json.meterreadings.length - 1]).maxmi;
          console.log(maxmi);
          maxmi = parseInt(maxmi);
          console.log(maxmi);

          switch (maxmi) {
            case 1:
              setData("one");
              break;
            case 2:
              setData("two");
              break;
            case 3:
              setData("three");
              break;
            case 4:
              setData("four");
              break;
            default:
              setData("one");
              break;
          }
        } else {
          console.log("no data feed...", response);
        }
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
  }, []);


  return (
    <div className={data + " weather"}></div>
  );
}

export default Weather;
