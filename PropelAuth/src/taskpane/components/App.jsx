import React, { useState } from "react";
import PropTypes from "prop-types";
import Header from "./Header";
import HandleAPIKey from "./HandleAPIKey";
import { makeStyles } from "@fluentui/react-components";
import { insertText } from "../taskpane";
import axios from "axios";

const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
  },
});

const App = (props) => {
  const { title } = props;
  const styles = useStyles();
  const [user, setUser] = useState();

  function setInLocalStorage(key, value) {
    const myPartitionKey = Office.context.partitionKey;
    if (myPartitionKey) {
      localStorage.setItem(myPartitionKey + key, value);
    } else {
      localStorage.setItem(key, value);
    }
  }

  function getFromLocalStorage(key) {
    const myPartitionKey = Office.context.partitionKey;

    // Check if local storage is partitioned.
    if (myPartitionKey) {
      return localStorage.getItem(myPartitionKey + key);
    } else {
      return localStorage.getItem(key);
    }
  }

  async function getUserInformation() {
    const accessToken = getFromLocalStorage("access_token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };
    try {
      const response = await axios.get("http://localhost:4000/api/get_user", config);
      const data = response.data;
      setUser(data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Handle 401 error
        await getAccessToken();
        return getUserInformation();
      } else {
        // eslint-disable-next-line no-undef
        console.error("Error fetching user information:", error);
      }
    }
  }

  async function getAccessToken() {
    const body = {
      api_token: getFromLocalStorage("api_key"),
    };
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await axios.post("http://localhost:4000/api/validate_api_token", body, config);
      const data = response.data;
      setInLocalStorage("access_token", data.access_token);
      window.location.reload();
    } catch (error) {
      // eslint-disable-next-line no-undef
      console.error(error);
    }
  }

  async function logout() {
    setInLocalStorage("access_token", "");
    setInLocalStorage("api_key", "");
    window.location.reload();
  }

  if (!getFromLocalStorage("api_key")) {
    return (
      <div className={styles.root}>
        <Header logo="assets/logo-filled.png" title={title} message="Welcome" />
        <HandleAPIKey insertText={insertText} />
      </div>
    );
  } else if (!getFromLocalStorage("access_token")) {
    getAccessToken();
  } else if (!user) {
    getUserInformation();
  } else {
    return (
      <div>
        <h2>Hey, {user.email}</h2>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }
};

App.propTypes = {
  title: PropTypes.string,
  insertText: PropTypes.func.isRequired,
};

export default App;
