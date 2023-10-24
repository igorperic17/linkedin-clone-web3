#[cfg(test)]
mod tests {
    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
    use cosmwasm_std::{coin, coins, from_binary, Coin, Deps, DepsMut, Addr};

    use crate::contract::{execute, instantiate, query};
    // use crate::error::ContractError;
    use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg, ResolveRecordResponse};
    use crate::state::Config;

    fn assert_did_owner(deps: Deps, owner: &Addr, did: &str) {
        // let add : &[u8] = owner.as_bytes().clone();
        // Create an owned vector from the borrowed data, so it's no longer a temporary value.
        let owner_bytes: Vec<u8> = owner.as_bytes().to_vec();  // Change is here

        let res = query(
            deps,
            mock_env(),
            QueryMsg::ResolveUserInfo { address: owner_bytes} ,
        )
        .unwrap();

        let value: ResolveRecordResponse = from_binary(&res).unwrap();
        assert_eq!(did, value.user_info.did);
    }

    fn assert_config_state(deps: Deps, expected: Config) {
        let res = query(deps, mock_env(), QueryMsg::Config {}).unwrap();
        let value: Config = from_binary(&res).unwrap();
        assert_eq!(value, expected);
    }

    fn mock_init_with_price(deps: DepsMut, purchase_price: Coin, transfer_price: Coin) {
        let msg = InstantiateMsg {
            purchase_price: Some(purchase_price),
            transfer_price: Some(transfer_price),
        };

        let info = mock_info("creator", &coins(2, "token"));
        let _res = instantiate(deps, mock_env(), info, msg)
            .expect("contract successfully handles InstantiateMsg");
    }

    fn mock_init_no_price(deps: DepsMut) {
        let msg = InstantiateMsg {
            purchase_price: None,
            transfer_price: None,
        };

        let info = mock_info("creator", &coins(2, "token"));
        let _res = instantiate(deps, mock_env(), info, msg)
            .expect("contract successfully handles InstantiateMsg");
    }

    fn mock_alice_registers_name(deps: DepsMut, sent: &[Coin]) {
        // alice can register an available name
        let info = mock_info("alice_key", sent);
        let msg = ExecuteMsg::Register {
            did: "alice_did".to_string(),
            username: "alice_username".to_string(),
            bio: "alice_bio".to_string(),
        };
        let _res = execute(deps, mock_env(), info, msg)
            .expect("contract successfully handles Register message");
    }

    #[test]
    fn proper_init_no_fees() {
        let mut deps = mock_dependencies(&[]);

        mock_init_no_price(deps.as_mut());

        assert_config_state(
            deps.as_ref(),
            Config {
                purchase_price: None,
                transfer_price: None,
            },
        );
    }

    #[test]
    fn proper_init_with_fees() {
        let mut deps = mock_dependencies(&[]);

        mock_init_with_price(deps.as_mut(), coin(3, "token"), coin(4, "token"));

        assert_config_state(
            deps.as_ref(),
            Config {
                purchase_price: Some(coin(3, "token")),
                transfer_price: Some(coin(4, "token")),
            },
        );
    }

    #[test]
    fn register_available_name_and_query_works() {
        let mut deps = mock_dependencies(&[]);
        mock_init_no_price(deps.as_mut());
        mock_alice_registers_name(deps.as_mut(), &[]);

        // querying for name resolves to correct address
        let alice = mock_info("alice_key", &[]);
        assert_did_owner(deps.as_ref(), &alice.sender.clone(), "alice_did");

        // querying for name resolves to correct address
        // let alice_2 = mock_info("alice_key_2", &[]);
        // assert_did_owner(deps.as_ref(), &alice_2.sender, "alice_did");
    }

}
