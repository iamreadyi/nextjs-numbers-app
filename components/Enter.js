import { useWeb3Contract } from "react-moralis";
import abi from "../constants/abi.json";
import abitok from "../constants/abitok.json";
import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import { useNotification } from "web3uikit";
import { ethers, BigNumber, utils } from "ethers";

export default function NumbersEntrance() {
  const [number, setNumber] = useState("");
  const [numPlayer, setNumPlayer] = useState("");
  const [randomNumber, setRandomNumber] = useState("");
  const [ticketCount, setTicketCount] = useState("");
  const [playerAddress, setPlayerAddress] = useState("");
  const [playersAndNumbers, setPlayersAndNumbers] = useState([]);

  const dispatch = useNotification();

  const { isWeb3Enabled, chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);

  const numbersAddress =
    chainId == 4 ? "0x424E521Ef44e480C6C7a3D145Fc98b789106F64a" : null;

  const tokenAddress =
    chainId == 4 ? "0x67B784Bd5C986686A1fD78a2ffF192866D61C6ee" : null;

  const approveAmount = ethers.utils.parseEther("100");

  const { runContractFunction: approve } = useWeb3Contract({
    abi: abitok.abi,
    contractAddress: tokenAddress,
    functionName: "approve",
    params: { spender: numbersAddress, amount: approveAmount },
  });
  const { runContractFunction: getNumPlayers } = useWeb3Contract({
    abi: abi.abi,
    contractAddress: numbersAddress,
    functionName: "getNumPlayers",
    params: {},
  });

  const {
    runContractFunction: buyTicket,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: abi.abi,
    contractAddress: numbersAddress,
    functionName: "buyTicket",
    params: { number: number },
  });

  const { runContractFunction: numsAndAddresses } = useWeb3Contract({
    abi: abi.abi,
    contractAddress: numbersAddress,
    functionName: "numsAndAddresses",
    params: {},
  });

  const { runContractFunction: getTicketCount } = useWeb3Contract({
    abi: abi.abi,
    contractAddress: numbersAddress,
    functionName: "getTicketCount",
    params: {},
  });

  const { runContractFunction: getRandomNum } = useWeb3Contract({
    abi: abi.abi,
    contractAddress: numbersAddress,
    functionName: "getRandomNum",
    params: {},
  });

  const handleSuccess = async function (tx) {
    await tx.wait(1);
    console.log(tx);
    handleNewNotification(tx);
    updateUI();
  };

  const handleNewNotification = function () {
    dispatch({
      type: "info",
      message: "Transaction complete",
      title: "Tx Notifiaction",
      position: "topR",
      icon: "bell",
    });
  };

  let playersAndNumbersObj = [];
  let myArray = [];

  async function randomNum() {
    const rand = await getRandomNum();
    setRandomNumber(rand.toString());
  }

  async function numAndAddress() {
    const [nums, addresses] = await numsAndAddresses();
    let z = 0;
    let holder = [];

    for (let i = 0; i < addresses.length; i++) {
      for (let j = 0; j < addresses.length; j++) {
        holder[j] = nums[z];
        z++;
      }

      playersAndNumbersObj.push({
        address: addresses[i],
        numbers: holder.toString(),
      });
    }

    myArray = playersAndNumbersObj.filter(
      (element) => element.address != 0x0000000000000000000000000000000000000000
    );
    setPlayersAndNumbers(myArray);
  }

  async function updateUI() {
    const numPlayersFromCall = (await getNumPlayers()).toString();
    const ticketCountFromCall = (await getTicketCount()).toString();
    setNumPlayer(numPlayersFromCall);
    setTicketCount(ticketCountFromCall);
    randomNum();
    numAndAddress();
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled, playersAndNumbers]);

  return (
    <div className="p-5">
      {numbersAddress && tokenAddress ? (
        <div>
          <div>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
              onClick={async function () {
                await approve({
                  onSuccess: handleSuccess,
                  onError: (error) => console.log(error),
                });
              }}
            >
              Approve NUMBERS for 100 KT
            </button>
          </div>

          <div>
            <input
              className="py-2 px-4 rounded ml-auto border-b-8"
              type="number"
              placeholder="Buy ticket"
              onChange={(e) => setNumber(e.target.value)}
            />
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
              onClick={async function () {
                await buyTicket({
                  onSuccess: handleSuccess,
                  onError: (error) => console.log(error),
                });
              }}
              disabled={isLoading || isFetching}
            >
              {isLoading || isFetching ? (
                <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
              ) : (
                "Buy Ticket"
              )}
            </button>
            <div>Players: {numPlayer}</div>
            <div>Ticket Count: {ticketCount}</div>
            <div>Previous Random Number: {randomNumber}</div>
          </div>
          <div>
            {playersAndNumbers.map((player, index) => {
              return (
                <div key={index}>
                  <div>Address: {player.address}</div>
                  <div>Address Numbers: {player.numbers}</div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div>
          No numbers address detected, change network or connect wallet.
        </div>
      )}
    </div>
  );
}
