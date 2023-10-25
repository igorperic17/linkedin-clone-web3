#[cfg(test)]
mod tests {
    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
    use cosmwasm_std::{coin, coins, from_binary, Coin, Deps, DepsMut, Addr};

    use crate::contract::{execute, instantiate, query};
    // use crate::error::ContractError;
    use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg, ResolveRecordResponse, ListCredentialsResponse, VerifyCredentialResponse};
    use crate::state::{Config, CredentialDegree, CredentialEnum, CredentialEvent};

    fn assert_did_owner(deps: Deps, owner: &Addr, did: &str) {

        let res = query(
            deps,
            mock_env(),
            QueryMsg::ResolveUserInfo { address: owner.to_string()} ,
        )
        .unwrap();

        let value: ResolveRecordResponse = from_binary(&res).unwrap();
        match value.user_info {
            Some(info) => { assert_eq!(did, info.did); }
            None => { assert!(false) }
        }
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

    // #[test]
    // fn proper_init_no_fees() {
    //     let mut deps = mock_dependencies();

    //     mock_init_no_price(deps.as_mut());

    //     assert_config_state(
    //         deps.as_ref(),
    //         Config {
    //             purchase_price: None,
    //             transfer_price: None,
    //             owner: None,
    //         },
    //     );
    // }

    // #[test]
    // fn proper_init_with_fees() {
    //     let mut deps = mock_dependencies();

    //     mock_init_with_price(deps.as_mut(), coin(3, "token"), coin(4, "token"));

    //     assert_config_state(
    //         deps.as_ref(),
    //         Config {
    //             purchase_price: Some(coin(3, "token")),
    //             transfer_price: Some(coin(4, "token")),
    //         },
    //     );
    // }

    #[test]
    fn register_available_name_and_query_works() {
        let mut deps = mock_dependencies();
        mock_init_no_price(deps.as_mut());
        mock_alice_registers_name(deps.as_mut(), &[]);

        // querying for name resolves to correct address
        let alice = mock_info("alice_key", &[]);
        assert_did_owner(deps.as_ref(), &alice.sender.clone(), "alice_did");

        // querying for name resolves to correct address
        // let alice_2 = mock_info("alice_key_2", &[]);
        // assert_did_owner(deps.as_ref(), &alice_2.sender, "alice_did");
    }



    fn mock_register_diploma(deps: DepsMut, sent: &[Coin], diploma: CredentialEnum) {
        // alice can register an available name
        let info = mock_info("alice_key", sent);
        let msg = ExecuteMsg::IssueCredential { credential: diploma };
        let _res = execute(deps, mock_env(), info, msg)
            .expect("contract successfully handles Register message");
    }

    #[test]
    fn issue_diploma_works() {
        let mut deps = mock_dependencies();
        mock_init_no_price(deps.as_mut());
        mock_alice_registers_name(deps.as_mut(), &[]);

        let diploma = CredentialEnum::Degree { data: CredentialDegree {
            owner: "alice_key".to_string(),
            institution_name: "MIT".to_string(),
            institution_did: "MID_DID".to_string(),
            year: 2023,
        },
            vc_hash: "".to_string(), };

        mock_register_diploma(deps.as_mut(), &[], diploma.clone());

        // check if alice has the diploma
        let res = query(
            deps.as_ref(),
            mock_env(),
            QueryMsg::ListCredentials { address: "alice_key".to_string() } 
        )
        .unwrap();

        let value: ListCredentialsResponse = from_binary(&res).unwrap();
        
        assert!(value.credentials.contains(&diploma));
    }


    #[test]
    fn issue_event_works() {
        let mut deps = mock_dependencies();
        mock_init_no_price(deps.as_mut());
        mock_alice_registers_name(deps.as_mut(), &[]);

        let ebc9_event = CredentialEnum::Event { data: CredentialEvent {
            owner: "alice_key".to_string(),
            event_name: "EBC9 Hackaton".to_string(),
            organizer_did: "EBC".to_string(),
            year: Some(2023),
        },
            vc_hash: "".to_string(), };

        mock_register_diploma(deps.as_mut(), &[], ebc9_event.clone());

        // check if alice has the diploma
        let res = query(
            deps.as_ref(),
            mock_env(),
            QueryMsg::ListCredentials { address: "alice_key".to_string() } 
        )
        .unwrap();

        let value: ListCredentialsResponse = from_binary(&res).unwrap();
        
        assert!(value.credentials.contains(&ebc9_event));

        let ebc9_fake_event_wrong_year = CredentialEnum::Event { data: CredentialEvent {
            owner: "alice_key".to_string(),
            event_name: "EBC9 Hackaton".to_string(),
            organizer_did: "EBC".to_string(),
            year: Some(2022),
        },
            vc_hash: "".to_string(), };
        let ebc9_fake_event_wrong_owner = CredentialEnum::Event { data: CredentialEvent {
            owner: "alice_key_fake".to_string(),
            event_name: "EBC9 Hackaton".to_string(),
            organizer_did: "EBC".to_string(),
            year: Some(2023),
        },
            vc_hash: "".to_string(), };

        assert!(!value.credentials.contains(&ebc9_fake_event_wrong_year));
        assert!(!value.credentials.contains(&ebc9_fake_event_wrong_owner));
    }

    #[test]
    fn credential_verification_works() {
        let mut deps = mock_dependencies();
        mock_init_no_price(deps.as_mut());
        mock_alice_registers_name(deps.as_mut(), &[]);

        let ebc9_event = CredentialEnum::Event { data: CredentialEvent {
            owner: "alice_key".to_string(),
            event_name: "EBC9 Hackaton".to_string(),
            organizer_did: "EBC".to_string(),
            year: Some(2023),
        },
            vc_hash: "".to_string(), };

        mock_register_diploma(deps.as_mut(), &[], ebc9_event.clone());

        // check if alice has the event
        let res = query(
            deps.as_ref(),
            mock_env(),
            QueryMsg::VerifyCredential { data: ebc9_event }
        )
        .unwrap();
        let value: VerifyCredentialResponse = from_binary(&res).unwrap();
        assert_eq!(value.valid, true);


        let ebc9_event_fake = CredentialEnum::Event { data: CredentialEvent {
            owner: "alice_key".to_string(),
            event_name: "EBC9 Hackaton".to_string(),
            organizer_did: "EBC".to_string(),
            year: Some(2022),
        },
            vc_hash: "".to_string(), };
        // check if alice has the fake event (should not have it)
        let res = query(
            deps.as_ref(),
            mock_env(),
            QueryMsg::VerifyCredential { data: ebc9_event_fake }
        )
        .unwrap();
        let value: VerifyCredentialResponse = from_binary(&res).unwrap();
        assert_eq!(value.valid, false);

    }


}