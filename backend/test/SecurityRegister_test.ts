import { expect } from "chai"
import { ethers } from "hardhat"
import { SecurityRegister } from "../typechain-types"
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers"


describe( "SecurityRegister", () => {
    const deployDefaultContract = async () => {

        const SecurityRegister = await ethers.getContractFactory("SecurityRegister")
        const securityRegister = await SecurityRegister.deploy()
        const [
            owner,
            acc1,
            acc2,
            acc3,
            acc4,
            acc5
        ] = await ethers.getSigners()
        return { securityRegister, owner, acc1, acc2, acc3, acc4, acc5 }
    }

    context("Create a company", async () => {
        let _securityRegister: SecurityRegister
        let _company1: HardhatEthersSigner
        let _company2: HardhatEthersSigner

        beforeEach(async () => {

            const {
                securityRegister,
                acc1,
                acc2,
            } = await deployDefaultContract()

            _securityRegister = securityRegister
            _company1 = acc1
            _company2 = acc2
        })

        // test createCompany
        it("prevent from creating the same company name", async () => {
            await _securityRegister.connect(_company1).createCompany("fakeName", "fakeAddress", "fakeSiret")
            await expect(_securityRegister.connect(_company1)
                .createCompany("fakeName", "fakeAddress", "fakeSiret"))
                .to.be.revertedWith("Company already exists!")
        })

        it("prevent from not providing a siret", async () => {
            await expect(_securityRegister.connect(_company1).createCompany("fakeName", "fakeAddress", ""))
                .to.be.revertedWith("'siret' cannot be empty!")
        })

        it("should emit an event at company creation", async () => {
            await expect(_securityRegister.connect(_company1)
                .createCompany("fakeName", "fakeAddress", "fakeSiret"))
                .to.emit(_securityRegister, "CompanyCreated")
                .withArgs(_company1.address, "fakeName", "fakeAddress", "fakeSiret")
        })

        // test isCompany
        it("should get false if no company has been created", async () => {
            expect(await _securityRegister.isCompany(_company1)).to.be.equal(false)
        })

        it("should get true if a company has been created", async () => {
            await _securityRegister.connect(_company1).createCompany("fakeName", "fakeAddress", "fakeSiret")
            expect(await _securityRegister.isCompany(_company1)).to.be.equal(true)
        })
    })

    context("Manage company account and verifier", async () => {
        let _securityRegister: SecurityRegister
        let _company: HardhatEthersSigner
        let _account: HardhatEthersSigner
        let _account2: HardhatEthersSigner
        let _verifier: HardhatEthersSigner

        beforeEach(async () => {

            const {
                securityRegister,
                acc1,
                acc2,
                acc3,
                acc4,
            } = await deployDefaultContract()

            _securityRegister = securityRegister
            _company = acc1
            _account = acc2
            _verifier = acc3
            _account2 = acc4
        })

        // test addCompanyAccount
        it("prevent from adding an account if sender not the company owner", async () => {
            await expect(_securityRegister.connect(_company).addCompanyAccount(_account))
                .to.be.revertedWith("You're not a company!")
        })

        it("should add an account and emit an event {CompanyAccountAdded}", async () => {
            await _securityRegister.connect(_company).createCompany("fakeName", "fakeAddress", "fakeSiret")

            await expect(_securityRegister.connect(_company).addCompanyAccount(_account))
                .to.emit(_securityRegister, "CompanyAccountAdded")
                .withArgs(_company.address, _account.address)
        })

        // test isCompanyAccount
        it("should get false if no account company has been added", async () => {
            await _securityRegister.connect(_company).createCompany("fakeName", "fakeAddress", "fakeSiret")

            expect(await _securityRegister.isCompanyAccount(_account)).to.be.equal(false)
        })

        it("should get true if no account company has been added", async () => {
            await _securityRegister.connect(_company).createCompany("fakeName", "fakeAddress", "fakeSiret")
            await _securityRegister.connect(_company).addCompanyAccount(_account)
            await _securityRegister.connect(_company).addCompanyAccount(_account2)

            expect(await _securityRegister.isCompanyAccount(_account)).to.be.equal(true)
            expect(await _securityRegister.isCompanyAccount(_account2)).to.be.equal(true)
        })

        // removeCompanyAccount
        it("prevent from removing an account if sender not the company owner", async () => {
            await expect(_securityRegister.connect(_company).removeCompanyAccount(_account))
                .to.be.revertedWith("You're not a company!")
        })

        it("should remove an account and emit an event {CompanyAccountRemoved}", async () => {
            await _securityRegister.connect(_company).createCompany("fakeName", "fakeAddress", "fakeSiret")
            await _securityRegister.connect(_company).addCompanyAccount(_account)
            expect(await _securityRegister.isCompanyAccount(_account)).to.be.equal(true)

            await expect(_securityRegister.connect(_company).removeCompanyAccount(_account))
                .to.emit(_securityRegister, "CompanyAccountRemoved")
                .withArgs(_company.address, _account.address)
            expect(await _securityRegister.isCompanyAccount(_account)).to.be.equal(false)
        })

        // test addVerifierToCompany
        it("prevent from adding a verifier to a company if sender not a company", async () => {
            await expect(_securityRegister.connect(_account).addVerifierToCompany(_verifier))
                .to.revertedWith("You're not a company!")
        })

        it("prevent from adding the verifier twice", async () => {
            await _securityRegister.connect(_company).createCompany("fakeName", "fakeAddress", "fakeSiret")
            await _securityRegister.connect(_company).addVerifierToCompany(_verifier)
            await expect(_securityRegister.connect(_company).addVerifierToCompany(_verifier))
                .to.be.revertedWith("Verifier already exists for this company!")
        })

        it("should add a verifier to a company and emit an event {VerifierAddedToCompany}",
            async () => {
            await _securityRegister.connect(_company).createCompany("fakeName", "fakeAddress", "fakeSiret")
            await expect(_securityRegister.connect(_company).addVerifierToCompany(_verifier))
                .to.emit(_securityRegister, "VerifierAddedToCompany")
                .withArgs(_company.address, _verifier.address)
        })
    })

    context("Company security register per site", async () => {
        let _securityRegister: SecurityRegister
        let _company1: HardhatEthersSigner
        let _company2: HardhatEthersSigner
        let _company3: HardhatEthersSigner
        let _other: HardhatEthersSigner

        beforeEach(async () => {

            const {
                securityRegister,
                acc1,
                acc2,
                acc3,
                acc4,
            } = await deployDefaultContract()

            _securityRegister = securityRegister
            _company1 = acc1
            _company2 = acc2
            _company3 = acc3
            _other = acc4
        })

        // test createRegister
        it("prevent from adding a site if sender not a company", async () => {
            await expect(_securityRegister.connect(_other).createRegister("fakeSite", "fakeSecuritySector"))
                .to.be.revertedWith("You're not a company!")
        })

        it("prevent from adding the site twice", async () => {
            await _securityRegister.connect(_company1).createCompany("fakeName", "fakeAddress", "fakeSiret")
            await _securityRegister.connect(_company1).createRegister("fakeSite", "fakeSecuritySector")

            await expect(_securityRegister.connect(_company1).createRegister("fakeSite", "fakeSecuritySector"))
                .to.be.revertedWith("Site already exists!")
        })

        it("should add a site and emit a {RegisterCreated} event", async () => {
            await _securityRegister.connect(_company1).createCompany("fakeName", "fakeAddress", "fakeSiret")

            await expect(_securityRegister.connect(_company1).createRegister("fakeSite", "fakeSecuritySector"))
                .to.emit(_securityRegister, "RegisterCreated")
                .withArgs(_company1.address, "fakeSite", "fakeSecuritySector", BigInt("0"))
        })

        it("should add more than one site per company and emit a {RegisterCreated} event", async () => {
            await _securityRegister.connect(_company1).createCompany("fakeName", "fakeAddress", "fakeSiret")

            await expect(_securityRegister.connect(_company1).createRegister("fakeSite1", "fakeSecuritySector1"))
                .to.emit(_securityRegister, "RegisterCreated")
                .withArgs(_company1.address, "fakeSite1", "fakeSecuritySector1", BigInt("0"))

            await expect(_securityRegister.connect(_company1).createRegister("fakeSite2", "fakeSecuritySector2"))
                .to.emit(_securityRegister, "RegisterCreated")
                .withArgs(_company1.address, "fakeSite2", "fakeSecuritySector2", BigInt("1"))
        })

        it("should add more than one site for 3 companies and emit a {RegisterCreated} event", async () => {
            await _securityRegister.connect(_company1).createCompany("fakeName1", "fakeAddress1", "fakeSiret1")
            await _securityRegister.connect(_company2).createCompany("fakeName2", "fakeAddress2", "fakeSiret2")
            await _securityRegister.connect(_company3).createCompany("fakeName3", "fakeAddress3", "fakeSiret3")

            // company 1
            // registerId = 0
            await expect(_securityRegister.connect(_company1).createRegister("fakeSite1", "fakeSecuritySector1"))
                .to.emit(_securityRegister, "RegisterCreated")
                .withArgs(_company1.address, "fakeSite1", "fakeSecuritySector1", BigInt("0"))
            // registerId = 1
            await expect(_securityRegister.connect(_company1).createRegister("fakeSite2", "fakeSecuritySector2"))
                .to.emit(_securityRegister, "RegisterCreated")
                .withArgs(_company1.address, "fakeSite2", "fakeSecuritySector2", BigInt("1"))

            // company 2
            // registerId = 0
            await expect(_securityRegister.connect(_company2).createRegister("fakeSite1", "fakeSecuritySector1"))
                .to.emit(_securityRegister, "RegisterCreated")
                .withArgs(_company2.address, "fakeSite1", "fakeSecuritySector1", BigInt("0"))
            // registerId = 1
            await expect(_securityRegister.connect(_company2).createRegister("fakeSite2", "fakeSecuritySector2"))
                .to.emit(_securityRegister, "RegisterCreated")
                .withArgs(_company2.address, "fakeSite2", "fakeSecuritySector2", BigInt("1"))

            // company 3
            // registerId = 0
            await expect(_securityRegister.connect(_company3).createRegister("fakeSite1", "fakeSecuritySector1"))
                .to.emit(_securityRegister, "RegisterCreated")
                .withArgs(_company3.address, "fakeSite1", "fakeSecuritySector1", BigInt("0"))
            // registerId = 1
            await expect(_securityRegister.connect(_company3).createRegister("fakeSite2", "fakeSecuritySector2"))
                .to.emit(_securityRegister, "RegisterCreated")
                .withArgs(_company3.address, "fakeSite2", "fakeSecuritySector2", BigInt("1"))
        })

        // test isSite
        it("should return false if no site has been created", async () => {
            await _securityRegister.connect(_company1).createCompany("fakeName", "fakeAddress", "fakeSiret")

            expect(await _securityRegister.isSite(_company1, "fakeSite")).to.be.equal(false)
        })

        it("should return true if a site has been created", async () => {
            await _securityRegister.connect(_company1).createCompany("fakeName", "fakeAddress", "fakeSiret")
            await _securityRegister.connect(_company1).createRegister("fakeSite", "fakeSecuritySector")

            expect(await _securityRegister.isSite(_company1, "fakeSite")).to.be.equal(true)
        })
    })

    context("Create a verifier", async () => {
        let _securityRegister: SecurityRegister
        let _verifier1: HardhatEthersSigner
        let _company1: HardhatEthersSigner

        beforeEach(async () => {

            const {
                securityRegister,
                acc1,
                acc2,
            } = await deployDefaultContract()

            _securityRegister = securityRegister
            _verifier1 = acc1
            _company1 = acc2
        })

        // test createVerifier
        it("prevent from creating the same verifier name", async () => {
            await _securityRegister.connect(_verifier1).createVerifier(
                "fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber")
            await expect(_securityRegister.connect(_verifier1).createVerifier(
                "fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber"))
                .to.be.revertedWith("Verifier already exists!")
        })

        it("prevent from not providing a siret", async () => {
            await expect(_securityRegister.connect(_verifier1).createVerifier(
                "fakeName", "fakeAddress", "", "fakeApprovalNumber"))
                .to.be.revertedWith("'siret' cannot be empty!")
        })

        it("prevent from not providing an approval number", async () => {
            await expect(_securityRegister.connect(_verifier1).createVerifier(
                "fakeName", "fakeAddress", "fakeSiret", ""))
                .to.be.revertedWith("'approval number' cannot be empty!")
        })

        it("prevent from creating a verifier as a company", async () => {
            await _securityRegister.connect(_company1).createCompany("fakeName", "fakeAddress", "fakeSiret")
            await expect(_securityRegister.connect(_company1).createVerifier(
                "fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber"))
                .to.be.revertedWith("Unable to create a verifier as a company account!")
        })

        it("should emit an event at verifier creation", async () => {
            await expect(_securityRegister.connect(_verifier1).createVerifier(
                "fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber"))
                .to.emit(_securityRegister, "VerifierCreated")
                .withArgs(_verifier1.address, "fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber")
        })

        // test isVerifier
        it("should get false if no verifier has been created", async () => {
            expect(await _securityRegister.isVerifier(_verifier1.address)).to.be.equal(false)
        })

        it("should get true if a verifier has been created", async () => {
            await _securityRegister.connect(_verifier1).createVerifier(
                "fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber")

            expect(await _securityRegister.isVerifier(_verifier1.address)).to.be.equal(true)
        })
    })

    context("Init a verification task", async () => {
        let _securityRegister: SecurityRegister
        let _company1: HardhatEthersSigner
        let _verifier1: HardhatEthersSigner
        let _delegatedAccount1: HardhatEthersSigner

        beforeEach(async () => {

            const {
                securityRegister,
                acc1,
                acc2,
                acc3,
            } = await deployDefaultContract()

            _securityRegister = securityRegister
            _company1 = acc1
            _verifier1 = acc2
            _delegatedAccount1 = acc3
        })

        // Test createVerificationTask
        it("prevent from creating a verification task without a company", async () => {
            await expect(_securityRegister.connect(_company1).createVerificationTask(0, "fakeSecurityType"))
                .to.be.revertedWith("You're not a company or authorized account!")
        })

        it("prevent from creating a verification task without a verifier", async () => {
            await _securityRegister.connect(_company1).createCompany("fakeName", "fakeAddress", "fakeSiret")
            await expect(_securityRegister.connect(_company1).createVerificationTask(0, "fakeSecurityType"))
                .to.be.revertedWith("Verifier does not exists!")
        })

        it("prevent from creating a verification task with no register created (registerId)",async () => {
            await _securityRegister.connect(_company1).createCompany("fakeName", "fakeAddress", "fakeSiret")
            await _securityRegister.connect(_verifier1)
                .createVerifier("fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber")
            await _securityRegister.connect(_company1).addVerifierToCompany(_verifier1)

            await expect(_securityRegister.connect(_company1).createVerificationTask(0, "fakeSecurityType"))
                .to.be.revertedWith("Security register ID does not exists!")
        })

        it("prevent from creating a verification task with securityType empty", async () => {
            await _securityRegister.connect(_company1).createCompany("fakeName", "fakeAddress", "fakeSiret")
            await _securityRegister.connect(_verifier1)
                .createVerifier("fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber")
            await _securityRegister.connect(_company1).addVerifierToCompany(_verifier1)
            await _securityRegister.connect(_company1).createRegister("fakeSiteName", "fakeSecuritySector")

            await expect(_securityRegister.connect(_company1).createVerificationTask(0, ""))
                .to.be.revertedWith("'security type' cannot be empty!")
        })

        it("should create a verification task and emit a {VerificationTaskCreated} event",async () => {
            await _securityRegister.connect(_company1).createCompany("fakeName", "fakeAddress", "fakeSiret")
            await _securityRegister.connect(_verifier1)
                .createVerifier("fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber")
            await _securityRegister.connect(_company1).addVerifierToCompany(_verifier1)
            await _securityRegister.connect(_company1).createRegister("fakeSiteName", "fakeSecuritySector")

            await expect(_securityRegister.connect(_company1).createVerificationTask(0, "fakeSecurityType"))
                .to.emit(_securityRegister, "VerificationTaskCreated")
                .withArgs(_company1.address, _verifier1.address, 0, "fakeSecurityType", 0, 0)
        })

        // test getVerificationTaskStatus
        it("should get the task status => 0",async () => {
            await _securityRegister.connect(_company1).createCompany("fakeName", "fakeAddress", "fakeSiret")
            await _securityRegister.connect(_verifier1)
                .createVerifier("fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber")
            await _securityRegister.connect(_company1).addVerifierToCompany(_verifier1)
            await _securityRegister.connect(_company1).createRegister("fakeSiteName", "fakeSecuritySector")
            await _securityRegister.connect(_company1).createVerificationTask(0, "fakeSecurityType")

            expect(await _securityRegister.getVerificationTaskStatus(0)).to.be.equal(BigInt("0"))
        })

        it("prevent from providing a invalid taskId",async () => {
            expect(await _securityRegister.getVerificationTaskStatus(999))
                .to.be.revertedWith("taskID does not exist!")
        })

        // isRegister
        it("should get false if no register has been created",async () => {
            await _securityRegister.connect(_company1).createCompany("fakeName", "fakeAddress", "fakeSiret")
            await _securityRegister.connect(_verifier1)
                .createVerifier("fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber")
            await _securityRegister.connect(_company1).addVerifierToCompany(_verifier1)

            expect(await _securityRegister.isRegister(_company1, 0)).to.be.equal(false)
        })

        it("should get true if a register has been created",async () => {
            await _securityRegister.connect(_company1).createCompany("fakeName", "fakeAddress", "fakeSiret")
            await _securityRegister.connect(_verifier1)
                .createVerifier("fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber")
            await _securityRegister.connect(_company1).addVerifierToCompany(_verifier1)
            // create 2 registers, with registerId 0 and 1
            await _securityRegister.connect(_company1).createRegister("fakeSiteName1", "fakeSecuritySector")
            await _securityRegister.connect(_company1).createRegister("fakeSiteName2", "fakeSecuritySector")

            expect(await _securityRegister.isRegister(_company1, 0)).to.be.equal(true)
            expect(await _securityRegister.isRegister(_company1, 1)).to.be.equal(true)
        })

    })

    context("Validate a verification task by a verifier", async () => {
        let _securityRegister: SecurityRegister
        let _company1: HardhatEthersSigner
        let _verifier1: HardhatEthersSigner

        beforeEach(async () => {

            const {
                securityRegister,
                acc1,
                acc2,
            } = await deployDefaultContract()

            _securityRegister = securityRegister
            _company1 = acc1
            _verifier1 = acc2
        })

        // test validateVerificationTask
        it("prevent from updating a verification task as a non verifier", async () => {
            await expect(_securityRegister.connect(_verifier1).validateVerificationTask(0))
                .to.be.revertedWith("You're not a verifier!")
        })

        it("prevent from updating a verification task with no task created", async () => {
            await _securityRegister.connect(_verifier1)
                .createVerifier("fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber")
            await expect(_securityRegister.connect(_verifier1).validateVerificationTask(0))
                .to.be.revertedWith("There is no verification task created!")
        })

        it("prevent from updating a verification task while status is rejected", async () => {
            await _securityRegister.connect(_company1).createCompany("fakeName", "fakeAddress", "fakeSiret")
            await _securityRegister.connect(_verifier1)
                .createVerifier("fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber")
            await _securityRegister.connect(_company1).addVerifierToCompany(_verifier1)
            await _securityRegister.connect(_company1).createRegister("fakeSiteName", "fakeSecuritySector")
            await _securityRegister.connect(_company1).createVerificationTask(0, "fakeSecurityType")
            await _securityRegister.connect(_verifier1).validateVerificationTask(0)
            await _securityRegister.connect(_company1).updateVerificationTask(0, "reject")

            await expect(_securityRegister.connect(_verifier1).validateVerificationTask(0))
                .to.be.revertedWith("Unable to update the verification task!")
        })

        it("prevent from updating a verification task while status is approved", async () => {
            await _securityRegister.connect(_company1).createCompany("fakeName", "fakeAddress", "fakeSiret")
            await _securityRegister.connect(_verifier1)
                .createVerifier("fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber")
            await _securityRegister.connect(_company1).addVerifierToCompany(_verifier1)
            await _securityRegister.connect(_company1).createRegister("fakeSiteName", "fakeSecuritySector")
            await _securityRegister.connect(_company1).createVerificationTask(0, "fakeSecurityType")
            await _securityRegister.connect(_verifier1).validateVerificationTask(0)
            await _securityRegister.connect(_company1).updateVerificationTask(0, "approve")

            await expect(_securityRegister.connect(_verifier1).validateVerificationTask(0))
                .to.be.revertedWith("Unable to update the verification task!")
        })

        it("should update a verification task and emit {VerificationTaskValidated} event", async () => {
            await _securityRegister.connect(_company1).createCompany("fakeName", "fakeAddress", "fakeSiret")
            await _securityRegister.connect(_verifier1)
                .createVerifier("fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber")
            await _securityRegister.connect(_company1).addVerifierToCompany(_verifier1)
            await _securityRegister.connect(_company1).createRegister("fakeSiteName", "fakeSecuritySector")
            await _securityRegister.connect(_company1).createVerificationTask(0, "fakeSecurityType")

            await expect(_securityRegister.connect(_verifier1).validateVerificationTask(0))
                .to.be.emit(_securityRegister, "VerificationTaskValidated")
                .withArgs(_verifier1.address, 0, 1)
        })

        it("should update a verification task and get the status = 1", async () => {
            await _securityRegister.connect(_company1).createCompany("fakeName", "fakeAddress", "fakeSiret")
            await _securityRegister.connect(_verifier1)
                .createVerifier("fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber")
            await _securityRegister.connect(_company1).addVerifierToCompany(_verifier1)
            await _securityRegister.connect(_company1).createRegister("fakeSiteName", "fakeSecuritySector")
            await _securityRegister.connect(_company1).createVerificationTask(0, "fakeSecurityType")
            await _securityRegister.connect(_verifier1).validateVerificationTask(0)

            expect(await _securityRegister.getVerificationTaskStatus(0)).to.be.equal(BigInt("1"))
        })

    })


    context("Manage a verification task status by a company", async () => {
        let _securityRegister: SecurityRegister
        let _company1: HardhatEthersSigner
        let _verifier1: HardhatEthersSigner

        beforeEach(async () => {

            const {
                securityRegister,
                acc1,
                acc2,
            } = await deployDefaultContract()

            _securityRegister = securityRegister
            _company1 = acc1
            _verifier1 = acc2
        })

        // test updateVerificationTask
        it("prevent from approving a verification task as non company account", async () => {
            await expect(_securityRegister.connect(_verifier1).updateVerificationTask(0, "approve"))
                .to.be.revertedWith("You're not a company!")
        })

        it("prevent from rejecting a verification task as non company account", async () => {
            await expect(_securityRegister.connect(_verifier1).updateVerificationTask(0, "reject"))
                .to.be.revertedWith("You're not a company!")
        })

        it("prevent from approving with reservation a verification task as non company account",
            async () => {
            await expect(_securityRegister.connect(_verifier1)
                .updateVerificationTask(0, "approveWithReservation"))
                .to.be.revertedWith("You're not a company!")
        })

        it("prevent from approving a verification task with no task created", async () => {
            await _securityRegister.connect(_company1).createCompany("fakeName", "fakeAddress", "fakeSiret")
            await expect(_securityRegister.connect(_company1).updateVerificationTask(0, "approve"))
                .to.be.revertedWith("There is no verification task created!")
        })

        it("prevent from rejecting a verification task with no task created", async () => {
            await _securityRegister.connect(_company1).createCompany("fakeName", "fakeAddress", "fakeSiret")
            await expect(_securityRegister.connect(_company1).updateVerificationTask(0, "reject"))
                .to.be.revertedWith("There is no verification task created!")
        })

        it("prevent from approving with reservation a verification task with no task created", async () => {
            await _securityRegister.connect(_company1).createCompany("fakeName", "fakeAddress", "fakeSiret")
            await expect(_securityRegister.connect(_company1).updateVerificationTask(0, "approveWithReservation"))
                .to.be.revertedWith("There is no verification task created!")
        })

        it("prevent from approving a verification task with status not validated by verifier", async () => {
            await _securityRegister.connect(_company1).createCompany("fakeName", "fakeAddress", "fakeSiret")
            await _securityRegister.connect(_verifier1)
                .createVerifier("fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber")
            await _securityRegister.connect(_company1).addVerifierToCompany(_verifier1)
            await _securityRegister.connect(_company1).createRegister("fakeSiteName", "fakeSecuritySector")
            await _securityRegister.connect(_company1).createVerificationTask(0, "fakeSecurityType")

            await expect(_securityRegister.connect(_company1).updateVerificationTask(0, "approve"))
                .to.be.revertedWith("Unable to approve the verification task, because it has not been validated yet!")
        })

        it("prevent from rejecting a verification task with status not validated by verifier", async () => {
            await _securityRegister.connect(_company1).createCompany("fakeName", "fakeAddress", "fakeSiret")
            await _securityRegister.connect(_verifier1)
                .createVerifier("fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber")
            await _securityRegister.connect(_company1).addVerifierToCompany(_verifier1)
            await _securityRegister.connect(_company1).createRegister("fakeSiteName", "fakeSecuritySector")
            await _securityRegister.connect(_company1).createVerificationTask(0, "fakeSecurityType")

            await expect(_securityRegister.connect(_company1).updateVerificationTask(0, "reject"))
                .to.be.revertedWith("Unable to approve the verification task, because it has not been validated yet!")
        })

        it("prevent from approving with reservation a verification task with status not validated by verifier", async () => {
            await _securityRegister.connect(_company1).createCompany("fakeName", "fakeAddress", "fakeSiret")
            await _securityRegister.connect(_verifier1)
                .createVerifier("fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber")
            await _securityRegister.connect(_company1).addVerifierToCompany(_verifier1)
            await _securityRegister.connect(_company1).createRegister("fakeSiteName", "fakeSecuritySector")
            await _securityRegister.connect(_company1).createVerificationTask(0, "fakeSecurityType")

            await expect(_securityRegister.connect(_company1).updateVerificationTask(0, "approveWithReservation"))
                .to.be.revertedWith("Unable to approve the verification task, because it has not been validated yet!")
        })

        it("prevent from providing an invalid parameter", async () => {
            await _securityRegister.connect(_company1).createCompany("fakeName", "fakeAddress", "fakeSiret")
            await _securityRegister.connect(_verifier1)
                .createVerifier("fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber")
            await _securityRegister.connect(_company1).addVerifierToCompany(_verifier1)
            await _securityRegister.connect(_company1).createRegister("fakeSiteName", "fakeSecuritySector")
            await _securityRegister.connect(_company1).createVerificationTask(0, "fakeSecurityType")
            await _securityRegister.connect(_verifier1).validateVerificationTask(0)

            await expect(_securityRegister.connect(_company1).updateVerificationTask(0, "badParam"))
                .to.revertedWith("Invalid action has been provided!")
        })

        // OK
        it("should approve a verification task and emit {VerificationTaskUpdated} event", async () => {
            await _securityRegister.connect(_company1).createCompany("fakeName", "fakeAddress", "fakeSiret")
            await _securityRegister.connect(_verifier1)
                .createVerifier("fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber")
            await _securityRegister.connect(_company1).addVerifierToCompany(_verifier1)
            await _securityRegister.connect(_company1).createRegister("fakeSiteName", "fakeSecuritySector")
            await _securityRegister.connect(_company1).createVerificationTask(0, "fakeSecurityType")
            await _securityRegister.connect(_verifier1).validateVerificationTask(0)

            await expect(_securityRegister.connect(_company1).updateVerificationTask(0, "approve"))
                .to.be.emit(_securityRegister, "VerificationTaskUpdated")
                .withArgs(_company1.address, 0, 2)
        })

        it("should approve a verification task and get the status = 2", async () => {
            await _securityRegister.connect(_company1).createCompany("fakeName", "fakeAddress", "fakeSiret")
            await _securityRegister.connect(_verifier1)
                .createVerifier("fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber")
            await _securityRegister.connect(_company1).addVerifierToCompany(_verifier1)
            await _securityRegister.connect(_company1).createRegister("fakeSiteName", "fakeSecuritySector")
            await _securityRegister.connect(_company1).createVerificationTask(0, "fakeSecurityType")
            await _securityRegister.connect(_verifier1).validateVerificationTask(0)
            await _securityRegister.connect(_company1).updateVerificationTask(0, "approve")

            expect(await _securityRegister.getVerificationTaskStatus(0)).to.be.equal(BigInt("2"))
        })

        it("should reject a verification task and emit {VerificationTaskUpdated} event", async () => {
            await _securityRegister.connect(_company1).createCompany("fakeName", "fakeAddress", "fakeSiret")
            await _securityRegister.connect(_verifier1)
                .createVerifier("fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber")
            await _securityRegister.connect(_company1).addVerifierToCompany(_verifier1)
            await _securityRegister.connect(_company1).createRegister("fakeSiteName", "fakeSecuritySector")
            await _securityRegister.connect(_company1).createVerificationTask(0, "fakeSecurityType")
            await _securityRegister.connect(_verifier1).validateVerificationTask(0)

            await expect(_securityRegister.connect(_company1).updateVerificationTask(0, "reject"))
                .to.be.emit(_securityRegister, "VerificationTaskUpdated")
                .withArgs(_company1.address, 0, 3)
        })

        it("should reject a verification task and get the status = 2", async () => {
            await _securityRegister.connect(_company1).createCompany("fakeName", "fakeAddress", "fakeSiret")
            await _securityRegister.connect(_verifier1)
                .createVerifier("fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber")
            await _securityRegister.connect(_company1).addVerifierToCompany(_verifier1)
            await _securityRegister.connect(_company1).createRegister("fakeSiteName", "fakeSecuritySector")
            await _securityRegister.connect(_company1).createVerificationTask(0, "fakeSecurityType")
            await _securityRegister.connect(_verifier1).validateVerificationTask(0)
            await _securityRegister.connect(_company1).updateVerificationTask(0, "reject")

            expect(await _securityRegister.getVerificationTaskStatus(0)).to.be.equal(BigInt("3"))
        })

        it("should approve with reservation a verification task and emit {VerificationTaskUpdated} event", async () => {
            await _securityRegister.connect(_company1).createCompany("fakeName", "fakeAddress", "fakeSiret")
            await _securityRegister.connect(_verifier1)
                .createVerifier("fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber")
            await _securityRegister.connect(_company1).addVerifierToCompany(_verifier1)
            await _securityRegister.connect(_company1).createRegister("fakeSiteName", "fakeSecuritySector")
            await _securityRegister.connect(_company1).createVerificationTask(0, "fakeSecurityType")
            await _securityRegister.connect(_verifier1).validateVerificationTask(0)

            await expect(_securityRegister.connect(_company1).updateVerificationTask(0, "approveWithReservation"))
                .to.be.emit(_securityRegister, "VerificationTaskUpdated")
                .withArgs(_company1.address, 0, 4)
        })

        it("should approve with reservation a verification task and get the status = 3", async () => {
            await _securityRegister.connect(_company1).createCompany("fakeName", "fakeAddress", "fakeSiret")
            await _securityRegister.connect(_verifier1)
                .createVerifier("fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber")
            await _securityRegister.connect(_company1).addVerifierToCompany(_verifier1)
            await _securityRegister.connect(_company1).createRegister("fakeSiteName", "fakeSecuritySector")
            await _securityRegister.connect(_company1).createVerificationTask(0, "fakeSecurityType")
            await _securityRegister.connect(_verifier1).validateVerificationTask(0)
            await _securityRegister.connect(_company1).updateVerificationTask(0, "approveWithReservation")

            expect(await _securityRegister.getVerificationTaskStatus(0)).to.be.equal(BigInt("4"))
        })

    })

    context("Mint token", async () => {
        let _securityRegister: SecurityRegister
        let _company1: HardhatEthersSigner
        let _verifier1: HardhatEthersSigner
        let _company2: HardhatEthersSigner
        let _verifier2: HardhatEthersSigner
        let _company3: HardhatEthersSigner
        const _tokenURI: string = "https://ipfs.io/ipfs/Qmeb4pBA14imEP13FJ1EnwgfHXVg9t4gA3Ue3eFe7UAftN/"

        beforeEach(async () => {

            const {
                securityRegister,
                acc1,
                acc2,
                acc3,
                acc4,
                acc5,

            } = await deployDefaultContract()

            _securityRegister = securityRegister
            _company1 = acc1
            _verifier1 = acc2
            _company2 = acc3
            _verifier2 = acc4
            _company3 = acc5
        })

        // test safeMint
        it("prevent from minting a token if sender is not a company account", async () => {
            await expect(_securityRegister.connect(_verifier1).safeMint(0, _tokenURI))
                .revertedWith("You're not a company!")
        })

        it("prevent from minting a token while status is not approved or rejected", async () => {
            await _securityRegister.connect(_company1).createCompany("fakeName", "fakeAddress", "fakeSiret")
            await _securityRegister.connect(_verifier1)
                .createVerifier("fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber")
            await _securityRegister.connect(_company1).addVerifierToCompany(_verifier1)
            await _securityRegister.connect(_company1).createRegister("fakeSiteName", "fakeSecuritySector")
            await _securityRegister.connect(_company1).createVerificationTask(0, "fakeSecurityType")
            await _securityRegister.connect(_verifier1).validateVerificationTask(0)

            await expect(_securityRegister.connect(_company1).safeMint(0, _tokenURI))
                .to.be.revertedWith("Unable to mint a token until status is approved or rejected!")
        })

        it("should mint a token and emit {Transfer} event", async () => {
            await _securityRegister.connect(_company1).createCompany("fakeName", "fakeAddress", "fakeSiret")
            await _securityRegister.connect(_verifier1)
                .createVerifier("fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber")
            await _securityRegister.connect(_company1).addVerifierToCompany(_verifier1)
            await _securityRegister.connect(_company1).createRegister("fakeSiteName", "fakeSecuritySector")
            await _securityRegister.connect(_company1).createVerificationTask(0, "fakeSecurityType")
            await _securityRegister.connect(_verifier1).validateVerificationTask(0)
            await _securityRegister.connect(_company1).updateVerificationTask(0, "approve")

            await expect(_securityRegister.connect(_company1).safeMint(0, _tokenURI))
                .to.be.emit(_securityRegister, "Transfer")
                .withArgs(("0x0000000000000000000000000000000000000000"), _company1.address, 0)
        })

        it("should mint a token and emit {MetadataUpdate} event", async () => {
            await _securityRegister.connect(_company1).createCompany("fakeName", "fakeAddress", "fakeSiret")
            await _securityRegister.connect(_verifier1)
                .createVerifier("fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber")
            await _securityRegister.connect(_company1).addVerifierToCompany(_verifier1)
            await _securityRegister.connect(_company1).createRegister("fakeSiteName", "fakeSecuritySector")
            await _securityRegister.connect(_company1).createVerificationTask(0, "fakeSecurityType")
            await _securityRegister.connect(_verifier1).validateVerificationTask(0)
            await _securityRegister.connect(_company1).updateVerificationTask(0, "approve")

            await expect(_securityRegister.connect(_company1).safeMint(0, _tokenURI))
                .to.be.emit(_securityRegister, "MetadataUpdate")
                .withArgs(0)
        })

        // tokenUri
        it("prevent from getting a tokenURI with invalid tokenId", async () => {
            await expect(_securityRegister.tokenURI("0")).to.be.revertedWith("ERC721: invalid token ID")
        })

        it("should get a tokenURI for 1 task with tokenId = 0", async () => {
            await _securityRegister.connect(_company1).createCompany("fakeName", "fakeAddress", "fakeSiret")
            await _securityRegister.connect(_verifier1)
                .createVerifier("fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber")
            await _securityRegister.connect(_company1).addVerifierToCompany(_verifier1)
            await _securityRegister.connect(_company1).createRegister("fakeSiteName", "fakeSecuritySector")
            await _securityRegister.connect(_company1).createVerificationTask(0, "fakeSecurityType")
            await _securityRegister.connect(_verifier1).validateVerificationTask(0)
            await _securityRegister.connect(_company1).updateVerificationTask(0, "approve")
            await _securityRegister.connect(_company1).safeMint(0, `${_tokenURI}0`)

            expect(await _securityRegister.tokenURI("0")).to.be.equal(`${_tokenURI}0`)
        })

        it("should get some tokenURIs with 3 mints for 3 companies", async () => {
            await _securityRegister.connect(_company1).createCompany("fakeName1", "fakeAddress1", "fakeSiret1")
            await _securityRegister.connect(_company2).createCompany("fakeName2", "fakeAddress2", "fakeSiret2")
            await _securityRegister.connect(_company3).createCompany("fakeName3", "fakeAddress3", "fakeSiret3")

            await _securityRegister.connect(_verifier1).createVerifier(
                "fakeName1", "fakeAddress1", "fakeSiret1", "fakeApprovalNumber1")
            await _securityRegister.connect(_verifier2).createVerifier(
                "fakeName2", "fakeAddress2", "fakeSiret2", "fakeApprovalNumber2")

            await _securityRegister.connect(_company1).addVerifierToCompany(_verifier1)
            await _securityRegister.connect(_company2).addVerifierToCompany(_verifier1)
            await _securityRegister.connect(_company3).addVerifierToCompany(_verifier2)

            await _securityRegister.connect(_company1).createRegister("fakeSiteName1", "fakeSecuritySector1")
            await _securityRegister.connect(_company2).createRegister("fakeSiteName2", "fakeSecuritySector2")
            await _securityRegister.connect(_company3).createRegister("fakeSiteName3", "fakeSecuritySector3")

            // registerId = 0
            await _securityRegister.connect(_company1).createVerificationTask(0, "fakeSecurityType1")
            await _securityRegister.connect(_company2).createVerificationTask(0, "fakeSecurityType2")
            await _securityRegister.connect(_company3).createVerificationTask(0, "fakeSecurityType3")

            await _securityRegister.connect(_verifier1).validateVerificationTask(0)
            await _securityRegister.connect(_verifier1).validateVerificationTask(1)
            await _securityRegister.connect(_verifier2).validateVerificationTask(2)

            await _securityRegister.connect(_company1).updateVerificationTask(0, "approve")
            await _securityRegister.connect(_company2).updateVerificationTask(1, "approve")
            await _securityRegister.connect(_company3).updateVerificationTask(2, "reject")

            await _securityRegister.connect(_company1).safeMint(0, `${_tokenURI}0`)
            await _securityRegister.connect(_company2).safeMint(1, `${_tokenURI}1`)
            await _securityRegister.connect(_company3).safeMint(2, `${_tokenURI}2`)

            expect(await _securityRegister.tokenURI("0")).to.be.equal(`${_tokenURI}0`)
            expect(await _securityRegister.tokenURI("1")).to.be.equal(`${_tokenURI}1`)
            expect(await _securityRegister.tokenURI("2")).to.be.equal(`${_tokenURI}2`)
        })
    })
})