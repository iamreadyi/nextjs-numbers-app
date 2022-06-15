import { useWeb3Contract } from "react-moralis";
import abiex from "../constants/abiex.json";
import abitok from "../constants/abitok.json";
import { useState } from "react";
import { useMoralis } from "react-moralis";
import { ethers, BigNumber } from "ethers";
import { useNotification } from "web3uikit";

export default function Exchange() {
  const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  console.log(`ChainId is ${chainId}`);
  const exchangeAddress =
    chainId == 4 ? "0xF52eDfCC8a199b23a7a6CC8cF726560e8bF7d04D" : null;

  const tokenAddress =
    chainId == 4 ? "0x67B784Bd5C986686A1fD78a2ffF192866D61C6ee" : null;

  const dispatch = useNotification();

  const [buytok, setBuytok] = useState("");
  const [selltok, setSelltok] = useState("");

  const msgVal = (buytok / 100) * 10 ** 18;

  const { runContractFunction: buyToken } = useWeb3Contract({
    abi: abiex.abi,
    contractAddress: exchangeAddress,
    functionName: "buyToken",
    params: {},
    msgValue: msgVal,
  });

  const sellAmount =
    selltok != "" ? ethers.utils.parseEther(selltok.toString()) : 0;

  const approveAmount = ethers.utils.parseEther("100");

  const { runContractFunction: approve } = useWeb3Contract({
    abi: abitok.abi,
    contractAddress: tokenAddress,
    functionName: "approve",
    params: { spender: exchangeAddress, amount: approveAmount },
  });

  const { runContractFunction: sellToken } = useWeb3Contract({
    abi: abiex.abi,
    contractAddress: exchangeAddress,
    functionName: "sellToken",
    params: {
      amountToSell: sellAmount,
    },
  });

  const handleSuccess = async function (tx) {
    await tx.wait(1);
    handleNewNotification(tx);
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
  return (
    <div className="p-5">
      KT Exchange (1 KT = 0.01 ETH) Copy KT address to your wallet to import KT
      <div>KT Address: 0x67B784Bd5C986686A1fD78a2ffF192866D61C6ee</div>
      {exchangeAddress && tokenAddress ? (
        <div>
          <div>
            <input
              className="py-2 px-4 rounded ml-auto border-b-8 p-5"
              type="number"
              placeholder="Buy token"
              onChange={(e) => setBuytok(e.target.value)}
            />
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
              onClick={async function () {
                await buyToken({
                  onSuccess: handleSuccess,
                  onError: (error) => console.log(error),
                });
              }}
            >
              Buy
            </button>
          </div>

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
              Approve exchange to sell
            </button>
          </div>

          <div>
            <input
              className="py-2 px-4 rounded ml-auto border-b-8"
              type="number"
              placeholder="Sell token"
              onChange={(e) => setSelltok(e.target.value)}
            />
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
              onClick={async function () {
                await sellToken({
                  onSuccess: handleSuccess,
                  onError: (error) => console.log(error),
                });
              }}
            >
              Sell
            </button>
          </div>
        </div>
      ) : (
        <div>
          No exchange address detected, change network or connect wallet.
        </div>
      )}
    </div>
  );
}
