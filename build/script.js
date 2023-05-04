import { StacksTestnet, StacksMainnet, StacksMocknet } from "./_snowpack/pkg/@stacks/network.js";
import { bytesToUtf8 } from "./_snowpack/pkg/@stacks/common.js";
import { connectWallet } from "./WalletConnect.js";
import {
  getSTXBalance,
  getLastId,
  getProject,
  getTxInfo,
  getProjectNft,
} from "./ContractCalls.js";
import { createListHeader, renderProjectList } from "./Components.js";
import { userSession } from "./userSession.js";
import { c32address } from "./utils/address.js";

//global Variable projectList
export const globalsObject = {
  state: "start",
  projectList: [],
  txDataLog: [],
  periodics: [],
//debug:
  //userStxAddress: "ST1YT40RFHKSYXM69KS1Q7BGEH0RBJ7H1RKDN1WX",
//debug
  userStxAddress: "",
  deployerStxAddress: "",
  environment: "testnet",
  network: {},
  apiBaseUri: "",
};

function setNetwork() {
  if (globalsObject.environment === "mainnet") {
    globalsObject.network = new StacksMainnet();
    globalsObject.baseUri = "https://api.mainnet.hiro.so";
  } else if (globalsObject.environment === "devnet") {
    globalsObject.network = new StacksMocknet();
    globalsObject.baseUri = "http://localhost:3999";
    globalsObject.deployerStxAddress =
      "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
  } else {
    //as standard and at startup
    globalsObject.network = new StacksTestnet();
    globalsObject.baseUri = "https://api.testnet.hiro.so";
    globalsObject.deployerStxAddress =
      "ST1YT40RFHKSYXM69KS1Q7BGEH0RBJ7H1RKDN1WX";
    
  }
}
setNetwork();

export function writeTxDataLog(data) {
  if (globalsObject.txDataLog.length > 10) {
    globalsObject.txDataLog.shift();
    globalsObject.txDataLog.push(data);
  } else {
    globalsObject.txDataLog.push(data);
  }
}

