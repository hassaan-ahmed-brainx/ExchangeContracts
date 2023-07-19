const { expect } = require("chai");
const hre = require("hardhat");
const { ethers } = require("hardhat");
const { utils } = require("ethers");




describe("DexERC20", function () {
  let token;
  beforeEach(async () => {
    const _token = await hre.ethers.getContractFactory("DexV1ERC20");
    token = await _token.deploy();
  })

  it('DexERC20 Deployment', async () => {
    const [wallet] = await ethers.getSigners();
    const name = await token.name();
    expect(name).to.eq('DEX V1');
    expect(await token.symbol()).to.eq('BRX V1');
    expect(await token.decimals()).to.eq(18);
    expect(await token.totalSupply()).to.eq(0);
    expect(await token.balanceOf(wallet.address)).to.eq(0);
    await token.mints(utils.parseEther("1"));
    expect(await token.balanceOf(wallet.address)).to.eq(utils.parseEther("1"));
  });
  

      it('approve', async () => {
        const [wallet, other] = await ethers.getSigners();
        await expect(token.approve(other.address, utils.parseEther("1")))
          .to.emit(token, 'Approval1')
          .withArgs(wallet.address, other.address, utils.parseEther("1"))
        expect(await token.allowance(wallet.address, other.address)).to.eq(utils.parseEther("1"))
      })

      it('transfer', async () => {
        const [wallet, other] = await ethers.getSigners();
        await token.mints(utils.parseEther("1"));
        await expect(token.transfer(other.address, utils.parseEther("1")))
          .to.emit(token, 'Transfer1')
          .withArgs(wallet.address, other.address, utils.parseEther("1"))
        expect(await token.balanceOf(wallet.address)).to.eq(utils.parseEther("1").sub(utils.parseEther("1")))
        expect(await token.balanceOf(other.address)).to.eq(utils.parseEther("1"))
      })
      
      it('transfer:fail', async () => {
        const [wallet, other] = await ethers.getSigners();
        await token.mints(utils.parseEther("1"));
        await expect(token.transfer(other.address, utils.parseEther("1")+1)).to.be.reverted 
        await expect(token.connect(other).transfer(wallet.address, 1)).to.be.reverted
      })

      it('transferFrom', async () => {
        const [wallet, other] = await ethers.getSigners();
        await token.mints(utils.parseEther("2"));
        await token.approve(other.address, utils.parseEther("1"))
        await expect(token.connect(other).transferFrom(wallet.address, other.address, utils.parseEther("1")))
          .to.emit(token, 'Transfer1')
          .withArgs(wallet.address, other.address, utils.parseEther("1"))
        expect(await token.allowance(wallet.address, other.address)).to.eq(0)
        expect(await token.balanceOf(wallet.address)).to.eq(utils.parseEther("2").sub(utils.parseEther("1")))
        expect(await token.balanceOf(other.address)).to.eq(utils.parseEther("1"))
      })
      
      it('transferFrom:max', async () => {
        const [wallet, other] = await ethers.getSigners();
        await token.mints(utils.parseEther("1"));
        await token.approve(other.address, utils.parseEther("1"))
        await expect(token.connect(other).transferFrom(wallet.address, other.address, utils.parseEther("1")))
          .to.emit(token, 'Transfer1')
          .withArgs(wallet.address, other.address, utils.parseEther("1"))
        expect(await token.allowance(wallet.address, other.address)).to.eq("0")
        expect(await token.balanceOf(wallet.address)).to.eq(0)
        expect(await token.balanceOf(other.address)).to.eq(utils.parseEther("1"))
      })

      it('transferFrom:min', async () => {
        const [wallet, other] = await ethers.getSigners();
        await token.mints(utils.parseEther("1"));
        await token.approve(other.address, utils.parseEther("1"))
        await expect(token.connect(other).transferFrom(wallet.address, other.address, utils.parseEther("0")))
          .to.be.revertedWith('Minimum 1')

      })
      


});