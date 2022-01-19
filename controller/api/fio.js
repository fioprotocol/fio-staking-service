const { readFileSync } = require('fs')
const fs = require('fs');
const fetch = require('node-fetch');
const pathFIO = "controller/api/logs/FIO.log";

class FIOCtrl {
    constructor() {}
    
    async getSUFStaking(req, res) {
      const pub_key = req.body.fio_public_key;
      try {
        let fio_balance = await this.getFIOBalance(pub_key);
        let fio_data = await this.getTableRow();
        const data1 = await this.calcAPY(1);
        const data7 = await this.calcAPY(7);
        const data30 = await this.calcAPY(30);
        const response = {
          ...fio_data,
          activated: true,
          roe: fio_balance.roe,
          historical_apr: {
            "1day": data1,
            "7day": data7,
            "30day": data30
          }
        }
        res.send(response);
      } catch (error) {
        res.send({})
        console.log(error);
      }
    }
    async getFIOStaking(req, res) {
      const pub_key = req.body.fio_public_key;
      try {
        let fio_balance = await this.getFIOBalance(pub_key);
        let fio_data = await this.getTableRow();
        const data1 = await this.calcAPY(1);
        const data7 = await this.calcAPY(7);
        const data30 = await this.calcAPY(30);
        const response = {
          staked_token_pool: Number(fio_data.staked_token_pool/10000000000, 10),
          combined_token_pool: Number(fio_data.combined_token_pool/10000000000, 10),
          last_combined_token_pool: Number(fio_data.last_combined_token_pool/10000000000, 10),
          rewards_token_pool: Number(fio_data.rewards_token_pool/10000000000, 10),
          global_srp_count: Number(fio_data.global_srp_count/10000000000, 10),
          last_global_srp_count: Number(fio_data.last_global_srp_count/10000000000, 10),
          daily_staking_rewards: Number(fio_data.daily_staking_rewards/10000000000, 10),
          staking_rewards_reserves_minted: Number(fio_data.staking_rewards_reserves_minted/10000000000, 10),
          activated: true,
          roe: fio_balance.roe,
          historical_apr: {
            "1day": data1,
            "7day": data7,
            "30day": data30
          }
        }
        res.send(response);
      } catch (error) {
        res.send({})
        console.log(error);
      }
    }
    async calcAPY(day) {
      let roeArray = fs.readFileSync(pathFIO).toString().split('\r\n');
      let len= roeArray.length;
      if(roeArray[len-1] == undefined || roeArray[len-day] == undefined) {
        return null;
      } else {
        let apy = (parseFloat(roeArray[len-2], 10)/parseFloat(roeArray[len-day-1], 10)-1)* (365/day)*100
        return apy;  
      }
    }
    async getFIOBalance(pub_Key) {
      const balance = await (await fetch('https://fiotestnet.blockpane.com/v1/chain/get_fio_balance', { body: `{"fio_public_key": "${pub_Key}"}`, method: 'POST' })).json()
      return balance;
    }
    async saveRoeToFile() {
      const balance = await (await fetch('https://fiotestnet.blockpane.com/v1/chain/get_fio_balance', { body: `{"fio_public_key": "FIO5H6AXUgvmXGwJtQVtBUuN62BU5Dwy5V4SU2W5ezYQETCGAeH6H"}`, method: 'POST' })).json()
      fs.appendFileSync(pathFIO, balance.roe +'\r\n');
    }
    async getTableRow() {
      const param = {
        "json": true,
        "code": "fio.staking",
        "scope": "fio.staking", 
        "table": "staking",
        "limit": 100,
        "reverse": false,
        "show_payer": false
      };
      const response = await (await fetch('https://fiotestnet.blockpane.com/v1/chain/get_table_rows', { body: JSON.stringify(param), method: 'POST' })).json()
      if(response.rows != undefined && response.rows.length > 0) {
        return response.rows[0];
      } else {
        return {};
      }
    }
}

export default new FIOCtrl();