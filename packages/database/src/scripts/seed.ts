import "dotenv/config";
import { nanoid } from "nanoid";
import { bulkInsertMonitoredAVS } from "../queries/avs";
import { bulkInsertMonitoredOperators } from "../queries/operators";

// Helper to fetch data from EigenExplorer API
async function fetchFromEigenAPI(endpoint: string) {
  const apiKey = process.env.EIGENEXPLORER_API_KEY;
  if (!apiKey) {
    console.warn(
      "⚠️  EIGENEXPLORER_API_KEY not found. Seeding with addresses only."
    );
    return null;
  }

  try {
    const response = await fetch(`https://api.eigenexplorer.com${endpoint}`, {
      headers: {
        "x-api-token": apiKey,
      },
    });

    if (!response.ok) {
      console.warn(
        `⚠️  API request failed for ${endpoint}: ${response.status}`
      );
      return null;
    }

    return await response.json();
  } catch (error) {
    console.warn(`⚠️  Error fetching from API: ${error}`);
    return null;
  }
}

// Fetch AVS data from API
async function fetchAVSData(address: string, chainId: number) {
  const result = await fetchFromEigenAPI(`/avs/${address}?chainId=${chainId}`);

  if (!result) {
    return null;
  }

  return {
    name: result.metadataName || null,
    description: result.metadataDescription || null,
    metadata: result,
  };
}

// Fetch Operator data from API
async function fetchOperatorData(address: string, chainId: number) {
  const result = await fetchFromEigenAPI(
    `/operators/${address}?chainId=${chainId}`
  );

  if (!result) {
    return null;
  }

  return {
    name: result.metadataName || null,
    description: result.metadataDescription || null,
    metadata: result,
  };
}

// Import addresses from eigen-config (or define here for the seed)
const MAINNET_CHAIN_ID = 1;
const HOLESKY_CHAIN_ID = 17000;

// Mainnet AVS addresses
const mainnetAVSAddresses = [
  "0x0328635ba5ff28476118595234b5b7236b906c0b",
  "0x15f4314d4c5da6e36ec40b3bc2a279685f0d84b2",
  "0x18343aa10e3d2f3a861e5649627324aead987adf",
  "0x1de75eaab2df55d467494a172652579e6fa4540e",
  "0x1f2c296448f692af840843d993ffc0546619dcdb",
  "0x203b9acb40dfbb911f1e39c784eab639418dae04",
  "0x22cac0e6a1465f043428e8aef737b3cb09d0eeda",
  "0x23221c5bb90c7c57ecc1e75513e2e4257673f0ef",
  "0x29b2e51d2bf840116797f8a27e40c05ae3e244d9",
  "0x2d86e90ed40a034c753931ee31b1bd5e1970113d",
  "0x2ef98160ca2f737362ce4948bbd0b1f9c606c2e0",
  "0x328c822874991c31ddf400cd8388027af66270a8",
  "0x0fe4f44bee93503346a3ac9ee5a26b130a5796d6",
  "0x93c4b944d05dfe6df7645a86cd2206016c51564d",
  "0xbeac0eeeeeeeeeeeeeeeeeeeeeeeeeeeeeebeac0",
];

// Holesky AVS addresses
const holeskyAVSAddresses = [
  "0x014a0003b7e61a72c6c77324b45f8b71d28e4f36",
  "0x03c0feef42b293e7613f43dee3d55fec71c49b7a",
  "0x0432116043a6f989b324559d39291e4398462089",
  "0x06ec2873eae3d14db885685a03a1ec2846083509",
  "0x06f129495f7419a7663e9aa73ca8a18b8fda9cd9",
  "0x0861afc305999bfd3028db66145395bdd7299366",
  "0x08b13c05dd7a6f8960000f6c41e4180f920cd86a",
  "0x0dc81307686f143c0050c6ee9a43f4d9f94b6c18",
  "0x0de93e7ee7673a66c54f9580ed2d91387198e928",
  "0x0ebf9c41eaa85afaa5f9dc7df5a5a56d88cc7306",
  "0x0f87d26e30106e97f639238ef3b3a132f0032f88",
  "0x0fb6b02f8482a06cf1d99558576f111abc377932",
];

// Mainnet Operator addresses
const mainnetOperatorAddresses = [
  "0x0000039b2f2ac9e3492a0f805ec7aea9eaee0c25",
  "0x00107cfdeaddc0a3160ed2f6fedd627f313e7b1a",
  "0x002a465ef04284f72f3721ec902bce5eabe5360b",
  "0x0066218a016548da2786c8de6aa1602aab678b37",
  "0x006b988f89579e5842bcd029955dfbfc334b6826",
  "0x009780f12b0632772e3f5440a36d10cc035014ad",
  "0x00cd859c9772d067edc0a8dd2917516841047a2a",
  "0x00d55d96a86a8121affeb0dcce8889b903955b05",
  "0x00e26d8567945a697db1e5c0b4cdea4fd31a0e85",
  "0x01412450d52d5afeda71b91602d3e0d9da5231c7",
  "0x0146f4d9d6041f05b0129dd2a9c3460bfe656665",
  "0x01a7c2568693d65a367fde016b48c63f6673d4dc",
];

