import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Employee {
  'id' : string,
  'ssn' : [] | [string],
  'title' : string,
  'birthDate' : [] | [string],
  'email' : string,
  'middleName' : [] | [string],
  'employeeId' : string,
  'gender' : [] | [string],
  'preferredName' : [] | [string],
  'department' : string,
  'lastName' : string,
  'firstName' : string,
}
export interface _SERVICE {
  'getAllEmployees' : ActorMethod<[], Array<Employee>>,
  'getCurrentUser' : ActorMethod<[], Employee>,
  'getEmployee' : ActorMethod<[string], [] | [Employee]>,
  'searchEmployees' : ActorMethod<[string], Array<Employee>>,
  'updateEmployee' : ActorMethod<[string, Employee], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
