'use strict';
const config = require('config')
const chai = require('chai')
const Nightmare = require('nightmare')
const harPlugin = require('nightmare-har-plugin')
const searchHAR = require('../../helper/searchHAR')
const article = require('../../helper/elements').detailArticle

let expect = chai.expect
let articleUrl = config.get('articleUrl')
let nightmare

harPlugin.install(Nightmare)

describe('Click Share On Article Page',function(){
  this.timeout('300s')

  let options = {
    /** switch proxy is used for local running test */
    switches: {
      'proxy-server': '172.26.0.17:3128',
      'ignore-certificate-errors': true
    },
    show:true,
    waitTimeout: 35000,
    gotoTimeout: 35000,
    loadTimeout: 35000,
    executionTimeout: 35000,
    width: 1600,
    height: 1200
  }

  beforeEach(function () {
    nightmare = Nightmare(Object.assign(harPlugin.getDevtoolsOptions(), options));
  });

  Object.keys(article).forEach(key => {
    it(`should fire event track when click ${key}`,function(done){
      nightmare
        .waitForDevtools()
        .goto(articleUrl)
        .wait(3000)
        .wait(article[key]['locator'])
        .resetHAR()
        .click(article[key]['locator'])
        .wait(5000)
        .getHAR()
        .end()
        .then((result)=>{
          /**
           * event: "Social Share"
           * properties: {service: "email", position: 1, sourceFeedTitle: "when-will-my-belly-begin-to-show",…}
           * cardId: "when-will-my-belly-begin-to-show"
           * cardType: "q&a"
           * cardUrl: "https://qa-www.thebump.com/a/when-will-my-belly-begin-to-show"
           * platform: "desktop web"
           * position: 1
           * service: "email"
           * sourceFeedTitle: "when-will-my-belly-begin-to-show"
           * sentAt: "2019-09-10T03:52:19.136Z"
           */
          let eventFound = searchHAR.findEvent(result.entries, 'Social Share');
          expect(eventFound, 'Analytics event did not fire').to.be.true;

          let platformFound = searchHAR.findProperty(result.entries, 'platform', 'desktop web')
          expect(platformFound, 'platform property is not correct').to.be.true
  
          let productFound = searchHAR.findProperty(result.entries, 'product', 'bump')
          expect(productFound, 'product property is not correct').to.be.true
  
          let serviceFound = searchHAR.findProperty(result.entries, 'service', `${article[key]['service']}`)
          expect(serviceFound, 'selection property is not correct').to.be.true
  
          done()
  
        })
        .catch(done)
    }) 
  })
  
})