// Holesky Operator addresses (subset)
const holeskyOperatorAddresses = [
  "0x0000099f310b19094fbca16bdf7b3bc441ba7875",
  "0x000009df76cd34aa2133900bff2b488d2c2fa4b3",
  "0x0000ea905ffcb21aa98251cfa292cdea347a6416",
  "0x000dba91cdee891ac56f9798f57f563257ea9ec8",
  "0x00123f8be3cdcf0f44f3379d6d78484b903771fe",
  "0x00187ad4a08203bf1b861878f1445576c53ef552",
  "0x0022aae3f95021ce9002e2fd8bbf2d74976301d2",
  "0x0025e06cea8bcadd3145f56d7294f213fc4c537b",
  "0x00262622935e93f4c887a879e5db910d65c74a8d",
  "0x0029b84a8b6bcacd8cc3cdffe209a4b32c0f9cfa",
  "0x003328d36bf5392b958ba3e04c831b9a07081dd7",
  "0x003534128dd9319f62bd398f129b3caa2c7eb2fd",
];

async function seedMonitoredEntities() {
  console.log("🌱 Seeding monitored AVS and Operators...");

  try {
    // Prepare mainnet AVS with API data
    console.log("📡 Fetching mainnet AVS data from API...");
    const mainnetAVSPromises = mainnetAVSAddresses.map(async (address) => {
      const data = await fetchAVSData(address, MAINNET_CHAIN_ID);
      if (!data) {
        console.log(`  ✗ ${address.slice(0, 10)}... SKIPPED (API failed)`);
        return null;
      }
      console.log(`  ✓ ${address.slice(0, 10)}... ${data.name || "(no name)"}`);
      return {
        id: nanoid(),
        address: address.toLowerCase(),
        chainId: MAINNET_CHAIN_ID,
        name: data.name,
        description: data.description,
        isActive: true,
        metadata: data.metadata,
      };
    });
    const mainnetAVSResults = await Promise.all(mainnetAVSPromises);
    const mainnetAVS = mainnetAVSResults.filter(
      (avs): avs is NonNullable<typeof avs> => avs !== null
    );

    // Prepare holesky AVS with API data
    console.log("📡 Fetching holesky AVS data from API...");
    const holeskyAVSPromises = holeskyAVSAddresses.map(async (address) => {
      const data = await fetchAVSData(address, HOLESKY_CHAIN_ID);
      if (!data) {
        console.log(`  ✗ ${address.slice(0, 10)}... SKIPPED (API failed)`);
        return null;
      }
      console.log(`  ✓ ${address.slice(0, 10)}... ${data.name || "(no name)"}`);
      return {
        id: nanoid(),
        address: address.toLowerCase(),
        chainId: HOLESKY_CHAIN_ID,
        name: data.name,
        description: data.description,
        isActive: true,
        metadata: data.metadata,
      };
    });
    const holeskyAVSResults = await Promise.all(holeskyAVSPromises);
    const holeskyAVS = holeskyAVSResults.filter(
      (avs): avs is NonNullable<typeof avs> => avs !== null
    );

    // Prepare mainnet operators with API data
    console.log("📡 Fetching mainnet operators data from API...");
    const mainnetOperatorsPromises = mainnetOperatorAddresses.map(
      async (address) => {
        const data = await fetchOperatorData(address, MAINNET_CHAIN_ID);
        if (!data) {
          console.log(`  ✗ ${address.slice(0, 10)}... SKIPPED (API failed)`);
          return null;
        }
        console.log(
          `  ✓ ${address.slice(0, 10)}... ${data.name || "(no name)"}`
        );
        return {
          id: nanoid(),
          address: address.toLowerCase(),
          chainId: MAINNET_CHAIN_ID,
          name: data.name,
          description: data.description,
          isActive: true,
          metadata: data.metadata,
        };
      }
    );
    const mainnetOperatorsResults = await Promise.all(mainnetOperatorsPromises);
    const mainnetOperators = mainnetOperatorsResults.filter(
      (op): op is NonNullable<typeof op> => op !== null
    );

    // Prepare holesky operators with API data
    console.log("📡 Fetching holesky operators data from API...");
    const holeskyOperatorsPromises = holeskyOperatorAddresses.map(
      async (address) => {
        const data = await fetchOperatorData(address, HOLESKY_CHAIN_ID);
        if (!data) {
          console.log(`  ✗ ${address.slice(0, 10)}... SKIPPED (API failed)`);
          return null;
        }
        console.log(
          `  ✓ ${address.slice(0, 10)}... ${data.name || "(no name)"}`
        );
        return {
          id: nanoid(),
          address: address.toLowerCase(),
          chainId: HOLESKY_CHAIN_ID,
          name: data.name,
          description: data.description,
          isActive: true,
          metadata: data.metadata,
        };
      }
    );
    const holeskyOperatorsResults = await Promise.all(holeskyOperatorsPromises);
    const holeskyOperators = holeskyOperatorsResults.filter(
      (op): op is NonNullable<typeof op> => op !== null
    );

    // Insert AVS
    console.log("📝 Inserting monitored AVS...");
    const insertedAVS = await bulkInsertMonitoredAVS([
      ...mainnetAVS,
      ...holeskyAVS,
    ]);
    console.log(`✅ Inserted ${insertedAVS.length} AVS`);

    // Insert Operators
    console.log("📝 Inserting monitored operators...");
    const insertedOperators = await bulkInsertMonitoredOperators([
      ...mainnetOperators,
      ...holeskyOperators,
    ]);
    console.log(`✅ Inserted ${insertedOperators.length} operators`);

    console.log(`\n📊 Summary:`);
    console.log(
      `   AVS: ${insertedAVS.length}/${mainnetAVSAddresses.length + holeskyAVSAddresses.length} successfully inserted`
    );
    console.log(
      `   Operators: ${insertedOperators.length}/${mainnetOperatorAddresses.length + holeskyOperatorAddresses.length} successfully inserted`
    );
    console.log("🎉 Seed completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run seed
seedMonitoredEntities()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
