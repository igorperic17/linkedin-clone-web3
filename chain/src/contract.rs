use std::borrow::BorrowMut;
use std::ptr::null;

use crate::coin_helpers::assert_sent_sufficient_coin;
use crate::error::ContractError;
use crate::msg::{
    ExecuteMsg, InstantiateMsg, ListCredentialsResponse, QueryMsg, ResolveRecordResponse,
    VerifyCredentialResponse,
};
use crate::state::{
    self, config, config_read, credential, credential_read, resolver, resolver_read, Config,
    CredentialEnum, UserInfo,
};
use coreum_wasm_sdk::assetnft::{self, DISABLE_SENDING};
use coreum_wasm_sdk::core::{CoreumMsg, CoreumQueries};
use coreum_wasm_sdk::nft::{self, NFT};
use coreum_wasm_sdk::types::coreum::asset;
use cosmwasm_std::{
    entry_point, to_binary, Binary, Deps, DepsMut, Env, MessageInfo, QueryRequest, Response,
    StdError, StdResult,
};
// use uuid::Uuid;

// const MIN_NAME_LENGTH: u64 = 3;
// const MAX_NAME_LENGTH: u64 = 64;

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut<CoreumQueries>,
    _env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, StdError> {
    let config_state = Config {
        purchase_price: msg.purchase_price,
        transfer_price: msg.transfer_price,
        owner: info.sender,
    };

    config(deps.storage).save(&config_state)?;

    Ok(Response::default())
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut<CoreumQueries>,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response<CoreumMsg>, ContractError> {
    match msg {
        ExecuteMsg::Register { did, username, bio } => {
            execute_register(deps, env, info, did, username, bio)
        }
        ExecuteMsg::IssueCredential { credential } => {
            execute_issue_credential(deps, env, info, credential)
        }
        ExecuteMsg::Subscirbe { target_profile } => {
            execute_subscribe(deps, env, info, target_profile)
        }
    }
}

pub fn execute_register(
    deps: DepsMut<CoreumQueries>,
    _env: Env,
    info: MessageInfo,
    did: String,
    username: String,
    bio: String,
) -> Result<Response<CoreumMsg>, ContractError> {
    // we only need to check here - at point of registration
    // validate_name(&name)?;
    let config_state = config(deps.storage).load()?;
    assert_sent_sufficient_coin(&info.funds, config_state.purchase_price)?;

    let key = info.sender.as_bytes();
    // The key should be the wallet of the user info.sender
    let record = UserInfo { did, username, bio };

    // TODO - discuss if we allow editing
    // if (resolver(deps.storage).may_load(key)?).is_some() {
    //     // name is already taken
    //     return Err(ContractError::NameTaken { name });
    // }

    // name is available

    // TODO - mint NFT class for access
    // TODO . only mint if not exists

    let issue_class_msg = CoreumMsg::AssetNFT(assetnft::Msg::IssueClass {
        name: info.sender.to_string(), // class == wallet address for now, switch to DID
        symbol: info.sender.to_string(), // class == wallet address for now, switch to DID
        description: Some("Test description".to_string()),
        uri: None,
        uri_hash: None,
        data: None,
        features: Some(vec![DISABLE_SENDING]),
        royalty_rate: Some("0".to_string()), // we don't want to earn anything? :(
    });

    resolver(deps.storage).save(key, &record)?;

    Ok(Response::default())
}

pub fn execute_subscribe(
    deps: DepsMut<CoreumQueries>,
    _env: Env,
    info: MessageInfo,
    target_profile: String,
) -> Result<Response<CoreumMsg>, ContractError> {
    // we only need to check here - at point of registration
    // validate_name(&name)?;
    let config_state = config(deps.storage).load()?;
    assert_sent_sufficient_coin(&info.funds, config_state.purchase_price)?;

    // let id = Uuid::new_v4().to_string();
    let id = info.sender.to_string();
    match mint_nft(deps, info, target_profile, id) {
        Ok(msg) => return Ok(msg),
        Err(error) => return Err(error),
    }
}

fn mint_nft(
    deps: DepsMut<CoreumQueries>,
    info: MessageInfo,
    class_id: String,
    id: String,
    // account: String,
    // data: Binary,
) -> Result<Response<CoreumMsg>, ContractError> {
    let msg = CoreumMsg::AssetNFT(assetnft::Msg::Mint {
        class_id: class_id.clone(),
        id: id.clone(),
        uri: None,
        uri_hash: None,
        // data: Some(data.clone()), // leaving in case we want to append some data later on
        data: None,
    });

    Ok(Response::new()
        .add_attribute("method", "mint_nft")
        .add_attribute("class_id", class_id)
        .add_attribute("id", id)
        // .add_attribute("data", data.to_string())
        .add_message(msg))
}

// TODO: send money to the owner!!!!!!!
pub fn execute_issue_credential(
    deps: DepsMut<CoreumQueries>,
    _env: Env,
    info: MessageInfo,
    cred: CredentialEnum,
) -> Result<Response<CoreumMsg>, ContractError> {
    let config_state = config(deps.storage).load()?;

    // TODO: uncomment this to allow only the contract owner to issue creds
    // TODO: modify this to allow only trusted entities to issue creds
    if info.sender != config_state.owner {
        return Err(ContractError::Unauthorized {});
    }

    // TODO: change this to the cost of the NFT issue
    assert_sent_sufficient_coin(&info.funds, config_state.purchase_price)?;

    let key: String = match cred.clone() {
        CredentialEnum::Degree { data, vc_hash } => data.owner,
        CredentialEnum::Employment { data, vc_hash } => data.owner,
        CredentialEnum::Event { data, vc_hash } => data.owner,
    };

    let mut binding = credential(deps.storage)
        .load(key.as_bytes())
        .unwrap_or(vec![]);
    let current_list: &mut Vec<CredentialEnum> = binding.as_mut();
    current_list.insert(current_list.len(), cred);
    credential(deps.storage).save(key.as_bytes(), &current_list)?;

    Ok(Response::default())
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps<CoreumQueries>, env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::ResolveUserInfo { address } => query_resolver(deps, env, address),
        QueryMsg::Config {} => to_binary(&config_read(deps.storage).load()?),
        QueryMsg::ListCredentials { address } => query_list_credentials(deps, env, address),
        QueryMsg::VerifyCredential { data } => query_verify_credentials(deps, env, data),
        QueryMsg::IsSubscribed {
            source_profile_did,
            target_profile_did,
        } => {
            let coreum_deps = deps;
            query_is_subscribed(coreum_deps, env, source_profile_did, target_profile_did)
        }
    }
}

