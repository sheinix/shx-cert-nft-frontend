import React, {useState} from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import {ethers} from 'ethers';
import {useNetwork, usePrepareContractWrite, useContractWrite, useWaitForTransaction} from 'wagmi';
import { SHXContractABI } from '../contract/SHXCertificateAbi';

export default function MintingForm() {
    
    const contractAddress = '0x7233B5359DA9B578b4c5352a3C4fc49392E03650'
    const [courseId, setCourseId] = useState('0');
    const [studentName, setStudentName] = useState('');
    const [studentAddress, setStudentAddress] = useState('');
    const [tokenURI, setTokenURI] = useState('');
    const { chain } = useNetwork();
    
    const handleChangeCourseId = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCourseId(event.target.value);
    };

    const handleChangeStudentName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStudentName(event.target.value);
    };

    const handleChangeTokenURI = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTokenURI(event.target.value);
    };

    const handleChangeStudentAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStudentAddress(event.target.value); 
    };

    const isFormValid = () => {
    if (
      (Number(courseId) >= 0 && Number(courseId) <=3) &&
      studentName.length > 0 &&
      tokenURI.length > 0
    ) {
      return true;
    }

    return false;
  };

  const {config} = usePrepareContractWrite({
    address: contractAddress,
    abi: SHXContractABI,
    functionName: 'mint',
    args: [
      studentName,
      studentAddress,
      courseId,
      tokenURI
    ],
    enabled: isFormValid(),
  });

  // @ts-ignore
  const {data, write} = useContractWrite(config);

  const {isLoading, isSuccess} = useWaitForTransaction({
    hash: data?.hash,
  });

  return (
    <Box
      component="form"
      onSubmit={e => {
        e.preventDefault();
        write?.();
      }}
      sx={{
        width: 'fit-content',
        borderRadius: '10px',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        background: 'white',
        boxShadow: '0px 6px 10px rgba(0, 0, 0, 0.05)',
        '& .MuiTextField-root': {m: 1},
      }}
      noValidate
      autoComplete="off">
      <Typography variant="h3" color="primary">
        Mint Academy Cert NFT
      </Typography>
      
      <div>
        <TextField
          id="courseId"
          label="Course Id"
          variant="filled"
          value={courseId}
          onChange={handleChangeCourseId}
        />
      </div>
      <div>
        <TextField
          fullWidth
          id="studentName"
          label="Student Name"
          variant="filled"
          value={studentName}
          onChange={handleChangeStudentName}
        />
      </div>
      <div>
        <TextField
          id="studentAddress"
          label="Student Address"
          variant="filled"
          value={studentAddress}
          onChange={handleChangeStudentAddress}
        /> 
      </div>
      <div>
        <div style={{display: 'flex', flexDirection: 'column'}}>
        <TextField
          id="tokenURI"
          label="Set Token URI"
          variant="filled"
          value={tokenURI}
          onChange={handleChangeTokenURI}
        />
        </div>
      </div>
      <div style={{marginTop: '1rem'}}>
        <Button variant="outlined" type="submit" disabled={!write || isLoading}>
          {isLoading ? 'Minting NFT...' : 'Mint NFT'}
        </Button>
      </div>

      {isSuccess && (
        <div>
          Successfully Minted!
          <div>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href={`${chain?.blockExplorers?.etherscan?.url}/tx/${data?.hash}`}>
              Tx on Polygonscan
            </Link>
          </div>
        </div>
      )}
    </Box>
  );
}
