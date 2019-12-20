'use strict';
const config = require('config')
const chai = require('chai')
const Nightmare = require('nightmare')
const harPlugin = require('nightmare-har-plugin')
const searchHAR = require('../../helper/searchHAR')
const bumplayoutFooter = require('../../helper/elements').bumpLayoutFooter

let expect = chai.expect
let homepageUrl = config.get('homePageUrl')
let registry = bumplayoutFooter.registry
let nightmare

harPlugin.install(Nightmare)

describe('Click Registry And Baby Gear Section On Footer',function(){
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

  Object.keys(registry).forEach(key => {

    it(`should fire event track when click ${registry[key]['selection']}`,function(done){
      nightmare
        .waitForDevtools()
        .goto(homepageUrl)
        .wait(3000)
        .wait(registry[key]['locator'])
        .resetHAR()
        .click(registry[key]['locator'])
        .wait(5000)
        .getHAR()
        .end()
        .then((result)=>{
          let eventFound = searchHAR.findEvent(result.entries, 'Menu Interaction');
          expect(eventFound, 'Analytics event did not fire').to.be.true;
          
          let placementFound = searchHAR.findProperty(result.entries,'placement','footer')
          expect(placementFound, 'placement property is not correct').to.be.true
  
          let platformFound = searchHAR.findProperty(result.entries, 'platform', 'desktop web')
          expect(platformFound, 'platform property is not correct').to.be.true
  
          let productFound = searchHAR.findProperty(result.entries, 'product', 'bump')
          expect(productFound, 'product property is not correct').to.be.true
  
          let selectionFound = searchHAR.findProperty(result.entries, 'selection', `registry > ${registry[key]['selection']}`)
          expect(selectionFound, 'selection property is not correct').to.be.true
  
          done()
  
        })
        .catch(done)
    }) 
  })
  
})
