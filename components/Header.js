import { ConnectButton } from "web3uikit";

export default function Header() {
  return (
    <div className="p-5 border-b-2 flex flex-row text-3xl">
      <h1 className="py-4 px-4 font-blog text-3xl">
        Decentralized Random Numbers
      </h1>
      <h2 className="py-4 px-4 font-blog">
        Pick a number, wait for random number to be drawn when ticket count is
        5. Numbers closer to random number wins the prize pool.
      </h2>
      <div className="ml-auto py-2 px-4 ">
        <ConnectButton moralisAuth={false} />
      </div>
    </div>
  );
}
