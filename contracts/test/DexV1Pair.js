const { expect } = require("chai");
const hre = require("hardhat");
const { ethers, artifacts } = require("hardhat");
const { utils } = require("ethers");



describe("DexV1Pair", function () {
    let factory
    let token0 
    let token1 
    let pair 

    const overrides = {
      gasLimit: 9999999
    }

    beforeEach(async () => {
        const _token = await hre.ethers.getContractFactory("DexV1Pair");
        factory = await _token.deploy();
        const _pair = await hre.ethers.getContractFactory("DexV1factory");
        pair = await _pair.deploy('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');

    })

    it('mint', async () => {
      const token0Amount = utils.parseEther("1")
      const token1Amount = utils.parseEther("4")

      const [wallet, other] = await ethers.getSigners();


      const _token0 = await hre.ethers.getContractFactory("Token0");
      token0 = await _token0.deploy();


      const _token1 = await hre.ethers.getContractFactory("Token1");
      token1 = await _token1.deploy();

      await token0.mint('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', utils.parseEther("1"))
      await token1.mint('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', utils.parseEther("4"))


      await expect(pair.createPair(token0.address, token1.address))
      .to.emit(pair, 'PairCreated')
      

      const token0Balance = await token0.balanceOf(token0.address);
      const token1Balance = await token1.balanceOf(token1.address);

      await token0.transfer(pair.address, token0Amount)
      await token1.transfer(pair.address, token1Amount)



      await factory.initialize(token0.address, token1.address)




      // await expect(pair.mint(wallet.address, overrides))
      // .to.emit(pair, 'Transfer')
      // .withArgs(AddressZero, AddressZero, MINIMUM_LIQUIDITY)
      // .to.emit(pair, 'Transfer')
      // .withArgs(AddressZero, wallet.address, expectedLiquidity.sub(MINIMUM_LIQUIDITY))
      // .to.emit(pair, 'Sync')
      // .withArgs(token0Amount, token1Amount)
      // .to.emit(pair, 'Mint')
      // .withArgs(wallet.address, token0Amount, token1Amount)

    })    



});