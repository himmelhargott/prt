import {
  trueCV,
  falseCV,
  noneCV,
  someCV,
  intCV,
  uintCV,
  standardPrincipalCV,
  contractPrincipalCV,
  responseErrorCV,
  responseOkCV,
  listCV,
  tupleCV,
  bufferCV,
  stringUtf8CV,
  stringAsciiCV,
  bufferCVFromString,
  cvToHex,
} from "@stacks/transactions";
import { utf8ToBytes } from "@stacks/common";
import {
  makeContractCall,
  callReadOnlyFunction,
  broadcastTransaction,
  AnchorMode,
  FungibleConditionCode,
  BytesReader,
  deserializeTransaction,
  createStacksPrivateKey,
  parseReadOnlyResponse,
  makeStandardSTXPostCondition,
  makeContractSTXPostCondition,
} from "@stacks/transactions";

import { openContractCall } from "@stacks/connect";
  
import { globalsObject, writeTxDataLog } from "./script.js";
import { createListHeader } from "./Components.js";

export async function launchProject(title, descr, link, goal, start, end) {
  const postConditionAddress = globalsObject.userStxAddress;
  const postConditionCode = FungibleConditionCode.LessEqual;
  const postConditionAmount = 100000000;
  const postConditions = [
    makeStandardSTXPostCondition(
      postConditionAddress,
      postConditionCode,
      postConditionAmount
    ),
  ];
  const options = {
    contractAddress: globalsObject.deployerStxAddress,
    contractName: "prt",
    functionName: "launch",
    functionArgs: [
      stringUtf8CV(title),
      bufferCVFromString(descr),
      stringUtf8CV(link),
      uintCV(goal),
      uintCV(start),
      uintCV(end),
    ],
    network: globalsObject.network,
    postConditions,
    appDetails: {
      name: "PRT",
      icon: window.location.origin + "/my-app-logo.svg",
    },
    onFinish: (data) => {
      writeTxDataLog(data);
    },
  };

  await openContractCall(options);

  //console.log('launch() txData.txId');
  //console.log(globalsObject.txDataLog[(globalsObject.txDataLog.length -1)].txId);
}

export async function claimFunds(projectId) {
  const funds = globalsObject.projectList[projectId - 1][1].pledgedAmount.value;
  console.log("in claimFunds funds:");
  console.log(globalsObject);
  console.log(funds);

  // With a contract principal
  const postConditionAddress = globalsObject.userStxAddress;
  const postConditionCode = FungibleConditionCode.LessEqual;
  const postConditionAmount = funds;

  const contractAddress = globalsObject.deployerStxAddress;
  const contractName = "prt";

  const postConditions = [
    makeStandardSTXPostCondition(
      postConditionAddress,
      postConditionCode,
      postConditionAmount
    ),
    makeContractSTXPostCondition(
      contractAddress,
      contractName,
      postConditionCode,
      postConditionAmount
    ),
  ];

  const txOptions = {
    contractAddress: globalsObject.deployerStxAddress,
    contractName: "prt",
    functionName: "claim",
    functionArgs: [uintCV(projectId)],
    validateWithAbi: true,
    network: globalsObject.network,
    postConditions,
    AnchorMode: AnchorMode.Any,
    appDetails: {
      name: "PRT",
      icon: window.location.origin + "/my-app-logo.svg",
    },
    onFinish: (data) => {
      writeTxDataLog(data);
    },
  };

  await openContractCall(txOptions).then(() => {
    createListHeader();
  });

  //console.log('claim() txData.txId');
  //console.log(globalsObject.txDataLog[(globalsObject.txDataLog.length -1)].txId);
}

export async function invest(projectId, amount) {
  const postConditionAddress = globalsObject.userStxAddress;
  const postConditionCode = FungibleConditionCode.LessEqual;
  const postConditionAmount = amount * 1000000;
  const postConditions = [
    makeStandardSTXPostCondition(
      postConditionAddress,
      postConditionCode,
      postConditionAmount
    ),
  ];

  const txOptions = {
    contractAddress: globalsObject.deployerStxAddress,
    contractName: "prt",
    functionName: "pledge",
    functionArgs: [uintCV(projectId), uintCV(amount * 1000000)],
    validateWithAbi: true,
    network: globalsObject.network,
    postConditions,
    AnchorMode: AnchorMode.Any,
    appDetails: {
      name: "PRT",
      icon: window.location.origin + "/my-app-logo.svg",
    },
    onFinish: (data) => {
      writeTxDataLog(data);
    },
  };

  await openContractCall(txOptions);
}

