import { ConnectButton } from "web3uikit";

export default function Header() {
  return (
    <div className="p-5 border-b-2 flex flex-row text-2xl">
      <h1 className="py-4 px-4 font-blog text-3xl">
        Decentralized Random Numbers
      </h1>
      <h2 className="py-4 px-4 font-blog">
        Pick a number, wait for random number to be drawn when ticket count is
        5. Numbers closer to random number wins the prize pool. Chainlink VRF v2
        is used for random number.
        <div>
          <a
            href="https://rinkeby.etherscan.io/address/0x424E521Ef44e480C6C7a3D145Fc98b789106F64a"
            target="_blank"
            rel="noreferrer"
          >
            Click here to see numbers contract on etherscan
          </a>
        </div>
      </h2>
      <div className="ml-auto py-2 px-4 ">
        <ConnectButton moralisAuth={false} />
        Contracts are on Rinkeby Testnet
        <div>
          <a href="https://rinkebyfaucet.com/" rel="noreferrer" target="_blank">
            Click here for rinkeby faucet
          </a>
        </div>
      </div>
    </div>
  );
}
