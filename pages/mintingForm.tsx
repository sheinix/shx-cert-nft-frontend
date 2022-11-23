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

  
    const isFormValid = () => {
        return (Number(courseId) > 0 && Number(courseId) >= 3 
        && studentName.length > 0) 
        && tokenURI.length > 0 ? true : false 
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
        Setup your own event
      </Typography>
      <div>
        <TextField
          id="prize-amount"
          label="Prize Amount"
          variant="filled"
          value={prizeAmount}
          onChange={handleChange}
        />
      </div>
      <div>
        <TextField
          fullWidth
          id="prize-token-address"
          label="Prize Token Contract Address"
          variant="filled"
          value={prizeTokenAddress}
          onChange={handleChangeAddress}
        />
      </div>
      <div>
        <TextField
          id="first-winner-percentage"
          label="First Winner Percentage"
          variant="filled"
          value={firstWinnerPercentage}
          onChange={handleChangeFirstWinner}
        />
        <TextField
          id="second-winner-percentage"
          label="Second Winner percentage"
          variant="filled"
          value={secondWinnerPercentage}
          onChange={handleChangeSecondWinner}
        />
        <TextField
          id="third-winner-ratio"
          label="Third Winner Percentage"
          variant="filled"
          value={thirdWinnerPercentage}
          onChange={handleChangeThirdWinner}
        />
      </div>

      {/**Voters section**/}
      <div>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <TextField
            id="voters"
            label="List of Voters"
            variant="filled"
            placeholder="0x..abc, 0x...cde, 0x..."
            multiline
            disabled={votersConfirmed}
            value={stringVoters}
            onChange={handleChangeVoters}
          />
        </div>
        <Button
          onClick={convertVotersIntoArray}
          disabled={votersConfirmed || stringVoters.length === 0}>
          Confirm Voters
        </Button>
        <Button onClick={clearVoters}>Clear Voters</Button>
      </div>

      {/**Participants section**/}
      <div>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <TextField
            id="participants"
            label="List of Participants"
            variant="filled"
            multiline
            placeholder="0x..abc, 0x...cde, 0x..."
            disabled={participantsConfirmed}
            value={stringParticipants}
            onChange={handleChangeParticipants}
          />
        </div>
        <Button
          onClick={convertParticipantsIntoArray}
          disabled={participantsConfirmed || stringParticipants.length === 0}>
          Confirm Participants
        </Button>
        <Button onClick={clearParticipants}>Clear Participants</Button>
      </div>

      <div style={{marginTop: '1rem'}}>
        <Button variant="outlined" type="submit" disabled={!write || isLoading}>
          {isLoading ? 'Creating event...' : 'Create Event'}
        </Button>
      </div>

      {isSuccess && (
        <div>
          Successfully created your event!
          <div>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href={`${chain?.blockExplorers?.etherscan?.url}/tx/${data?.hash}`}>
              Tx on Etherscan
            </Link>
          </div>
        </div>
      )}
    </Box>
  );
}
