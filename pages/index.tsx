import type { NextPage } from 'next'
import Head from 'next/head'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useProvider, useContract, useContractRead, usePrepareContractWrite, useWaitForTransaction} from 'wagmi';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { SHXContractABI } from '../contract/SHXCertificateAbi';

const Home: NextPage = () => {
  const { address, isConnecting, isDisconnected, isConnected } = useAccount()
  const provider = useProvider()
  const router = useRouter()
  
  // TODO: fix process.env import
  const minterRole = '0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6'
  const contractAddress =  '0x7233b5359da9b578b4c5352a3c4fc49392e03650' //process.env.SHX_CERT_CONTRACT_ADDRESS 
  

  const [isMinter, setIsMinter] = useState(false);

  const { data, isSuccess, isError, isLoading, status } = useContractRead({
    address: contractAddress,
    abi: SHXContractABI,
    functionName: 'hasRole',
    args: [minterRole, address],
    onSuccess(data) {
        setIsMinter(data)
      console.log(`Address has Minter Role? ----> ${data}`)
    },
    onError(error) {
      console.log('Error', error)
    }
  })

  return (
    <div>
      <Head>
        <title>Sheinix Academy NFT Minter</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="absolute top-0 right-0 h-16 pt-6 pr-6">
        <ConnectButton label="Sign In" accountStatus={{smallScreen: 'avatar',largeScreen: 'full',}}/>
      </div>

      <div>{isConnected && `Account ${address} is connected`}</div>
      <div>{`status: ${status}`}</div>
      
      <div>{`is Minter: ${isMinter}`}</div>
     
      <div>{isConnected && isMinter}
        <div>
            <h1> We can start minting now...</h1>
        </div> 
      </div>
     
    </div>
  );
};

export default Home;
