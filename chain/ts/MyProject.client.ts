/**
* This file was automatically generated by @cosmwasm/ts-codegen@0.35.3.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

import { CosmWasmClient, SigningCosmWasmClient, ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { StdFee } from "@cosmjs/amino";
import { Uint128, InstantiateMsg, Coin, ExecuteMsg, CredentialEnum, CredentialDegree, CredentialEmployment, CredentialEvent, QueryMsg, Addr, Config, ListCredentialsResponse, ResolveRecordResponse, UserInfo, VerifyCredentialResponse } from "./MyProject.types";
export interface MyProjectReadOnlyInterface {
  contractAddress: string;
  resolveUserInfo: ({
    address
  }: {
    address: string;
  }) => Promise<ResolveRecordResponse>;
  config: () => Promise<Config>;
  verifyCredential: ({
    data
  }: {
    data: CredentialEnum;
  }) => Promise<VerifyCredentialResponse>;
  listCredentials: ({
    address
  }: {
    address: string;
  }) => Promise<ListCredentialsResponse>;
}
export class MyProjectQueryClient implements MyProjectReadOnlyInterface {
  client: CosmWasmClient;
  contractAddress: string;

  constructor(client: CosmWasmClient, contractAddress: string) {
    this.client = client;
    this.contractAddress = contractAddress;
    this.resolveUserInfo = this.resolveUserInfo.bind(this);
    this.config = this.config.bind(this);
    this.verifyCredential = this.verifyCredential.bind(this);
    this.listCredentials = this.listCredentials.bind(this);
  }

  resolveUserInfo = async ({
    address
  }: {
    address: string;
  }): Promise<ResolveRecordResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      resolve_user_info: {
        address
      }
    });
  };
  config = async (): Promise<Config> => {
    return this.client.queryContractSmart(this.contractAddress, {
      config: {}
    });
  };
  verifyCredential = async ({
    data
  }: {
    data: CredentialEnum;
  }): Promise<VerifyCredentialResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      verify_credential: {
        data
      }
    });
  };
  listCredentials = async ({
    address
  }: {
    address: string;
  }): Promise<ListCredentialsResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      list_credentials: {
        address
      }
    });
  };
}
export interface MyProjectInterface extends MyProjectReadOnlyInterface {
  contractAddress: string;
  sender: string;
  register: ({
    bio,
    did,
    username
  }: {
    bio: string;
    did: string;
    username: string;
  }, fee?: number | StdFee | "auto", memo?: string, _funds?: Coin[]) => Promise<ExecuteResult>;
  issueCredential: ({
    credential
  }: {
    credential: CredentialEnum;
  }, fee?: number | StdFee | "auto", memo?: string, _funds?: Coin[]) => Promise<ExecuteResult>;
  subscirbe: ({
    targetProfile
  }: {
    targetProfile: string;
  }, fee?: number | StdFee | "auto", memo?: string, _funds?: Coin[]) => Promise<ExecuteResult>;
}
export class MyProjectClient extends MyProjectQueryClient implements MyProjectInterface {
  client: SigningCosmWasmClient;
  sender: string;
  contractAddress: string;

  constructor(client: SigningCosmWasmClient, sender: string, contractAddress: string) {
    super(client, contractAddress);
    this.client = client;
    this.sender = sender;
    this.contractAddress = contractAddress;
    this.register = this.register.bind(this);
    this.issueCredential = this.issueCredential.bind(this);
    this.subscirbe = this.subscirbe.bind(this);
  }

  register = async ({
    bio,
    did,
    username
  }: {
    bio: string;
    did: string;
    username: string;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, _funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      register: {
        bio,
        did,
        username
      }
    }, fee, memo, _funds);
  };
  issueCredential = async ({
    credential
  }: {
    credential: CredentialEnum;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, _funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      issue_credential: {
        credential
      }
    }, fee, memo, _funds);
  };
  subscirbe = async ({
    targetProfile
  }: {
    targetProfile: string;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, _funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      subscirbe: {
        target_profile: targetProfile
      }
    }, fee, memo, _funds);
  };
}