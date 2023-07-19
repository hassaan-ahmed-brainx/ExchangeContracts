
const hre = require('hardhat');
    async function main() {
      const rewardToken = await hre.ethers.getContractFactory('DexV1Router01');
      const _rewardToken = await rewardToken.deploy('0xA75a16523DAD828a3a82FeDC2a5D7A702D922Aa4','0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' );
      console.log(
          'Router01 Token deployed to:',
          _rewardToken.address,
      );


      
    }
main().
  then(() => process.exit(0)).
      catch((error) => {
          console.error(error);
          process.exit(1);
  });
