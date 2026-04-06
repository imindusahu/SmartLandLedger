const { expect } = require("chai");

describe("Land Contract", function () {
    let landContract;
    let owner, seller1, buyer1;

    beforeEach(async function () {
        [owner, seller1, buyer1] = await ethers.getSigners();

        const Land = await ethers.getContractFactory("Land");
        landContract = await Land.deploy();
        await landContract.deployed();
    });

    it("Should deploy successfully", async function () {
        expect(landContract.address).to.not.equal(ethers.constants.AddressZero);
    });

    it("Should initialize with 1 Land Inspector", async function () {
        const count = await landContract.inspectorsCount();
        expect(count).to.equal(1);
    });

    it("Should register a seller", async function () {
        await landContract
            .connect(seller1)
            .registerSeller(
                "John Seller",
                30,
                "123456789",
                "PAN123",
                "2 lands",
                "QmYdztkcPJLmGmwLmM4nyBfVatoBMRDuUjmgBupjmTodAP"
            );

        expect(await landContract.isSeller(seller1.address)).to.be.true;
        const count = await landContract.sellersCount();
        expect(count).to.equal(1);
    });

    it("Should register a buyer", async function () {
        await landContract
            .connect(buyer1)
            .registerBuyer(
                "Jane Buyer",
                28,
                "New York",
                "987654321",
                "PAN456",
                "QmYdztkcPJLmGmwLmM4nyBfVatoBMRDuUjmgBupjmTodAP",
                "jane@example.com"
            );

        expect(await landContract.isBuyer(buyer1.address)).to.be.true;
    });

    it("Should verify a seller", async function () {
        await landContract
            .connect(seller1)
            .registerSeller(
                "John Seller",
                30,
                "123456789",
                "PAN123",
                "2 lands",
                "QmYdztkcPJLmGmwLmM4nyBfVatoBMRDuUjmgBupjmTodAP"
            );

        await landContract.verifySeller(seller1.address);
        expect(await landContract.isVerified(seller1.address)).to.be.true;
    });
});
