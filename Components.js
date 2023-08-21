import {
  launchProject,
  getBlockHeight,
  invest,
  mintNft,
  downloadURI,
  updateUri,
  claimFunds,
} from "./ContractCalls.js";
import { globalsObject } from "./script.js";

//html form for new project interface:
export function createNewProjectForm() {
  //create new project form:
  const form = document.createElement("form");
  form.name = "newProject";
  //label and input project name: form.elements[0]
  const para0 = document.createElement("p");
  form.appendChild(para0);
  const labelProjectName = document.createElement("label");
  labelProjectName.className = form.name;
  labelProjectName.textContent = "Project name: ";
  labelProjectName.setAttribute("for", "inputProjectName");
  para0.appendChild(labelProjectName);

  const inputProjectName = document.createElement("input");
  inputProjectName.className = form.name;
  inputProjectName.type = "text";
  inputProjectName.id = "inputProjectName";
  inputProjectName.value = "myNewProject";
  para0.appendChild(inputProjectName);

  //label and input project description: form.elements[1]
  const para1 = document.createElement("p");
  form.appendChild(para1);
  const labelProjectDescr = document.createElement("label");
  labelProjectDescr.className = form.name;
  labelProjectDescr.textContent = "Description: ";
  labelProjectDescr.setAttribute("for", "inputProjectDescr");
  para1.appendChild(labelProjectDescr);

  const inputProjectDescr = document.createElement("input");
  inputProjectDescr.className = form.name;
  inputProjectDescr.type = "text";
  inputProjectDescr.id = "inputProjectDescr";
  inputProjectDescr.value = "this is my new project";
  para1.appendChild(inputProjectDescr);

  //label and input project link: form.elements[2]
  const para2 = document.createElement("p");
  form.appendChild(para2);
  const labelProjectLink = document.createElement("label");
  labelProjectLink.className = form.name;
  labelProjectLink.textContent = "Website:";
  labelProjectLink.setAttribute("for", "inputProjectLink");
  para2.appendChild(labelProjectLink);

  const inputProjectLink = document.createElement("input");
  inputProjectLink.className = form.name;
  inputProjectLink.type = "url";
  inputProjectLink.id = "inputProjectLink";
  inputProjectLink.value = "https://orckings.org/";
  para2.appendChild(inputProjectLink);

  //label and input project goal: form.elements[3]
  const para3 = document.createElement("p");
  form.appendChild(para3);
  const labelProjectGoal = document.createElement("label");
  labelProjectGoal.className = form.name;
  labelProjectGoal.textContent = "Goal [STX]: ";
  labelProjectGoal.setAttribute("for", "inputProjectGoal");
  para3.appendChild(labelProjectGoal);

  const inputProjectGoal = document.createElement("input");
  inputProjectGoal.className = form.name;
  inputProjectGoal.type = "number";
  inputProjectGoal.id = "inputProjectGoal";
  inputProjectGoal.value = 10000;
  para3.appendChild(inputProjectGoal);

  //label and input project duration: form.elements[4]
  const para4 = document.createElement("p");
  form.appendChild(para4);
  const labelProjectDuration = document.createElement("label");
  labelProjectDuration.className = form.name;
  labelProjectDuration.textContent = "Duration days: ";
  labelProjectDuration.setAttribute("for", "inputProjectDuration");
  para4.appendChild(labelProjectDuration);

  const inputProjectDuration = document.createElement("input");
  inputProjectDuration.className = form.name;
  inputProjectDuration.type = "number";
  inputProjectDuration.id = "inputProjectDuration";
  inputProjectDuration.value = 30;
  para4.appendChild(inputProjectDuration);

  //submit form button: form.elements[5]
  const para5 = document.createElement("p");
  form.appendChild(para5);
  const btnNewProject = document.createElement("button");
  btnNewProject.className = form.name;
  btnNewProject.type = "submit";
  btnNewProject.textContent = "Create project";
  para5.appendChild(btnNewProject);

  //home form button: form.elements[6]
  const btnHome = document.createElement("button");
  btnHome.className = form.name;
  //btnHome.type = "submit";
  btnHome.textContent = "back";
  para5.appendChild(btnHome);

  return form;
}