export async function mintNft(projectId, nftName) {
  const txOptions = {
    contractAddress: globalsObject.deployerStxAddress,
    contractName: "prt",
    functionName: "mintNft",
    functionArgs: [uintCV(projectId), stringAsciiCV(nftName)],
    validateWithAbi: true,
    network: globalsObject.network,
    AnchorMode: AnchorMode.Any,
    appDetails: {
      name: "PRT",
      icon: window.location.origin + "/my-app-logo.svg",
    },
    onFinish: (data) => {
      writeTxDataLog(data);
    },
  };

  await openContractCall(txOptions);
}

export async function updateUri(nftId, newUri) {
  const txOptions = {
    contractAddress: globalsObject.deployerStxAddress,
    contractName: "musicnfts",
    functionName: "update-token-uri",
    functionArgs: [uintCV(nftId), stringAsciiCV(newUri)],
    validateWithAbi: true,
    network: globalsObject.network,
    AnchorMode: AnchorMode.Any,
    appDetails: {
      name: "PRT",
      icon: window.location.origin + "/my-app-logo.svg",
    },
    onFinish: (data) => {
      writeTxDataLog(data);
    },
  };

  await openContractCall(txOptions);

  /*console.log('updateUri() txData.txId:');
  console.log(txDataLog[(txDataLog.length -1)].txId);
  console.log(txDataLog[(txDataLog.length -1)]);*/
}

export async function downloadURI(nftId, projectId, filename) {
  let downloadPrice;
  await getDownloadPrice().then((res) => {
    //console.log( `in downloadURI() res: ${res}`);
    //console.log(res);
    downloadPrice = 1000000 * res;
  });
  //console.log( `in downloadURI() downloadPrice: ${downloadPrice}`);
  //console.log(downloadPrice);
  const postConditionAddress = globalsObject.userStxAddress;
  const postConditionCode = FungibleConditionCode.LessEqual;
  const postConditionAmount = downloadPrice;
  const postConditions = [
    makeStandardSTXPostCondition(
      postConditionAddress,
      postConditionCode,
      postConditionAmount
    ),
  ];

  const txOptions = {
    contractAddress: globalsObject.deployerStxAddress,
    contractName: "prt",
    functionName: "download",
    functionArgs: [uintCV(nftId), uintCV(projectId)],
    validateWithAbi: true,
    network: globalsObject.network,
    postConditions,
    AnchorMode: AnchorMode.Any,
    appDetails: {
      name: "PRT",
      icon: window.location.origin + "/my-app-logo.svg",
    },
    onFinish: (data) => {
      writeTxDataLog(data);
      getUri(nftId).then((uri) => {
        //console.log('in downloadUri() uri');
        //console.log(uri);
        fetchData(uri, filename);
      });
    },
  };

  await openContractCall(txOptions);
}

export async function getBlockHeight() {
  const contractAddress = globalsObject.deployerStxAddress;
  const contractName = "prt";
  const functionName = "get-blockHeight";
  const senderAddress = globalsObject.deployerStxAddress;

  const options = {
    contractAddress,
    contractName,
    functionName,
    functionArgs: [],
    network: globalsObject.network,
    senderAddress,
  };

  const result = await callReadOnlyFunction(options);
  const blockHeight = result.value.value;
  //console.log("blockHeight " + blockHeight);
  return blockHeight;
}

export async function getLastId() {
  const contractAddress = globalsObject.deployerStxAddress;
  const contractName = "prt";
  const functionName = "get-lastId";
  const senderAddress = globalsObject.deployerStxAddress;

  const options = {
    contractAddress,
    contractName,
    functionName,
    functionArgs: [],
    network: globalsObject.network,
    senderAddress,
  };

  const result = await callReadOnlyFunction(options);
  const lastId = result.value.value;
  //console.log("lastID: " +lastId);
  return lastId;
}

export async function getProject(projectId) {
  const contractAddress = globalsObject.deployerStxAddress;
  const contractName = "prt";
  const functionName = "get-campaign";
  const functionArgs = [uintCV(projectId)];
  //console.log("functionArgs: ")
  //console.log(functionArgs);
  const senderAddress = globalsObject.deployerStxAddress;

  const options = {
    contractAddress,
    contractName,
    functionName,
    functionArgs,
    network: globalsObject.network,
    senderAddress,
  };

  const result = await callReadOnlyFunction(options);
  const campaign = result.value.data;

  //console.log(campaign);
  return campaign;
}

