export const idlFactory = ({ IDL }) => {
  const Employee = IDL.Record({
    'id' : IDL.Text,
    'ssn' : IDL.Opt(IDL.Text),
    'title' : IDL.Text,
    'birthDate' : IDL.Opt(IDL.Text),
    'email' : IDL.Text,
    'middleName' : IDL.Opt(IDL.Text),
    'employeeId' : IDL.Text,
    'gender' : IDL.Opt(IDL.Text),
    'preferredName' : IDL.Opt(IDL.Text),
    'department' : IDL.Text,
    'lastName' : IDL.Text,
    'firstName' : IDL.Text,
  });
  return IDL.Service({
    'getAllEmployees' : IDL.Func([], [IDL.Vec(Employee)], ['query']),
    'getCurrentUser' : IDL.Func([], [Employee], ['query']),
    'getEmployee' : IDL.Func([IDL.Text], [IDL.Opt(Employee)], ['query']),
    'searchEmployees' : IDL.Func([IDL.Text], [IDL.Vec(Employee)], ['query']),
    'updateEmployee' : IDL.Func([IDL.Text, Employee], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => { return []; };