//newproject interface:
export function newProjectComponent() {
  const form = createNewProjectForm();
  document.body.appendChild(form);
  const ipName = form.elements[0];
  ipName.focus();
  const ipDescr = form.elements[1];
  const ipLink = form.elements[2];
  const ipGoal = form.elements[3];
  const ipDuration = form.elements[4];
  const submitBtn = form.elements[5];
  const homeBtn = form.elements[6];

submitBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    let blockHeight = 0;
    await getBlockHeight().then((res) => {
      blockHeight = res;
    });
    //console.log(`blockHeight: ${blockHeight}`);
    const start = blockHeight + BigInt(3);
    //console.log(`startBlock: ${start}`);
    const end = start + (BigInt(ipDuration.value* 144));    //ipDuration in days + currently ca. 144 blocks per day
    /*console.log("ipName "+ ipName.value);
        console.log("ipDescr "+ ipDescr.value);
        console.log("ipLink "+ ipLink.value);
        console.log("ipGoal "+ ipGoal.value);
        console.log("start "+ start);
        console.log("end "+ end);
*/
    await launchProject(
      ipName.value,
      ipDescr.value,
      ipLink.value,
      ipGoal.value,
      start,
      end
    );
    //state change:
    form.remove();
    createListHeader();
  });

  homeBtn.addEventListener("click", () => {
    form.remove();
    createListHeader();
  });
}

//html form for invest interface:
export function createInvestForm() {
  //create new project form:
  const form = document.createElement("form");
  form.name = "Invest";

  //label and input invest amount: form.elements[0]
  const para0 = document.createElement("p");
  form.appendChild(para0);
  const labelInvestAmount = document.createElement("label");
  labelInvestAmount.className = form.name;
  labelInvestAmount.textContent = "Amount: ";
  labelInvestAmount.setAttribute("for", "inputInvestAmount");
  para0.appendChild(labelInvestAmount);

  const inputInvestAmount = document.createElement("input");
  inputInvestAmount.className = form.name;
  inputInvestAmount.type = "number";
  inputInvestAmount.id = "inputInvestAmount";
  inputInvestAmount.value = 10;
  para0.appendChild(inputInvestAmount);

  //submit form button: form.elements[1]
  const para5 = document.createElement("p");
  form.appendChild(para5);
  const btnInvestAmount = document.createElement("button");
  btnInvestAmount.className = form.name;
  btnInvestAmount.type = "submit";
  btnInvestAmount.textContent = "invest";
  para5.appendChild(btnInvestAmount);

  //home form button: form.elements[2]
  const btnHome = document.createElement("button");
  btnHome.className = form.name;
  //btnHome.type = "submit";
  btnHome.textContent = "back";
  para5.appendChild(btnHome);

  return form;
}

//invest interface:
export function investComponent(projectId) {
  //console.log('listDiv: ');
  //console.log(listDiv);
  const form = createInvestForm();
  document.body.appendChild(form);
  const ipAmount = form.elements[0];
  ipAmount.focus();
  const submitBtn = form.elements[1];
  const homeBtn = form.elements[2];

  submitBtn.addEventListener("click", async () => {
    event.preventDefault();
    await invest(projectId, ipAmount.value);
    form.remove();
    createListHeader();
  });

  homeBtn.addEventListener("click", () => {
    form.remove();
    createListHeader();
  });
}

