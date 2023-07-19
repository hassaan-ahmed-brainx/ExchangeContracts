const { expect } = require("chai");
const hre = require("hardhat");
const { utils } = require("ethers");
const { keccak256, solidityPack, getAddress } = utils;


describe("Pair Creation Factory", function () {
  let pair;

  beforeEach(async () => {
    const _pair = await hre.ethers.getContractFactory("DexV1factory");
    pair = await _pair.deploy('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');

  })

    const TEST_ADDRESSES = [
        '0x1000000000000000000000000000000000000000',
        '0x2000000000000000000000000000000000000000'
      ]

  it("Verify Pair Creation and other parameters", async function () {

    expect(await pair.allPairsLength()).to.equal(0)

  });

  it('createPair:gas', async () => {
    const tx = await pair.createPair(...TEST_ADDRESSES)
    const receipt = await tx.wait()
    expect(receipt.gasUsed).to.eq(2025486)
  })


  function getCreate2Address(
    factoryAddress,
    [tokenA, tokenB],
    bytecode
  ) {
    const [token0, token1] = tokenA < tokenB ? [tokenA, tokenB] : [tokenB, tokenA]
    const create2Inputs = [
      '0xff',
      factoryAddress,
      keccak256(solidityPack(['address', 'address'], [token0, token1])),
      keccak256(bytecode)
    ]
    const sanitizedInputs = `0x${create2Inputs.map(i => i.slice(2)).join('')}`
    return getAddress(`0x${keccak256(sanitizedInputs).slice(-40)}`)
  }


  async function createPair(tokens) {
    
    await expect(pair.createPair('0x0000000000000000000000000000000000000000',TEST_ADDRESSES[0])).to.be.reverted
    await expect(pair.createPair(TEST_ADDRESSES[0],TEST_ADDRESSES[0])).to.be.reverted
    await expect(pair.createPair(...tokens))
    .to.emit(pair, 'PairCreated')
    await expect(pair.createPair(TEST_ADDRESSES[0],TEST_ADDRESSES[1])).to.be.reverted
    expect(await pair.allPairsLength()).to.equal(1)
    await expect(pair.createPair(...tokens.slice().reverse())).to.be.reverted
  }


  it('createPair', async () => {
    await createPair(TEST_ADDRESSES)
  })


  it('setFeeTo', async () => {
    const [wallet, other] = await ethers.getSigners();

    await expect(pair.connect(other).setFeeTo(other.address)).to.be.revertedWith('DexV1: FORBIDDEN')
    await pair.setFeeTo(wallet.address)
    expect(await pair.feeTo()).to.eq(wallet.address)
  })

  it('setFeeToSetter', async () => {
    const [wallet, other] = await ethers.getSigners();
    await expect(pair.connect(other).setFeeToSetter(other.address)).to.be.revertedWith('DexV1: FORBIDDEN')
    await pair.setFeeToSetter(other.address)
    expect(await pair.feeToSetter()).to.eq(other.address)
    await expect(pair.setFeeToSetter(wallet.address)).to.be.revertedWith('DexV1: FORBIDDEN')

  })

});



