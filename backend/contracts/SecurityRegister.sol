// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title A Security register system.
 * @author Arnaud Sene
 * @notice This smart contract aims to manage security register for companies.
 *
 * A company must have a security registers per site.
 * A security register can be split into sectors (fire, doors, gates, etc.).
 * The verification will be part of the security register on a specific type.
 * The verifier (inspector) proceed to a physical verification and then approve the verification.
 * Finally, the company validate the approval and create a NFT with metadata.
 *
 * The security register can be viewed publicly
 */
contract SecurityRegister is ERC721URIStorage {
    using Counters for Counters.Counter;

    struct Company {
        string name;
        string addressName;
        string siret;
        uint256 numberOfRegisters;
    }

    struct CompanyAccount {
        address company;
        bool active;
    }

    struct Register {
        string siteName;
        string securitySector;
    }

    struct VerificationTask {
        Register register;
        address verifier;
        string securityType;
        uint256 date;
        VerificationStatus taskStatus;
    }

    struct Verifier {
        string name;
        string addressName;
        string siret;
        string approvalNumber;
    }

    struct VerifierAccount {
        address company;
        bool active;
    }


    /**
     * @dev A workflow to manage verification status.
     *
     * Status:
     *  - WaitForApproval The verification has been created, the verifier should validate it.
     *  - ValidatedByVerifier The verifier validated the verification, the company should approve it.
     *  - Approved The company approved the verification, the token is ready to be minted.
     *  - Rejected The company rejected the verification, the token is ready to be minted.
     *  - ApprovedWithReservation The company approved with reservation, the verifier should validate a second time.
     */
    enum VerificationStatus {
        WaitForApproval,
        ValidatedByVerifier,
        Approved,
        Rejected,
        ApprovedWithReservation
    }

    Counters.Counter private currentTaskId;

    // Mappings
    // map a company address to a company struct.
    mapping(address => Company) private companies;
    // map a company address to a company account struct (delegation).
    mapping(address => CompanyAccount) private companyAccounts;
    // map a company address to a register struct.
    mapping(address => mapping(uint256 => Register)) private registers;
    // map a uint to a verification task struct.
    mapping(uint256 => VerificationTask) private verificationTasks;
    // map verifier address to a verifier struct.
    mapping(address => Verifier) private verifiers;
    // map a verifier address to verifier account (delegation).
    mapping(address => VerifierAccount) private verifierAccounts;
    // map a company address to a verifier address.
    mapping(address => address) private companyVerifiers;


    // @dev Event emits when a company has been created.
    event CompanyCreated(address _addr, string _name, string _addressName, string _siret);
    // @dev Event emits when a company added an account to delegate the approval status.
    event CompanyAccountAdded(address _company, address _account);
    // @dev Event emits when a company removed an account to delegate the approval status.
    event CompanyAccountRemoved(address _company, address _account);
    // @dev Event emits when a company added a verifier to his company.
    event VerifierAddedToCompany(address _company, address _verifier);
    // @dev Event emits when a register has been created.
    event RegisterCreated(address _addr, string _siteName, string _securitySector, uint256 registerId);
    // @dev Event emits when a verifier has been been created.
    event VerifierCreated(address _verifier, string _name, string _addressName, string _siret, string _approvalNumber);
    // @dev Event emits when a verification task has been created.
    event VerificationTaskCreated(
        address _company,
        address _verifier,
        uint256 _registerId,
        string _securityType,
        uint256 _taskId,
        VerificationStatus _taskStatus
    );
    // @dev Event emits when a verification task has been validated by a verifier.
    event VerificationTaskValidated(address _verifier, uint256 _taskId, VerificationStatus _taskStatus);
    // @dev Event emits when a verification task has been updated by a company.
    event VerificationTaskUpdated(address _company, uint256 _taskId, VerificationStatus _taskStatus);


    /**
     * @notice A modifier to restrict actions only for company account.
     */
    modifier onlyCompany() {
        require(bytes(companies[msg.sender].name).length > 0, "You're not a company!");
        _;
    }

    /**
     * @notice A modifier to restrict actions for all company account.
     */
    modifier onlyCompanyAndAccount() {
        require(
            isCompany(msg.sender) == true || isCompanyAccount(msg.sender) == true,
            "You're not a company or authorized account!");
        _;
    }


    /**
     * @notice A modifier to restrict actions only for verifier account.
     */
    modifier onlyVerifier() {
        require(bytes(verifiers[msg.sender].name).length > 0, "You're not a verifier!");
        _;
    }


    /**
     * @dev Initializes the contract by setting a 'base URI', a `name` and a `symbol'.
     */
    constructor() ERC721("SecurityRegister", "SR") {}

    // external functions

    /**
     * @notice Create a company name.
     * @param  _name The company name.
     * @param _addressName The company address.
     * @param _siret The company siret.
     * Emit a {CompanyCreated} event.
     */
    function createCompany(
        string calldata _name,
        string calldata _addressName,
        string calldata _siret
    )
        external
    {
        require(
            keccak256(abi.encodePacked(_name)) != keccak256(abi.encodePacked(companies[msg.sender].name)),
            "Company already exists!"
        );
        require(bytes(_siret).length > 0, "'siret' cannot be empty!");

        companies[msg.sender] = Company(_name, _addressName, _siret, 0);
        emit CompanyCreated(msg.sender, _name, _addressName, _siret);
    }


    /**
     * @notice Add a company account to manage verification.
     * @param  _account The account address.
     * Only Company account is able to add another account.
     * Emit a {CompanyAccountAdded} event.
     */
    function addCompanyAccount(
        address _account
    )
        external
        onlyCompany
    {
        companyAccounts[_account] = CompanyAccount(msg.sender, true);

        emit CompanyAccountAdded(msg.sender, _account);
    }

    /**
     * @notice Remove a company account.
     * @param  _account The account address.
     * Only Company account is able to remove an account.
     * Emit a {CompanyAccountRemoved} event.
     */
    function removeCompanyAccount(
        address _account
    )
        external
        onlyCompany
    {
        companyAccounts[_account] = CompanyAccount(msg.sender, false);

        emit CompanyAccountRemoved(msg.sender, _account);
    }

    /**
     * @notice Add a verifier to a company.
     * @param  _verifier The verifier address.
     * Only Company account is able to add a verifier.
     * Emit a {CompanyAccountAdded} event.
     */
    function addVerifierToCompany(
        address _verifier
    )
        external
        onlyCompany
    {
        require(companyVerifiers[msg.sender] != _verifier , "Verifier already exists for this company!");

        companyVerifiers[msg.sender] = _verifier;

        emit VerifierAddedToCompany(msg.sender, _verifier);
    }


    /**
     * @notice Create a security register per site.
     * @param _siteName The company site name.
     * @param _securitySector The security register sector (e.g fire).
     * emit a {RegisterCreated} event.
     */
    function createRegister(
        string calldata _siteName,
        string calldata _securitySector
    )
        external
        onlyCompany
    {
        require(isSite(msg.sender, _siteName) == false, "Site already exists!" );

        uint256 _registerId = companies[msg.sender].numberOfRegisters;
        companies[msg.sender].numberOfRegisters++;
        registers[msg.sender][_registerId] = Register(_siteName, _securitySector);

        emit RegisterCreated(msg.sender, _siteName, _securitySector, _registerId);
    }


    /**
     * @notice Create a verifier account.
     * @param _name The verifier company name.
     * @param _addressName The verifier company address.
     * @param _siret The siret number.
     * @param _approvalNumber The government approval number.
     * emit a {VerifierCreated} event.
     */
    function createVerifier(
        string calldata _name,
        string calldata _addressName,
        string calldata _siret,
        string calldata _approvalNumber
    )
        external
    {
        require(
            keccak256(abi.encodePacked(_name)) != keccak256(abi.encodePacked(verifiers[msg.sender].name)),
            "Verifier already exists!"
        );
        require(bytes(_siret).length > 0, "'siret' cannot be empty!");
        require(bytes(_approvalNumber).length > 0, "'approval number' cannot be empty!");
        require(isCompany(msg.sender) == false, "Unable to create a verifier as a company account!");

        verifiers[msg.sender] = Verifier(_name, _addressName, _siret, _approvalNumber);

        emit VerifierCreated(msg.sender, _name, _addressName, _siret, _approvalNumber);
    }


    /**
     * @notice Create a verification task in order to mint the NFT.
     * @param _registerId The security register ID previously created.
     * @param _securityType The security type e.g: extinguisher.
     * emit a {VerificationCreated} event.
     */
    function createVerificationTask(
        uint256 _registerId,
        string calldata _securityType
    )
        external
        onlyCompanyAndAccount
    {
        require(isVerifier(companyVerifiers[msg.sender]) == true, "Verifier does not exists!");
        require(isRegister(msg.sender, _registerId) == true, "Security register ID does not exists!");
        require(bytes(_securityType).length > 0, "'security type' cannot be empty!");

        uint256 taskId = currentTaskId.current();
        currentTaskId.increment();
        Register memory _register = registers[msg.sender][_registerId];

        verificationTasks[taskId] = VerificationTask(
            _register,
            companyVerifiers[msg.sender],
            _securityType,
            block.timestamp,
            VerificationStatus.WaitForApproval
        );

        emit VerificationTaskCreated(
            msg.sender,
            companyVerifiers[msg.sender],
            _registerId,
            _securityType,
            taskId,
            VerificationStatus.WaitForApproval
        );
    }


    /**
     * @notice Validate a verification task once the verifier has completed his job.
     * @param _taskId The verification task id.
     * emit a {VerificationTaskValidated} event.
     */
    function validateVerificationTask(
        uint256 _taskId
    )
        external
        onlyVerifier
    {
        require(verificationTasks[_taskId].verifier == msg.sender, "There is no verification task created!");
        require(
            verificationTasks[_taskId].taskStatus == VerificationStatus.WaitForApproval ||
            verificationTasks[_taskId].taskStatus == VerificationStatus.ApprovedWithReservation,
            "Unable to update the verification task!"
        );
        verificationTasks[_taskId].taskStatus = VerificationStatus.ValidatedByVerifier;

        emit VerificationTaskValidated(
            msg.sender,
            _taskId,
            VerificationStatus.ValidatedByVerifier
        );
    }


    /**
     * @notice Update a verification task once the verifier has validated it.
     * @param _taskId The verification task id.
     * Only company are able to manage this state.
     * emit a {VerificationTaskUpdated} event.
     */
    function updateVerificationTask(
        uint256 _taskId,
        string calldata _action
    )
        external
        onlyCompany
    {
        require(bytes(verificationTasks[_taskId].securityType).length > 0, "There is no verification task created!");
        require(
            verificationTasks[_taskId].taskStatus == VerificationStatus.ValidatedByVerifier,
            "Unable to approve the verification task, because it has not been validated yet!"
        );
        require(
            keccak256(abi.encodePacked(_action)) == keccak256(abi.encodePacked("approve")) ||
            keccak256(abi.encodePacked(_action)) == keccak256(abi.encodePacked("reject")) ||
            keccak256(abi.encodePacked(_action)) == keccak256(abi.encodePacked("approveWithReservation")),
            "Invalid action has been provided!"
        );

        VerificationStatus _verificationStatus;

        if( keccak256(abi.encodePacked(_action)) == keccak256(abi.encodePacked("approve"))) {
            _verificationStatus = VerificationStatus.Approved;
        }
        if (keccak256(abi.encodePacked(_action)) == keccak256(abi.encodePacked("reject"))) {
            _verificationStatus = VerificationStatus.Rejected;
        }
        if (keccak256(abi.encodePacked(_action)) == keccak256(abi.encodePacked("approveWithReservation"))) {
            _verificationStatus = VerificationStatus.ApprovedWithReservation;
        }

        verificationTasks[_taskId].taskStatus = _verificationStatus;
        emit VerificationTaskUpdated(msg.sender, _taskId, _verificationStatus);
    }


    /**
     * @notice Safely mints `tokenId` and transfers it to `to`.
     * @param _tokenId The token ID.
     *
     * Requirements:
     *  - Only company can mint a token.
     *  - Status must be approved or rejected.
     *
     */
    function safeMint(uint256 _tokenId, string calldata _tokenURI) external onlyCompany {
        require(
            getVerificationTaskStatus(_tokenId) == VerificationStatus.Approved ||
            getVerificationTaskStatus(_tokenId) == VerificationStatus.Rejected,
            "Unable to mint a token until status is approved or rejected!"
        );
        _mint(msg.sender, _tokenId);
        _setTokenURI(_tokenId, _tokenURI);
    }


    // public functions

    /**
     * @notice Check if a company has been created.
     * @return true or false.
     */
    function isCompany(address _company) public view returns (bool) {
        return bytes(companies[_company].name).length > 0;
    }

    /**
     * @notice Check if a company account has been created.
     * @return true or false.
     */
    function isCompanyAccount(address _account) public view returns (bool) {
        return companyAccounts[_account].active == true;
    }


    /**
     * @notice Check that a verifier has been created.
     * @return true or false.
     */
    function isVerifier(address _verifier) public view returns (bool) {
        return bytes(verifiers[_verifier].name).length > 0;
    }


    /**
     * @notice Check that a security register has been created.
     * @return true or false.
     */
    function isRegister(address _company, uint256 _registerId) public view returns (bool) {
        return bytes(registers[_company][_registerId].siteName).length > 0;
    }


    /**
     * @notice Check that a site has been created.
     * @return true or false.
     */
    function isSite(address _company, string calldata _siteName) public view returns (bool) {
        for(uint256 i = 0; i < companies[_company].numberOfRegisters; ++i ) {
            if (keccak256(abi.encodePacked(registers[_company][i].siteName)) == keccak256(abi.encodePacked(_siteName)))
                return true;
        }
        return false;
    }


    /**
     * @notice Get a verification task status by his ID.
     * @param _taskId The verification task ID.
     * @return The verification task status.
     */
    function getVerificationTaskStatus(uint256 _taskId) public view returns (VerificationStatus) {
        require(bytes(abi.encodePacked(verificationTasks[_taskId].date)).length > 0, "taskID does not exist!");
        return verificationTasks[_taskId].taskStatus;
    }
}