//html form for mint nft interface:
export function createMintNftForm() {
  //create mint nft form:
  const form = document.createElement("form");
  form.name = "mint nft";

  //label and input nft name: form.elements[0]
  const para0 = document.createElement("p");
  form.appendChild(para0);
  const labelNftName = document.createElement("label");
  labelNftName.className = form.name;
  labelNftName.textContent = "nft name: ";
  labelNftName.setAttribute("for", "inputNftName");
  para0.appendChild(labelNftName);

  const inputNftName = document.createElement("input");
  inputNftName.className = form.name;
  inputNftName.type = "text";
  inputNftName.id = "inputNftName";
  inputNftName.value = "cool music nft";
  para0.appendChild(inputNftName);

  //submit form button: form.elements[1]
  const para5 = document.createElement("p");
  form.appendChild(para5);
  const btnMintNft = document.createElement("button");
  btnMintNft.className = form.name;
  btnMintNft.type = "submit";
  btnMintNft.textContent = "mint nft";
  para5.appendChild(btnMintNft);

  //home form button: form.elements[2]
  const btnHome = document.createElement("button");
  btnHome.className = form.name;
  //btnHome.type = "submit";
  btnHome.textContent = "back";
  para5.appendChild(btnHome);

  return form;
}

//mint nft interface:
export function mintNftComponent(projectId) {
  //console.log('listDiv: ');
  //console.log(listDiv);
  const form = createMintNftForm();
  document.body.appendChild(form);
  const nftName = form.elements[0];
  nftName.focus();
  const submitBtn = form.elements[1];
  const homeBtn = form.elements[2];

  submitBtn.addEventListener("click", async () => {
    event.preventDefault();
    await mintNft(projectId, nftName.value);
    form.remove();
    createListHeader();
  });

  homeBtn.addEventListener("click", () => {
    form.remove();
    createListHeader();
  });
}

//html form for update uri interface:
export function createUpdateUriForm() {
  //create update uri form:
  const form = document.createElement("form");
  form.name = "update uri";

  //label and input new uri: form.elements[0]
  const para0 = document.createElement("p");
  form.appendChild(para0);
  const labelNewUri = document.createElement("label");
  labelNewUri.className = form.name;
  labelNewUri.textContent = "new uri: ";
  labelNewUri.setAttribute("for", "inputNewUri");
  para0.appendChild(labelNewUri);
  //debug: is manual input copied from ipfs
  const cid = "bafybeifzoemu4xt7sgwpzmnxjmrec2xtzxz7tqvzbf43yowmsffsu6fzqi";

  const inputNewUri = document.createElement("input");
  inputNewUri.className = form.name;
  inputNewUri.type = "text";
  inputNewUri.id = "inputNewUri";
  inputNewUri.value = cid;
  para0.appendChild(inputNewUri);

  //submit form button: form.elements[1]
  const para5 = document.createElement("p");
  form.appendChild(para5);
  const btnUpdateUri = document.createElement("button");
  btnUpdateUri.className = form.name;
  btnUpdateUri.type = "submit";
  btnUpdateUri.textContent = "update uri";
  para5.appendChild(btnUpdateUri);

  //home form button: form.elements[2]
  const btnHome = document.createElement("button");
  btnHome.className = form.name;
  //btnHome.type = "submit";
  btnHome.textContent = "back";
  para5.appendChild(btnHome);

  return form;
}

//update uri interface:
export function updateUriComponent(nftId, projectId, projectList) {
  const form = createUpdateUriForm();
  document.body.appendChild(form);
  const newUri = form.elements[0];
  newUri.focus();
  const submitBtn = form.elements[1];
  const homeBtn = form.elements[2];

  submitBtn.addEventListener("click", async () => {
    event.preventDefault();
    await updateUri(nftId, newUri.value);
    form.remove();
    showNftComponent(projectId, projectList);
  });

  homeBtn.addEventListener("click", () => {
    form.remove();
    showNftComponent(projectId, projectList);
  });
}

//html form for show nft interface:
export function createNftListPara(projectId, projectNftId, nftName) {
  //label and input nft name
  const para = document.createElement("p");

  const labelNftName = document.createElement("label");
  labelNftName.textContent = "nft name: ";
  labelNftName.setAttribute("for", "inputNftName");
  para.appendChild(labelNftName);

  const inputNftName = document.createElement("input");
  inputNftName.disabled = true;
  inputNftName.type = "text";
  inputNftName.id = "inputNftName";
  inputNftName.value = nftName;
  para.appendChild(inputNftName);

  const btnDownloadNft = document.createElement("button");
  btnDownloadNft.id = projectNftId;
  btnDownloadNft.textContent = "download";
  para.appendChild(btnDownloadNft);

  if (
    globalsObject.userStxAddress ===
      globalsObject.projectList[projectId - 1][1].campaignOwner ||
    globalsObject.userStxAddress === globalsObject.deployerStxAddress
  ) {
    const btnUpdateUri = document.createElement("button");
    btnUpdateUri.id = projectNftId;
    btnUpdateUri.textContent = "update uri";
    para.appendChild(btnUpdateUri);
  }

  return para;
}