fn query_resolver(deps: Deps<CoreumQueries>, _env: Env, address: String) -> StdResult<Binary> {
    let key = address.clone();

    let user_info = match resolver_read(deps.storage).may_load(key.as_bytes())? {
        Some(record) => Some(record),
        None => return Err(StdError::NotFound { kind: address }),
    };
    let resp = ResolveRecordResponse {
        user_info: user_info,
    };

    to_binary(&resp)
}

fn query_list_credentials(
    deps: Deps<CoreumQueries>,
    _env: Env,
    address: String,
) -> StdResult<Binary> {
    let key = address.clone();

    match credential_read(deps.storage).may_load(key.as_bytes())? {
        Some(record) => {
            let resp = ListCredentialsResponse {
                credentials: record,
            };
            return to_binary(&resp);
        }
        None => {}
    };

    StdResult::Err(StdError::NotFound { kind: address })
}

fn query_verify_credentials(
    deps: Deps<CoreumQueries>,
    _env: Env,
    credential: CredentialEnum,
) -> StdResult<Binary> {
    // extract the alledged owner
    let key = match credential.clone() {
        CredentialEnum::Degree { data, vc_hash } => data.owner,
        CredentialEnum::Employment { data, vc_hash } => data.owner,
        CredentialEnum::Event { data, vc_hash } => data.owner,
    };

    match credential_read(deps.storage).may_load(key.as_bytes())? {
        Some(record) => {
            return to_binary(&VerifyCredentialResponse {
                valid: record.contains(&credential),
            })
        }
        None => return StdResult::Err(StdError::NotFound { kind: key.clone() }),
    };
}

fn query_is_subscribed(
    deps: Deps<CoreumQueries>,
    _env: Env,
    source_profile_did: String,
    target_profile_did: String,
) -> StdResult<Binary> {
    // // get the NFT class by id (all profile "subscribers", a.k.a. their NFTs)
    let class_id = target_profile_did.clone();
    let id = source_profile_did.clone();
    let request: QueryRequest<CoreumQueries> =
        CoreumQueries::NFT(nft::Query::NFT { class_id, id }).into();
    let res: Option<nft::NFTResponse> = deps.querier.query(&request)?;

    // // TODO: change this
    match res {
        Some(nft) => to_binary(&true),
        None => to_binary(&false),
    }
}