export async function getProjectNft(projectId, nftId) {
  const contractAddress = globalsObject.deployerStxAddress;
  const contractName = "prt";
  const functionName = "get-projectNft";
  const functionArgs = [uintCV(projectId), uintCV(nftId)];
  //console.log("functionArgs: ")
  //console.log(functionArgs);
  const senderAddress = globalsObject.deployerStxAddress;

  const options = {
    contractAddress,
    contractName,
    functionName,
    functionArgs,
    network: globalsObject.network,
    senderAddress,
  };

  const result = await callReadOnlyFunction(options);
  const nftData = result.value.value.data;
  //console.log('nftData in getProjectNft() : ')
  //console.log(nftData);
  return nftData;
}

export async function getNftOwner(nftId) {
  const contractAddress = globalsObject.deployerStxAddress;
  const contractName = "musicnfts";
  const functionName = "get-owner";
  const functionArgs = [uintCV(nftId)];
  //console.log("functionArgs: ")
  //console.log(functionArgs);
  const senderAddress = globalsObject.deployerStxAddress;

  const options = {
    contractAddress,
    contractName,
    functionName,
    functionArgs,
    network: globalsObject.network,
    senderAddress,
  };

  const result = await callReadOnlyFunction(options);
  const nftOwner = result.value.data;
  console.log("in getNftOwner:");
  console.log(nftOwner);
  return nftOwner;
}

export async function getDownloadPrice() {
  const contractAddress = globalsObject.deployerStxAddress;
  const contractName = "prt";
  const functionName = "get-price";
  const functionArgs = [];
  //console.log("functionArgs: ")
  //console.log(functionArgs);
  const senderAddress = globalsObject.deployerStxAddress;

  const options = {
    contractAddress,
    contractName,
    functionName,
    functionArgs,
    network: globalsObject.network,
    senderAddress,
  };

  const result = await callReadOnlyFunction(options);
  const price = Number(result.value.value);
  //console.log('in getDownloadPrice:')
  //console.log(price);
  return price;
}

export async function getUri(nftId) {
  const contractAddress = globalsObject.deployerStxAddress;
  const contractName = "musicnfts";
  const functionName = "get-token-uri";
  const functionArgs = [uintCV(nftId)];
  //console.log("functionArgs: ")
  //console.log(functionArgs);
  const senderAddress = globalsObject.deployerStxAddress;

  const options = {
    contractAddress,
    contractName,
    functionName,
    functionArgs,
    network: globalsObject.network,
    senderAddress,
  };

  const result = await callReadOnlyFunction(options);
  const uri = result.value.value.data;
  //console.log('in getUri uri:')
  //console.log(uri);
  return uri;
}

export async function getSTXBalance(stxAddress) {
  let balance = 0;
  const apiCallUri = `/extended/v1/address/${stxAddress}/stx`;
  let baseUri = globalsObject.baseUri;
  const uri = baseUri + apiCallUri;
  await fetch(uri)
    .then((result) => {
      return result.json();
    })
    .then((json) => {
      //console.log("function getSTXBalance: ");
      //console.log (json.balance);
      balance = json.balance;
    });
  //console.log("balance returned: "+ balance);
  return balance;
}

export async function getTxInfo(txId) {
  //uri: `http://localhost:3999/extended/v1/tx/${txId}`
  //console.log('network:');
  //console.log(network.coreApiUrl);
  const uri = `${globalsObject.network.coreApiUrl}/extended/v1/tx/${txId}`;
  //console.log('uri:');
  //console.log(uri);
  const myRequest = new Request(uri);
  let data;
  await fetch(myRequest)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return response.json();
    })
    .then((response) => {
      //console.log('response: ');
      //console.log(response);
      data = response.tx_status;
    });

  //console.log('data: ');
  //console.log(data);
  return data;
}

function fetchData(cid, filename) {
  //spezial function to download the contents of the uri
  const address = `https://${cid}.ipfs.dweb.link/favicon.ico`;
  //console.log(`in fetchData(): ${address}`);
  //console.log(address);

  const myRequest = new Request(address);
  fetch(myRequest)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return response.blob();
    })
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "favicon.ico"; //filename;
      document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
      a.click();
      a.remove(); //afterwards we remove the element again
    });
}
