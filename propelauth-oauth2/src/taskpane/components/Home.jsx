import * as React from "react";
import PropTypes from "prop-types";
import Header from "./Header";
import HeroList from "./HeroList";
import TextInsertion from "./TextInsertion";
import { Button, makeStyles } from "@fluentui/react-components";
import { Ribbon24Regular, LockOpen24Regular, DesignIdeas24Regular } from "@fluentui/react-icons";
import { insertText } from "../taskpane";

const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
  },
});

const Home = (props) => {
  const { title } = props;
  const styles = useStyles();
  let loginDialog;

  async function openAuthorizationDialog() {
    try {
      const authEndpoint =
        "https://38291285.propelauthtest.com/propelauth/oauth/authorize?redirect_uri=https://localhost:3000/taskpane.html&client_id=09663a8db6eedef081465c4515603405&response_type=code&state=abc123"; // Replace with your actual endpoint
      const dialog = await Office.context.ui.displayDialogAsync(
        authEndpoint,
        {
          height: 600,
          width: 400,
          displayInIframe: true,
        },
        function (asyncResult) {
          loginDialog = asyncResult.value;
          console.log(asyncResult.status);
          if (asyncResult.status === 'succeeded') {
            console.log('succeeded', loginDialog)
            loginDialog.addEventHandler(Office.EventType.DialogMessageReceived, (arg) => {
              console.log('asdf', args)
              loginDialog.close();
              processLoginMessage(arg);
            });
            loginDialog.addEventHandler(Office.EventType.DialogEventReceived, (arg) => {
              console.log('asdfasdf', args)
              loginDialog.close();
              processLoginDialogEvent(arg);
            });
          }
          
        }
      );
    } catch (error) {
      console.error("Error opening dialog:", error);
    }
  }

  const processLoginMessage = (arg) => {
    // Confirm origin is correct.
    const messageFromDialog = JSON.parse(arg.message);
    console.log("loginMessage", messageFromDialog);
    loginDialog.close();
  };

  const processLoginDialogEvent = (arg) => {
    console.log("loginDialog", arg);
    loginDialog.close();
};

  return (
    <div className={styles.root}>
      <Header logo="assets/logo-filled.png" title={title} message="Welcome" />
      <TextInsertion insertText={insertText} />
      <Button onClick={openAuthorizationDialog}>Login</Button>
    </div>
  );
};

Home.propTypes = {
  title: PropTypes.string,
};

export default Home;
