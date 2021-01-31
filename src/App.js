import React, { useState, useRef, useEffect } from 'react';


const Stock = () => {
  const [messages, setMessages] = useState([]);
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket("wss://ws.finnhub.io?token=bsdqe3frh5r98lqplcq0");
    ws.current.onopen = () => {
      console.log("ws opened");
      ws.current.send(JSON.stringify({'type':'subscribe', 'symbol': 'COINBASE:BTC-USD'}));
    };
    ws.current.onclose = () => console.log("ws closed");

    return () => {
        ws.current.close();
    };
  }, []);

  useEffect(() => {
    if (!ws.current) return;

    ws.current.onmessage = event => {
      if (!ws.current) return;
      let stockData = JSON.parse(event.data);
      stockData = stockData.data;
      if (!stockData){
        setMessages(prev => [...prev]);
        return;
      }
      console.log('Message from server ', stockData[0]);
      setMessages([stockData[0].s, stockData[0].p]);
      //return () => ws.current.close();
    };
  },[]);
  return(
  <div>
    <p>{messages[0]}<br/>{messages[1]}</p>
  </div>
  );
};

export default Stock;