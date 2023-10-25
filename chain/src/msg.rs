use cosmwasm_schema::QueryResponses;
use cosmwasm_std::Coin;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use crate::state::{Config, CredentialEnum, UserInfo};

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
    // Subscribe to a user profile - mints an NFT with class == target prfile DID
    Subscirbe {
        target_profile: String
    }
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema, QueryResponses)]
#[serde(rename_all = "snake_case")]
pub enum QueryMsg {
    // returns the current userInfo (username, bio and DID) for the provided wallet
    #[returns(ResolveRecordResponse)]
    ResolveUserInfo { address: String },
    #[returns(Config)]
    Config {},
    // verifies if the credintial is issues or not
    #[returns(VerifyCredentialResponse)]
    VerifyCredential { data: CredentialEnum },
    // list all credentials linked to a provided wallet
    #[returns(ListCredentialsResponse)]
    ListCredentials { address: String },
    #[returns(ResolveRecordResponse)]
    IsSubscribed { source_profile_did: String, target_profile_did: String },
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
    pub valid: bool,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct IsSubscribedlResponse {
    pub subscribed: bool,
}

