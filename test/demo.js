const searchHAR = require('../helper/searchHAR')
let Nightmare = require('nightmare')
let harPlugin = require('nightmare-har-plugin')


harPlugin.install(Nightmare)

let options = {
  show:true,
  waitTimeout: 35000,
  gotoTimeout: 35000,
  loadTimeout: 35000,
  executionTimeout: 35000,
  width: 1600,
  height: 1200
}

const logIn = '#main-container > div:nth-child(1) > div > div > div:nth-child(3) > a:nth-child(5)'

let nightmare = Nightmare(Object.assign(harPlugin.getDevtoolsOptions(), options))


nightmare
  .waitForDevtools()
  .goto('https://www.thebump.com/')
  .wait(3000)
  .wait(logIn)
  .resetHAR()
  .click(logIn)
  .wait(5000)
  .getHAR()
  .end()
  .then((result)=>{
    // console.log(result.entries)
    let entries = result.entries
    for(i=0;i<entries.length;i++){
      // console.log(entries[i].request)
      let postData = entries[i].request.postData
      if(postData){
        console.log(postData.text)
      }
    }
  })
  .catch((error) => console.error(error))