//start page:
export function createStartPage() {
  async function updateProjectList() {
    console.log("updating project list...");
    //update complete projectList:
    const lastProjectId = await getLastId();
    //console.log(`lastId: ${lastProjectId}`);
    const newProjectList = [];
    //console.log('in updateProjectList():')
    //console.log('projectList: ');
    //console.log(projectList);
    for (let id = 1; id <= Number(lastProjectId); id++) {
      let projectArray = [];
      await getProject(id).then((projectData) => {
        //console.log("updateProjectList res: ");
        //console.log(projectData);
        //translate description from buffer to string:
        //console.log(projectData.description);
        projectData.description = bytesToUtf8(projectData.description.buffer);
        //console.log(projectData.description);

        //generate stacks address with the available data:
        const campaignOwner = c32address(
          projectData.campaignOwner.address.version,
          projectData.campaignOwner.address.hash160
        );
        projectData.campaignOwner = campaignOwner;
        //translate returned values to js:
        //targetReached: bool type3 true, type4 false
        if (projectData.targetReached.type === 3) {
          projectData.targetReached = true;
        } else {
          projectData.targetReached = false;
        }
        //targetReached: bool type3 true, type4 false
        if (projectData.claimed.type === 3) {
          projectData.claimed = true;
        } else {
          projectData.claimed = false;
        }

        if (projectData) {
          projectArray = [id, projectData, []];
        }
      });
      //get the nftCounter of the actual project
      const nftCount = projectArray[1].nftCounter.value;
      //console.log(`nftCounter: ${nftCount}`);
      //console.log(nftCount);
      //get the nfts of the actual project
      for (let i = 1; i <= Number(nftCount); i++) {
        await getProjectNft(id, i).then((nftData) => {
          if (nftData) {
            projectArray[2].push({
              projectNftId: i,
              nft: { id: nftData.nftId.value, name: nftData.nftName.data },
            });
          }
        });
      }
      //push the gathered data into the projectList array
      newProjectList.push(projectArray);
    }
    globalsObject.projectList = newProjectList;
    renderProjectList();
    //console.log("in updateProjectList() globalsObject:");
    //console.log(globalsObject);
  }

  async function checkTxData() {
    console.log("in checkTxData():");
    //outsort success tx
    if (globalsObject.txDataLog.length > 0) {
      const log = globalsObject.txDataLog;
      const aMax = log.length - 1;

      for (let i = 0; i <= aMax; i++) {
        const tx = log.shift();
        const txId = tx.txId;
        await getTxInfo(txId).then((response) => {
          const txInfo = response;
          console.log(txInfo);
          if (txInfo === "pending") {
            log.push(tx);
          } else if (txInfo === "success") {
            //update projectList()
            updateProjectList();
          } else {
            const url = `localhost:8000/txid/${txId}?chain=testnet&api=http://localhost:3999`;
            window.alert(`transaction failed: don't panic!
                                        NO funds will be lost ( except fees ), 
                                        please check stacks explorer for details: 
                                        ${url}`);
          }
        });
      }
    }
  }

  const navDiv = document.createElement("div");
  navDiv.id = "navDiv";
  document.body.appendChild(navDiv);

  const btn = document.createElement("button");
  btn.id = "connectBtn";
  btn.textContent = "Connect";
  navDiv.appendChild(btn);

  const connecting = function () {
    //do periodically in the "background"
    updateProjectList();
    globalsObject.periodics.push({
      name: "idUpdateProjectList",
      id: setInterval(updateProjectList, 20000),
    });
    globalsObject.periodics.push({
      name: "idCheckTxData",
      id: setInterval(checkTxData, 5000),
    });
    btn.remove();
    connectWallet(createPageConnected);
//debug:    
    //createPageConnected();
//debug
  };

  btn.addEventListener("click", connecting, false);

  console.log(globalsObject.network);
}
//first time: start page
createStartPage();

//connected page:
export function createPageConnected() {
  //add new paragraph for Balance:
  const divBal = document.createElement("div");

  async function updateBalance() {
    await getSTXBalance(globalsObject.userStxAddress).then((res) => {
      console.log("checking user balance...");
      const userBalance = res / 1000000;
      //console.log('in createPageConnected:updateBalance() globalsObject.userBalance');
      //console.log(globalsObject.userBalance);
      divBal.textContent = `Balance ${userBalance.toString()}STX`;
    });
  }
  updateBalance();
  //update userBalance periodically but start it only once
  if (globalsObject.state === "loggedIn") {
    globalsObject.periodics.push({
      name: "idUpdateBalance",
      id: setInterval(updateBalance, 10000),
    });
  }

  //render projectList periodically but start only once
  if (globalsObject.state === "loggedIn") {
    globalsObject.periodics.push({
      name: "idrenderProjectList",
      id: setInterval(renderProjectList, 10000),
    });
  }

  //create sign out button with listener to sign out and clear the page
  const btnSignOut = document.createElement("button");
  btnSignOut.id = "signOutBtn";
  btnSignOut.textContent = "Sign out";
  btnSignOut.addEventListener("click", () => {
    //clear body:
    let firstChild = document.body.firstChild;
    while (firstChild) {
      document.body.removeChild(document.body.firstChild);
      firstChild = document.body.firstChild;
    }
    //halt all periodics
    for (const item of globalsObject.periodics) {
      clearInterval(item.id);
    }
    userSession.signUserOut();
    if (!userSession.isUserSignedIn()) {
      globalsObject.state = "signedOut";
      console.log("signed out");
    }
    createStartPage();
  });

  //html elements appended as follows:
  const div = document.getElementById("navDiv");
  div.appendChild(btnSignOut);
  div.appendChild(divBal);

  //fill page
  createListHeader();
}
