const express = require('express');
// import { initAuth } from '@propelauth/express';
const propelAuth = require("@propelauth/express");
const dotenv = require("dotenv")
const cors = require('cors');
const bodyParser = require('body-parser');
dotenv.config();

const app = express();
app.use(bodyParser.json())
app.use(cors({
    origin: 'https://localhost:3000'
  }));
const port = 4000
const verifierKey = `-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1DsxqIjXqM0i5PL6kFVa\n280S3gl96n2YlO6l9ss2XD/GOoDM11LxnwlIBWFXeRGhOVi4dp2pefY4Bh2rg4Z8\n/Nq1Jx+N2uaEk7KH7qcU3uxZT1hr2pp+lEn3VAuAhGg5ReoYkNyYLRh5lhIm2n9g\nvI1SCHE+1OJ6o6jh1xFT2BIHE/oFEOl+Q5tp83Fz26ucrotFTAYKvQgNkVGUSuIT\nCkMk5p7YDaEGd1JYz9R6Upawbjte72mDskm+udYUWlI25j9Cxlv8lH0KWwqPlue6\ncZy3qiTrrLb7NGKFg2zA2J45glXXbwKuDDtURkVaI2LckZ+gF7dld98tcyitNlWR\nbQIDAQAB\n-----END PUBLIC KEY-----`

const {
    requireUser,
    requireOrgMemberWithPermission,
    createUser,
    addUserToOrg,
    fetchUserMetadataByUserId,
    createAccessToken,
    validateApiKey
} = propelAuth.initAuth({
    authUrl: "https://38291285.propelauthtest.com",
    apiKey: "984f58548a2e6d14bd145423d578210e6f12525acd092d55b1ec95946efd8f16fe526ae9da048abf0b9918afa5c196fc",
    manualTokenVerificationMetadata: {
        verifierKey: verifierKey,
        issuer: "https://38291285.propelauthtest.com"
    }
 
})

const requireBillingPermission = requireOrgMemberWithPermission({
    permission: "can_view_billing"
});


app.post("/api/validate_api_token", async (req, res) => {
    const apiToken = req.body.api_token;
    try {
        const apiTokenResponse = await validateApiKey(apiToken)
        const accessToken = await createAccessToken({
            userId: apiTokenResponse.user.userId,
            durationInMinutes: 1440
        })
        return res.json(accessToken);
    } catch (error) {
        return res.status(401).json({ message: "Invalid API Token"})
    }
});

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

app.get("/api/get_user", requireUser, async (req, res) => {
    res.json(req.user);
});


