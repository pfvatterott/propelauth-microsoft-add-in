import * as React from "react";
import { useState } from "react";
import { Button, Field, Textarea, tokens, makeStyles } from "@fluentui/react-components";
import PropTypes from "prop-types";
import axios from "axios";

const useStyles = makeStyles({
  instructions: {
    fontWeight: tokens.fontWeightSemibold,
    marginTop: "20px",
    marginBottom: "10px",
  },
  textPromptAndInsertion: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  textAreaField: {
    marginLeft: "20px",
    marginTop: "30px",
    marginBottom: "20px",
    marginRight: "20px",
    maxWidth: "50%",
  },
});

const HandleAPIKey = () => {
  const [text, setText] = useState("Input here");

  const handleTextChange = async (event) => {
    setText(event.target.value);
  };

  function setInLocalStorage(key, value) {
    const myPartitionKey = Office.context.partitionKey;
    if (myPartitionKey) {
      localStorage.setItem(myPartitionKey + key, value);
    } else {
      localStorage.setItem(key, value);
    }
  }

  async function getAccessToken() {
    const body = {
      api_token: text,
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
      setInLocalStorage("api_key", text);
      window.location.reload();
    } catch (error) {
      // eslint-disable-next-line no-undef
      console.error(error);
    }
  }

  const styles = useStyles();

  return (
    <div className={styles.textPromptAndInsertion}>
      <a href="https://38291285.propelauthtest.com/account/api_keys/" target="_blank" rel="noopener noreferrer">
        Click here to generate an API key.
      </a>
      <Field className={styles.textAreaField} size="large" label="Enter your API Key.">
        <Textarea size="large" value={text} onChange={handleTextChange} />
      </Field>
      <Button appearance="primary" disabled={false} size="large" onClick={getAccessToken}>
        Confirm API Key
      </Button>
    </div>
  );
};

HandleAPIKey.propTypes = {
  insertText: PropTypes.func.isRequired,
};

export default HandleAPIKey;