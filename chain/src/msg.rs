use cosmwasm_schema::QueryResponses;
use cosmwasm_std::Coin;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use crate::state::{UserInfo, CredentialEnum};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct InstantiateMsg {
    pub purchase_price: Option<Coin>,
    pub transfer_price: Option<Coin>,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    // register DID, bio and username with the sender's account
    Register {
        did: String,
        username: String,
        bio: String,
    },
    // sender is trying to issue a credential
    IssueCredential {
        credential: CredentialEnum,
    },
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum QueryMsg {
    // returns the current userInfo (username, bio and DID) for the provided wallet
    ResolveUserInfo { address: String },
     // magic
    Config {},
    // verifies if the credintial is issues or not
    VerifyCredential {
        data: CredentialEnum
    },
    // list all credentials linked to a provided wallet
    ListCredentials {
        address: String
    }
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct ResolveRecordResponse {
    pub user_info: Option<UserInfo>,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct ListCredentialsResponse {
    pub credentials: Vec<CredentialEnum>,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct VerifyCredentialResponse {
    pub valid: bool
}

