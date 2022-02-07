import { useEffect, useState } from "react";
import "./App.css";
import ColorCard from "./components/ColorCard";
import { useWeb3React } from "@web3-react/core";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import connectors from "./connectors.ts";
import moralisConnector from "./moralisConnector";
import buttonImageDefault from "./assets/login-default.png";
import { uauth } from "./connectors";

function App() {
  const [isStarted, setIsStarted] = useState(false);

  const [inPlay, setInPlay] = useState(false);

  const [isLost, setIsLost] = useState(false);

  const [flashColor, setFlashColor] = useState("");

  const [pressed, setPressed] = useState("");

  const [level, setLevel] = useState(0);

  const [imagesArray, setNftArray] = useState([]);

  const [randomChosenImages, setRandomChosenImages] = useState([]);

  const [userDomain, setUserDomain] = useState("");

  const initialGameState = {
    gamePattern: [],
    userClickedPattern: [],
    buttons: ["red", "blue", "yellow", "green"],
  };

  const [currentGameState, setCurrentGameState] = useState(initialGameState);

  onClick = (e, data) => {
    if (!inPlay && isStarted) {
      currentGameState.userClickedPattern.push(e.target.id);
      setPressed(e.target.id);
      setTimeout(function () {
        setPressed("");
      }, 100);
      checkAnswer(currentGameState.userClickedPattern.length - 1);
    }
  };

  function checkAnswer(currentLevel) {
    if (isStarted && !isLost) {
      if (
        currentGameState.gamePattern[currentLevel] ==
        currentGameState.userClickedPattern[currentLevel]
      ) {
        if (
          currentGameState.gamePattern.length ===
          currentGameState.userClickedPattern.length
        ) {
          nextSequence();
          currentGameState.userClickedPattern = [];
        }
      } else {
        setCurrentGameState(initialGameState);
        setIsLost(true);
        setLevel(0);
        setIsStarted(false);
      }
    }
  }

  function onClick() { }

  function handleStart() {
    setIsStarted(true);
  }

  function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function nextSequence() {
    if (isStarted) {
      setInPlay(true);
      setLevel(level + 1);
      await timeout(1000);
      let randomNumber = Math.floor(Math.random() * 4);
      let randomChosenColor = currentGameState.buttons[randomNumber];
      currentGameState.gamePattern.push(randomChosenColor);
      setFlashColor(randomChosenColor);
      await timeout(500);
      setFlashColor("");
      setInPlay(false);
      await timeout(500);
    }
  }

  useEffect(() => {
    if (isStarted) {
      setLevel(0);
      setIsLost(false);
      nextSequence();
    } else {
    }
  }, [isStarted]);

  const { active, account, activate, deactivate } = useWeb3React();

  function createConnectHandler(connectorId) {
    return async () => {
      try {
        const connector = connectors[connectorId];

        if (connector.walletConnectProvider?.wc?.uri) {
          connector.walletConnectProvider = undefined;
        }

        await activate(connector);
        const account = await connector.getAccount();

        setUserDomain(connector.uauth.store.storage["uauth-default-username"]);
        const NFTs = await moralisConnector.moralisStartAndGetNFTs(account);
        const NftArray = NFTs.result;
        for (let i = 0; i < NftArray.length; i++) {
          const metaDataJson = JSON.parse(NftArray[i].metadata);
          if (metaDataJson.image) {
            imagesArray.push(metaDataJson.image);
          }
        }
        for (let i = 0; i < 4; i++) {
          randomChosenImages.push(getRandomNftImage());
        }
      } catch (error) {
        console.error(error);
      }
    };
  }

  async function handleDisconnect() {
    try {
      deactivate();
    } catch (error) {
      console.error(error);
    }
  }

  function getRandomNftImage() {
    if (imagesArray.length !== 0) {
      let indexImage = Math.floor(Math.random() * imagesArray.length);
      let imageUrl = imagesArray[indexImage];
      imagesArray.splice(indexImage, 1);
      return imageUrl;
    }
  }

  if (active) {
    return (
      <div className="App">
        <div className="container">
          <div className="wrapper">
            <h1 className="welcome-text">{userDomain}!</h1>
            <div className="link_wrapper" onClick={handleDisconnect}>
              <a id="btn-out" href="#">
                Sign out
              </a>
              <div class="icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 268.832 268.832"
                >
                  <path d="M265.17 125.577l-80-80c-4.88-4.88-12.796-4.88-17.677 0-4.882 4.882-4.882 12.796 0 17.678l58.66 58.66H12.5c-6.903 0-12.5 5.598-12.5 12.5 0 6.903 5.597 12.5 12.5 12.5h213.654l-58.66 58.662c-4.88 4.882-4.88 12.796 0 17.678 2.44 2.44 5.64 3.66 8.84 3.66s6.398-1.22 8.84-3.66l79.997-80c4.883-4.882 4.883-12.796 0-17.678z" />
                </svg>
              </div>
            </div>
          </div>

          <h1 id="level-title">
            {level === 0 ? "Press start to play!" : `Level ${level}`}
          </h1>
          <ColorCard
            onClick={onClick}
            color={"red"}
            flash={flashColor === "red"}
            pressed={pressed === "red"}
            nftUrl={randomChosenImages[0]}
          ></ColorCard>

          <ColorCard
            onClick={onClick}
            color={"blue"}
            flash={flashColor === "blue"}
            pressed={pressed === "blue"}
            nftUrl={randomChosenImages[1]}
          ></ColorCard>
          <br />
          <ColorCard
            onClick={onClick}
            color={"yellow"}
            flash={flashColor === "yellow"}
            pressed={pressed === "yellow"}
            nftUrl={randomChosenImages[2]}
          ></ColorCard>
          <ColorCard
            onClick={onClick}
            color={"green"}
            flash={flashColor === "green"}
            pressed={pressed === "green"}
            nftUrl={randomChosenImages[3]}
          ></ColorCard>
          <br />
          {isLost && (
            <div className="game-lost-overlay">
              <div className="overlay-content">
                <h1 id="level-title">Game Over!</h1>
                <button className="glow-on-hover" onClick={handleStart}>
                  Try Again
                </button>
              </div>
            </div>
          )}
          {!isStarted && !isLost && (
            <button className="glow-on-hover" onClick={handleStart}>
              Start game!
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="App" id="login-page">
        <div className="container-login">
          <h1 className="title-login">
            Welcome to Simon Says! <br /> NFT edition!
          </h1>
          <img
            className="login-button login-ripple"
            onClick={createConnectHandler(Object.keys(connectors)[2])}
            src={buttonImageDefault}
          />
        </div>
      </div>
    </>
  );
}

export default App;
