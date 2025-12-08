/**
 * EigenLayer Core Protocol Contracts
 * All addresses are PROXY addresses, not implementation addresses
 * Source: https://github.com/Layr-Labs/eigenlayer-contracts
 */
const EIGEN_CONTRACTS = {
  mainnet: {
    // Core Protocol Contracts
    delegationManager: "0x39053D51B77DC0d36036Fc1fCc8Cb819df8Ef37A",
    strategyManager: "0x858646372CC42E1A627fcE94aa7A7033e7CF075A",
    eigenPodManager: "0x91E677b07F7AF907ec9a428aafA9fc14a0d3A338",
    avsDirectory: "0x135dda560e946695d6f155dacafc6f1f25c1f5af",
    rewardsCoordinator: "0x7750d328b314EfFa365A0402CcfD489B80B0adda",
    permissionController: "0x25E5F8B1E7aDf44518d35D5B2271f114e081f0E5",
    allocationManager: "0x948a420b8CC1d6BFd0B6087C2E7c344a2CD0bc39",

    // Strategy Contracts
    strategyFactory: "0x5e4C39Ad7A3E881585e383dB9827EB4811f6F647",
    strategyBase: "0x0ed6703C298d28aE0878d1b28e88cA87F9662fE9", // Beacon proxy

    // Token Contracts
    eigenToken: "0xec53bf9167f50cdeb3ae105f56099aaab9061f83",
    backingEigen: "0x83E9115d334D248Ce39a6f36144aEaB5b3456e75",
    eigenStrategy: "0xaCB55C530Acdb2849e6d4f36992Cd8c9D50ED8F7",

    // EigenPods
    eigenPodBeacon: "0x5a2a4F2F3C18f09179B6703e63D9eDD165909073",

    // AVS Contracts
    releaseManager: "0xeDA3CAd031c0cf367cF3f517Ee0DC98F9bA80C8F",
    taskMailbox: "0x132b466d9d5723531F68797519DfED701aC2C749",

    // Multichain - Source
    crossChainRegistry: "0x9376A5863F2193cdE13e1aB7c678F22554E2Ea2b",
    keyRegistrar: "0x54f4bC6bDEbe479173a2bbDc31dD7178408A57A4",

    // Multichain - Destination
    operatorTableUpdater: "0x5557E1fE3068A1e823cE5Dcd052c6C352E2617B5",
    ecdsaCertificateVerifier: "0xd0930ee96D07de4F9d493c259232222e46B6EC25",
    bn254CertificateVerifier: "0x3F55654b2b2b86bB11bE2f72657f9C33bf88120A",

    // Special Addresses
    beaconChainETH: "0xbeaC0eeEeeeeEEeEeEEEEeeEEeEeeeEeeEEBEaC0", // Not a real contract
  },
  sepolia: {
    // Core Protocol Contracts
    delegationManager: "0xD4A7E1Bd8015057293f0D0A557088c286942e84b",
    strategyManager: "0x2E3D6c0744b10eb0A4e6F679F71554a39Ec47a5D",
    eigenPodManager: "0x56BfEb94879F4543E756d26103976c567256034a",
    avsDirectory: "0xa789c91ECDdae96865913130B786140Ee17aF545",
    rewardsCoordinator: "0x5ae8152fb88c26ff9ca5C014c94fca3c68029349",
    allocationManager: "0x42583067658071247ec8CE0A516A58f682002d07",
    permissionController: "0x44632dfBdCb6D3E21EF613B0ca8A6A0c618F5a37",

    // Strategy Contracts
    strategyFactory: "0x066cF95c1bf0927124DFB8B02B401bc23A79730D",
    strategyBase: "0x427e627Bc7E83cac0f84337d3Ad94230C32697D3", // Beacon proxy
    stETHStrategy: "0x8b29d91e67b013e855EaFe0ad704aC4Ab086a574",
    wethStrategy: "0x424246eF71b01ee33aA33aC590fd9a0855F5eFbc",

    // Token Contracts
    eigenToken: "0x0011FA2c512063C495f77296Af8d195F33A8Dd38",
    backingEigen: "0xc5B857A92245f64e9D90cCc5b096Db82eB77eB5c",
    eigenStrategy: "0x8E93249a6C37a32024756aaBd813E6139b17D1d5",

    // EigenPods (PAUSED on Sepolia)
    eigenPodBeacon: "0x0e19E56E41D42137d00dD4f51EC2F613E50cAcf4",

    // AVS Contracts
    releaseManager: "0x59c8D715DCa616e032B744a753C017c9f3E16bf4",
    taskMailbox: "0xB99CC53e8db7018f557606C2a5B066527bF96b26",

    // Multichain - Source
    crossChainRegistry: "0x287381B1570d9048c4B4C7EC94d21dDb8Aa1352a",
    keyRegistrar: "0xA4dB30D08d8bbcA00D40600bee9F029984dB162a",

    // Multichain - Destination
    operatorTableUpdater: "0xB02A15c6Bd0882b35e9936A9579f35FB26E11476",
    ecdsaCertificateVerifier: "0xb3Cd1A457dEa9A9A6F6406c6419B1c326670A96F",
    bn254CertificateVerifier: "0xff58A373c18268F483C1F5cA03Cf885c0C43373a",

    // Special Addresses
    beaconChainETH: "0xbeaC0eeEeeeeEEeEeEEEEeeEEeEeeeEeeEEBEaC0", // Not a real contract
  },
  base: {
    // Multichain - Destination (Base only supports task verification, not core protocol)
    operatorTableUpdater: "0x5557E1fE3068A1e823cE5Dcd052c6C352E2617B5",
    ecdsaCertificateVerifier: "0xd0930ee96D07de4F9d493c259232222e46B6EC25",
    bn254CertificateVerifier: "0x3F55654b2b2b86bB11bE2f72657f9C33bf88120A",
    taskMailbox: "0x132b466d9d5723531F68797519DfED701aC2C749",
  },
  "base-sepolia": {
    // Multichain - Destination (Base Sepolia only supports task verification)
    operatorTableUpdater: "0xB02A15c6Bd0882b35e9936A9579f35FB26E11476",
    ecdsaCertificateVerifier: "0xb3Cd1A457dEa9A9A6F6406c6419B1c326670A96F",
    bn254CertificateVerifier: "0xff58A373c18268F483C1F5cA03Cf885c0C43373a",
    taskMailbox: "0xB99CC53e8db7018f557606C2a5B066527bF96b26",
  },
  hoodi: {
    // Core Protocol Contracts
    delegationManager: "0x867837a9722C512e0862d8c2E15b8bE220E8b87d",
    strategyManager: "0xeE45e76ddbEDdA2918b8C7E3035cd37Eab3b5D41",
    eigenPodManager: "0xcd1442415Fc5C29Aa848A49d2e232720BE07976c",
    avsDirectory: "0xD58f6844f79eB1fbd9f7091d05f7cb30d3363926",
    rewardsCoordinator: "0x29e8572678e0c272350aa0b4B8f304E47EBcd5e7",
    allocationManager: "0x95a7431400F362F3647a69535C5666cA0133CAA0",
    permissionController: "0xdcCF401fD121d8C542E96BC1d0078884422aFAD2",

    // Strategy Contracts
    strategyFactory: "0xfB7d94501E4d4ACC264833Ef4ede70a11517422B",
    strategyBase: "0x6d28cEC1659BC3a9BC814c3EFc1412878B406579",
    stETHStrategy: "0xf8a1a66130d614c7360e868576d5e59203475fe0",
    wethStrategy: "0x24579aD4fe83aC53546E5c2D3dF5F85D6383420d",

    // Token Contracts
    eigenToken: "0x8ae2520954db7D80D66835cB71E692835bbA45bf",
    backingEigen: "0x6e60888132Cc7e637488379B4B40c42b3751f63a",
    eigenStrategy: "0xB27b10291DBFE6576d17afF3e251c954Ae14f1D3",

    // EigenPods
    eigenPodBeacon: "0x5e1577f8efB21b229cD5Eb4C5Aa3d6C4b228f650",

    // Special Addresses
    beaconChainETH: "0xbeaC0eeEeeeeEEeEeEEEEeeEEeEeeeEeeEEBEaC0", // Not a real contract
  },
} as const;

export default EIGEN_CONTRACTS;
