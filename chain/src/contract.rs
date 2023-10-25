use crate::coin_helpers::assert_sent_sufficient_coin;
use crate::error::ContractError;
use crate::msg::{
    ExecuteMsg, InstantiateMsg, ListCredentialsResponse, QueryMsg, ResolveRecordResponse,
    VerifyCredentialResponse,
};
use crate::state::{
    config, config_read, credential, credential_read, resolver, resolver_read, Config,
    CredentialEnum, UserInfo,
};
use coreum_wasm_sdk::assetnft::{self, WHITELISTING};
use coreum_wasm_sdk::core::CoreumMsg;
use cosmwasm_std::{
    entry_point, to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdError, StdResult,
};

// const MIN_NAME_LENGTH: u64 = 3;
// const MAX_NAME_LENGTH: u64 = 64;

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, StdError> {
    let config_state = Config {
        purchase_price: msg.purchase_price,
        transfer_price: msg.transfer_price,
    };

    config(deps.storage).save(&config_state)?;

    Ok(Response::default())
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::Register { did, username, bio } => {
            execute_register(deps, env, info, did, username, bio)
        }
        ExecuteMsg::IssueCredential { credential } => {
            execute_issue_credential(deps, env, info, credential)
        }
    }
}

pub fn execute_register(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    did: String,
    username: String,
    bio: String,
) -> Result<Response, ContractError> {
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
    // let issue_class_msg = CoreumMsg::AssetNFT(assetnft::Msg::IssueClass {
    //     name: msg.name,
    //     symbol: msg.symbol,
    //     description: Some("Test description".to_string()),
    //     uri: None,
    //     uri_hash: None,
    //     data: None,
    //     features: Some(vec![WHITELISTING]),
    //     royalty_rate: Some("0".to_string()),
    // });

    resolver(deps.storage).save(key, &record)?;

    Ok(Response::default())
}

// TODO - mint nft
// fn mint_nft(
//     deps: DepsMut,
//     info: MessageInfo,
//     class_id: String,
//     id: String,
//     account: String,
//     data: Binary,
// ) -> Result<Response<CoreumMsg>, ContractError> {

//     let msg = CoreumMsg::AssetNFT(assetnft::Msg::Mint {
//         class_id: class_id.clone(),
//         id: id.clone(),
//         uri: None,
//         uri_hash: None,
//         data: Some(data.clone()),
//     });

//     Ok(Response::new()
//         .add_attribute("method", "mint_nft")
//         .add_attribute("class_id", class_id)
//         .add_attribute("id", id)
//         .add_attribute("data", data.to_string())
//         .add_message(msg))
// }

// TODO: must pay for this... ?
pub fn execute_issue_credential(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    cred: CredentialEnum,
) -> Result<Response, ContractError> {
    // we only need to check here - at point of registration
    // validate_name(&name)?;
    let config_state = config(deps.storage).load()?;

    // TODO: change this to the cost of the NFT issue
    assert_sent_sufficient_coin(&info.funds, config_state.purchase_price)?;

    let key = info.sender.as_bytes();
    let mut binding = credential(deps.storage).load(key).unwrap_or(vec![]);
    let current_list: &mut Vec<CredentialEnum> = binding.as_mut();
    current_list.insert(current_list.len(), cred);
    credential(deps.storage).save(key, &current_list)?;

    Ok(Response::default())
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::ResolveUserInfo { address } => query_resolver(deps, env, address),
        QueryMsg::Config {} => to_binary(&config_read(deps.storage).load()?),
        QueryMsg::ListCredentials { address } => query_list_credentials(deps, env, address),
        QueryMsg::VerifyCredential { data } => query_verify_credentials(deps, env, data),
    }
}

fn query_resolver(deps: Deps, _env: Env, address: String) -> StdResult<Binary> {
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

fn query_list_credentials(deps: Deps, _env: Env, address: String) -> StdResult<Binary> {
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
    deps: Deps,
    _env: Env,
    credential: CredentialEnum,
) -> StdResult<Binary> {
    // extract the alledged owner
    let key = match credential.clone() {
        CredentialEnum::Degree { data } => data.owner,
        CredentialEnum::Employment { data } => data.owner,
        CredentialEnum::Event { data } => data.owner,
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

// let's not import a regexp library and just do these checks by hand
// fn invalid_char(c: char) -> bool {
//     let is_valid = c.is_digit(10) || c.is_ascii_lowercase() || (c == '.' || c == '-' || c == '_');
//     !is_valid
// }

// validate_name returns an error if the name is invalid
// (we require 3-64 lowercase ascii letters, numbers, or . - _)
// fn validate_name(name: &str) -> Result<(), ContractError> {
//     let length = name.len() as u64;
//     if (name.len() as u64) < MIN_NAME_LENGTH {
//         Err(ContractError::NameTooShort {
//             length,
//             min_length: MIN_NAME_LENGTH,
//         })
//     } else if (name.len() as u64) > MAX_NAME_LENGTH {
//         Err(ContractError::NameTooLong {
//             length,
//             max_length: MAX_NAME_LENGTH,
//         })
//     } else {
//         match name.find(invalid_char) {
//             None => Ok(()),
//             Some(bytepos_invalid_char_start) => {
//                 let c = name[bytepos_invalid_char_start..].chars().next().unwrap();
//                 Err(ContractError::InvalidCharacter { c })
//             }
//         }
//     }
// }
