import { showConnect } from "@stacks/connect";
import { userSession } from "./userSession";
import { globalsObject, createStartPage } from "./script.js";

export function connectWallet(callback) {
  const appDetails = {
    name: "ProjectRoundTable", // shown in wallet pop-up
    icon: "./my_logo.png",
  };

  showConnect({
    userSession, // `userSession` from previous step, to access storage
    appDetails,
    onFinish: () => {
      console.log("connected"); // WHEN user confirms pop-up
            
      const userData = userSession.loadUserData();
      //console.log(userData);
      //console.log(`userStxAddress: ${userStxAddress}`);
      //console.log("key: " + userData.appPrivateKey);
  
      globalsObject.userStxAddress = userData.profile.stxAddress.testnet;
      globalsObject.state = "loggedIn";

      console.log(globalsObject.state);

      callback();
    },
    onCancel: () => {
      console.log("Connecting cancelled by user"); // WHEN user cancels/closes pop-up
      createStartPage();
    },
  });
}
