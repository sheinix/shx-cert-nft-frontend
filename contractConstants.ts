import SHXCertificateAbi from './contract/SHXCertificateAbi' assert { type: 'JSON' }

export const contractAddress = process.env.SHX_CERT_CONTRACT_ADDRESS
export const contractABI = SHXCertificateAbi
