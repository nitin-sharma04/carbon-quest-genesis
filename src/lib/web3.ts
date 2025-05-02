
import { ethers } from "ethers";
import { toast } from "react-hot-toast";

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: {
    trait_type: string;
    value: string;
  }[];
}

const CONTRACT_ADDRESS = "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7"; // Replace with actual deployed contract address
const CONTRACT_ABI = [
  // ERC721 - Basic functions
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function balanceOf(address owner) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function transferFrom(address from, address to, uint256 tokenId)",
  "function approve(address to, uint256 tokenId)",
  "function getApproved(uint256 tokenId) view returns (address)",
  "function isApprovedForAll(address owner, address operator) view returns (bool)",
  "function setApprovalForAll(address operator, bool _approved)",
  // Custom functions
  "function mintNFT(address recipient, string memory tokenURI) returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
  "function totalSupply() view returns (uint256)",
  "function tokenByIndex(uint256 index) view returns (uint256)",
  // Events
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
  "event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)",
  "event ApprovalForAll(address indexed owner, address indexed operator, bool approved)",
];

export async function getProvider() {
  // Check if window.ethereum is available (MetaMask is installed)
  if (window.ethereum) {
    try {
      return new ethers.providers.Web3Provider(window.ethereum);
    } catch (error) {
      console.error("Error creating Web3Provider:", error);
      toast.error("Failed to connect to Ethereum network");
      return null;
    }
  } else {
    toast.error("Please install MetaMask to use this application");
    return null;
  }
}

export async function connectWallet() {
  try {
    const provider = await getProvider();
    if (!provider) return null;
    
    // Request account access
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    
    // Check if connected to Sepolia
    const network = await provider.getNetwork();
    if (network.chainId !== 11155111) { // Sepolia chainId
      toast.error("Please connect to Sepolia Testnet");
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0xaa36a7" }], // Sepolia chainId in hex
        });
      } catch (switchError) {
        toast.error("Failed to switch to Sepolia network");
        return null;
      }
    }
    
    toast.success("Wallet connected successfully!");
    return { provider, signer, address };
  } catch (error) {
    console.error("Error connecting wallet:", error);
    toast.error("Failed to connect wallet");
    return null;
  }
}

export function getContract(signerOrProvider) {
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signerOrProvider);
}

export async function mintNFT(recipient: string, tokenURI: string) {
  try {
    const connection = await connectWallet();
    if (!connection) return null;
    
    const contract = getContract(connection.signer);
    const tx = await contract.mintNFT(recipient, tokenURI);
    
    toast.loading("Minting your NFT...");
    await tx.wait();
    
    toast.dismiss();
    toast.success("NFT minted successfully!");
    
    return tx;
  } catch (error) {
    console.error("Error minting NFT:", error);
    toast.error("Failed to mint NFT");
    return null;
  }
}

export async function getUserNFTs(address: string) {
  try {
    const connection = await connectWallet();
    if (!connection) return [];
    
    const contract = getContract(connection.provider);
    const balance = await contract.balanceOf(address);
    
    const tokens = [];
    for (let i = 0; i < balance; i++) {
      const tokenId = await contract.tokenOfOwnerByIndex(address, i);
      const tokenURI = await contract.tokenURI(tokenId);
      
      // Fetch metadata from IPFS gateway
      let metadata: NFTMetadata;
      try {
        const ipfsGatewayURL = tokenURI.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
        const response = await fetch(ipfsGatewayURL);
        metadata = await response.json();
      } catch (error) {
        console.error("Error fetching NFT metadata:", error);
        metadata = {
          name: `Carbon NFT #${tokenId}`,
          description: "Carbon offset NFT",
          image: "", // Placeholder
          attributes: []
        };
      }
      
      tokens.push({
        id: tokenId.toString(),
        uri: tokenURI,
        metadata
      });
    }
    
    return tokens;
  } catch (error) {
    console.error("Error fetching user NFTs:", error);
    toast.error("Failed to fetch your NFTs");
    return [];
  }
}