//show nfts interface:
export function showNftComponent(projectId) {
  const listPara = document.createElement("p");
  listPara.id = "listPara";
  document.body.appendChild(listPara);

  //projectNftList wird in script/updateProjectList() in [2] des projectList arrays gepusht
  const nftList = globalsObject.projectList[projectId - 1][2];
  console.log(`in showNftComponent: projectId ${projectId} :`);
  console.log(nftList);
  for (const item of nftList) {
    const projectNftId = item.projectNftId;
    const nftName = item.nft.name;
    const para = createNftListPara(projectId, projectNftId, nftName);
    listPara.appendChild(para);
  }

  async function listParaEventListener(e) {
    console.log("in showNftComponent:");
    console.log(e.target.tagName);

    if (e.target.tagName === "BUTTON") {
      if (e.target.textContent === "download") {
        const nftId = nftList[e.target.id - 1].nft.id;
        const filename = `${nftList[e.target.id - 1].nft.name}`;
        await downloadURI(nftId, projectId, filename);
      } else if (e.target.textContent === "update uri") {
        listPara.remove();
        const nftId = nftList[e.target.id - 1].nft.id;
        updateUriComponent(nftId, projectId, globalsObject.projectList);
      }
    }
  }

  listPara.addEventListener("click", listParaEventListener, false);

  //home button:
  const btnHome = document.createElement("button");
  btnHome.textContent = "back";
  listPara.appendChild(btnHome);

  btnHome.addEventListener("click", () => {
    //listPara.removeEventListener("click", listParaEventListener, false);
    listPara.remove();
    createListHeader();
  });
}

// html elements to create projects list
function createListItemPara(blockHeight, projectId, project) {
  const para = document.createElement("p");
  //console.log('in createListItemPara: ');
  //console.log(project);
  //console.log(blockHeight);
  //add invest button disabled if project is closed
  const btnInvest = document.createElement("button");
  btnInvest.id = projectId;
  btnInvest.textContent = "Invest";
  if (blockHeight < project.startsAt.value) {
    btnInvest.disabled = true;
  }
  if (blockHeight > project.endsAt.value-BigInt(1)) {
    if (
      project.targetReached &&
      globalsObject.userStxAddress === project.campaignOwner &&
      !project.claimed
    ) {
      btnInvest.textContent = "Claim";
    } else if (project.claimed) {
      btnInvest.textContent = "Claimed";
      btnInvest.disabled = true;
    } else {
      btnInvest.disabled = true;
    }
  }
  para.appendChild(btnInvest);
  //add a hyperlink to the project site
  const alink = document.createElement("a");
  alink.textContent = project.title.data;
  alink.href = project.link.data;
  alink.target = "_blank";
  para.appendChild(alink);
  //add funded to the list
  const btnFund = document.createElement("button");
  btnFund.disabled = true;
  btnFund.textContent = Number(project.pledgedAmount.value) / 1000000;
  para.appendChild(btnFund);
  //add goal to the list
  const btnGoal = document.createElement("button");
  btnGoal.disabled = true;
  btnGoal.textContent = project.fundGoal.value;
  para.appendChild(btnGoal);

  if (
    globalsObject.userStxAddress === project.campaignOwner ||
    globalsObject.userStxAddress === globalsObject.deployerStxAddress
  ) {
    //add a button to mint nfts for a project
    const btnNftMint = document.createElement("button");
    btnNftMint.id = projectId;
    btnNftMint.textContent = "Mint Nft";
    para.appendChild(btnNftMint);
  }

  if (project.nftCounter.value != 0) {
    //add a button to display the  nfts of a project
    const btnNftList = document.createElement("button");
    btnNftList.id = projectId;
    btnNftList.textContent = "Show Nfts";
    para.appendChild(btnNftList);
  }
  //add the description:
  const divDescr = document.createElement("div");
  divDescr.textContent = "No description available";
  if (project.description != "") {
    divDescr.textContent = project.description;
  }
  para.appendChild(divDescr);

  return para;
}

