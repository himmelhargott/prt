import { AppConfig, UserSession } from "./_snowpack/pkg/@stacks/connect.js";

const appConfig = new AppConfig(["store_write", "publish_data"]);
export const userSession = new UserSession({ appConfig }); // we will use this export from other files
