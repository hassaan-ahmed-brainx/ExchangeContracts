require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-etherscan');


module.exports = {

  'etherscan': {
    'apiKey': '4FVDX3CX7SBV35ABIYBYRMEX3GJ4N9NF2D',
  },
  'mocha': {
    'timeout': 20000,
  },
  'networks': {
    'hardhat': {},
    'ava': {
      'accounts': ['939a4a0bf80bb0a22f8f006a16ca57f127379d9707ab30414dab5f339a48d133'],
      'url': 'https://api.avax-test.network/ext/bc/C/rpc',
    },
    'bscTestnet':{
      'accounts':['939a4a0bf80bb0a22f8f006a16ca57f127379d9707ab30414dab5f339a48d133'],
      'url':'https://endpoints.omniatech.io/v1/bsc/testnet/brainx'
    },
    'ethTestnet':{
      'accounts':['939a4a0bf80bb0a22f8f006a16ca57f127379d9707ab30414dab5f339a48d133'],
      'url': 'https://rpc2.sepolia.org'
    }
  },
  'paths': {
    'sources': './contracts',
    'artifacts': './artifacts',
    'cache': './cache',
    'tests': './contracts/test',
  },
  'solidity': {
    'version': '0.8.18',
    'settings': {
      'optimizer': {
        'enabled': true,
        'runs': 200,
      },
    },
  },
  'watcher': {
    'ci': {
      'tasks': [
        'clean',
        {'command': 'compile',
          'params': {'quiet': true}},
        {
          'command': 'test',
          'params': {'noCompile': true,
            'testFiles': ['testfile.ts']},
        },
      ],
    },
    'compilation': {
      'tasks': ['compile'],
      'files': ['./contracts'],
      'verbose': true,
    },
  },
};