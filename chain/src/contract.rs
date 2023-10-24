use cosmwasm_std::{
    entry_point, to_binary, Addr, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdError,
    StdResult,
};

use crate::coin_helpers::assert_sent_sufficient_coin;
use crate::error::ContractError;
use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg, ResolveRecordResponse};
use crate::state::{config, config_read, resolver, resolver_read, Config, UserInfo};

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
    resolver(deps.storage).save(key, &record)?;

    Ok(Response::default())
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::ResolveUserInfo { address } => query_resolver(deps, env, address),
        QueryMsg::Config {} => to_binary(&config_read(deps.storage).load()?),
    }
}

fn query_resolver(deps: Deps, _env: Env, address: Addr) -> StdResult<Binary> {
    let key = address.as_bytes();

    let user_info = match resolver_read(deps.storage).may_load(key)? {
        Some(record) => Some(record),
        None => None,
    };
    let resp = ResolveRecordResponse { user_info: user_info.unwrap() };

    to_binary(&resp)
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
