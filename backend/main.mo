import Bool "mo:base/Bool";

import Array "mo:base/Array";
import Hash "mo:base/Hash";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Text "mo:base/Text";

actor {
    // Define the Employee type
    public type Employee = {
        id: Text;
        firstName: Text;
        lastName: Text;
        middleName: ?Text;
        preferredName: ?Text;
        employeeId: Text;
        email: Text;
        title: Text;
        department: Text;
        birthDate: ?Text;
        ssn: ?Text;
        gender: ?Text;
    };

    // Create a stable variable to store employees
    private stable var employeesEntries : [(Text, Employee)] = [];
    private var employees = HashMap.HashMap<Text, Employee>(10, Text.equal, Text.hash);

    // System functions for upgrades
    system func preupgrade() {
        employeesEntries := Iter.toArray(employees.entries());
    };

    system func postupgrade() {
        employees := HashMap.fromIter<Text, Employee>(employeesEntries.vals(), 10, Text.equal, Text.hash);
    };

    // Helper function to create a new employee
    private func createEmployee(
        firstName: Text,
        lastName: Text,
        employeeId: Text,
        email: Text,
        title: Text,
        department: Text
    ) : Employee {
        {
            id = employeeId;
            firstName = firstName;
            lastName = lastName;
            middleName = null;
            preferredName = null;
            employeeId = employeeId;
            email = email;
            title = title;
            department = department;
            birthDate = null;
            ssn = null;
            gender = null;
        }
    };

    // Initialize with some sample data
    private func initSampleData() {
        let sampleEmployees = [
            createEmployee("Alice", "Smith", "EMP001", "alice@company.com", "Software Engineer", "Engineering"),
            createEmployee("Robert", "Johnson", "EMP002", "robert@company.com", "Product Manager", "Product"),
            createEmployee("Emily", "Davis", "EMP003", "emily@company.com", "HR Specialist", "Human Resources")
        ];

        for (employee in sampleEmployees.vals()) {
            employees.put(employee.id, employee);
        };
    };

    // Call initSampleData when the canister is deployed
    initSampleData();

    // Get all employees
    public query func getAllEmployees() : async [Employee] {
        Iter.toArray(employees.vals())
    };

    // Get a specific employee by ID
    public query func getEmployee(id: Text) : async ?Employee {
        employees.get(id)
    };

    // Update an employee's information
    public func updateEmployee(id: Text, updates: Employee) : async Bool {
        switch (employees.get(id)) {
            case (null) { false };
            case (?existingEmployee) {
                let updatedEmployee : Employee = {
                    id = id;
                    firstName = updates.firstName;
                    lastName = updates.lastName;
                    middleName = updates.middleName;
                    preferredName = updates.preferredName;
                    employeeId = updates.employeeId;
                    email = updates.email;
                    title = updates.title;
                    department = updates.department;
                    birthDate = updates.birthDate;
                    ssn = updates.ssn;
                    gender = updates.gender;
                };
                employees.put(id, updatedEmployee);
                true
            };
        }
    };

    // Search employees
    public query func searchEmployees(term: Text) : async [Employee] {
        let searchTerm = Text.toLowercase(term);
        Array.filter<Employee>(Iter.toArray(employees.vals()), func (emp: Employee) : Bool {
            Text.contains(Text.toLowercase(emp.firstName), #text searchTerm) or
            Text.contains(Text.toLowercase(emp.lastName), #text searchTerm) or
            Text.contains(Text.toLowercase(emp.title), #text searchTerm) or
            Text.contains(Text.toLowercase(emp.department), #text searchTerm)
        })
    };

    // Get current user (for demo purposes, returns a fixed user)
    public query func getCurrentUser() : async Employee {
        switch (employees.get("EMP001")) {
            case (null) {
                // If the sample user doesn't exist, create a default one
                createEmployee("John", "Doe", "EMP001", "john@company.com", "Employee", "General")
            };
            case (?employee) { employee };
        }
    };
}