//render the project List:
export async function renderProjectList() {
  if (document.getElementById("listHeader")) {
    let blockHeight = 0;
    await getBlockHeight().then((res) => {
      blockHeight = res;
    });

    //make projectList copy from globals:
    const pList = [];
    for (const item of globalsObject.projectList) {
      pList.push(item);
    }

    //remove old list para:
    if (document.getElementById("listPara")) {
      const paraListRemove = document.getElementById("listPara");
      paraListRemove.remove();
    }
    //make new para for listentries:
    const listDiv = document.getElementById("listHeader");
    const paraList = document.createElement("p");
    paraList.id = "listPara";
    listDiv.appendChild(paraList);
    //add updatet items to listPara
    if (pList.length != 0) {
      console.log("renderProjectList...");
      //console.log(`projectList.length = ${pList.length}`);
      //console.log(pList);

      for (const item of pList) {
        const id = item[0];
        const projectObject = item[1];
        const itemPara = createListItemPara(blockHeight, id, projectObject);
        paraList.appendChild(itemPara);
      }
    } else {
      console.log("empty project list");
    }
  } else {
    console.log("no projectList active");
  }
}

export async function createListHeader() {
  //create list header
  const listDiv = document.createElement("div");
  listDiv.id = "listHeader";
  document.body.appendChild(listDiv);

  //add newProject button
  const navDiv = document.getElementById("navDiv");
  const btnNP = document.createElement("button");
  btnNP.id = "newProjectBtn";
  btnNP.textContent = "new Project";
  btnNP.addEventListener("click", () => {
    const listDiv = document.getElementById("listHeader");
    listDiv.remove();
    btnNP.remove();
    newProjectComponent();
  });
  //function to handle upbubbling clicks in list:
  function handleListDivClicks(e) {
    console.log("in handleListDivCLicks:");
    console.log(e.target.tagName);
    if (e.target.tagName === "BUTTON") {
      if (e.target.textContent === "Invest") {
        listDiv.remove();
        btnNP.remove();
        investComponent(e.target.id);
      } else if (e.target.textContent === "Claim") {
        listDiv.remove();
        btnNP.remove();
        claimFunds(e.target.id);
      } else if (e.target.textContent === "Mint Nft") {
        listDiv.remove();
        btnNP.remove();
        mintNftComponent(e.target.id);
      } else if (e.target.textContent === "Show Nfts") {
        listDiv.remove();
        btnNP.remove();
        showNftComponent(e.target.id);
      }
    }
  }
  listDiv.addEventListener("click", handleListDivClicks);

  navDiv.appendChild(btnNP);

  const para = document.createElement("p");
  para.id = "headerpara";

  //add invest button disabled to the list
  const btnInvest = document.createElement("button");
  btnInvest.textContent = "Invest:";
  btnInvest.disabled = true;
  para.appendChild(btnInvest);
  //add a hyperlink to the list
  const btnLink = document.createElement("button");
  btnLink.disabled = true;
  btnLink.textContent = "Link to project:";
  para.appendChild(btnLink);
  //add funded to the list
  const btnFund = document.createElement("button");
  btnFund.disabled = true;
  btnFund.textContent = "Funded:";
  para.appendChild(btnFund);
  //add goal to the list
  const btnGoal = document.createElement("button");
  btnGoal.disabled = true;
  btnGoal.textContent = "Goal:";
  para.appendChild(btnGoal);
  //add a list of nfts if there are any
  const btnList = document.createElement("button");
  btnList.disabled = true;
  btnList.textContent = " Projects nfts:";
  para.appendChild(btnList);

  listDiv.appendChild(para);

  renderProjectList();
}
