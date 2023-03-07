import { useEffect, useState } from "react";

const PixelABTest = ({ isSyncing, isConnected, alias }) => {
  const [loop, setLoop] = useState(null);
  const [image, setImage] = useState("");

  useEffect(() => {
    let tokenRandom = 0;

    if (isSyncing) {
      setLoop(
        setInterval(function () {
          tokenRandom++;
          setImage(`http://localhost:3001/${alias}.png?token=${tokenRandom}`);
        }, 1000)
      );
    } else {
      console.log("false");
      clearInterval(loop);
    }
  }, [isSyncing]);

  return (
    <div>
      {!isConnected && isSyncing ? (
        <p>
          <img
            src={image}
            alt="qr code"
            style={{ border: "10px solid white" }}
          />
        </p>
      ) : (
        <p>Flase...</p>
      )}
    </div>
  );
};

export default PixelABTest;
