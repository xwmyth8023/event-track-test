'use strict';

const searchHAR = require('../../helper/searchHAR')
const Nightmare = require('nightmare')
const harPlugin = require('nightmare-har-plugin')
const bumplayoutHeader = require('../../helper/elements').bumpLayoutHeader
const homepageUrl = require('../../config/qa').homePageUrl
const chai = require('chai')

let expect = chai.expect
let nightmare

harPlugin.install(Nightmare)

describe('Click The Bump Logo',function(){
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

  it('should fire event track',function(done){

    nightmare
      .waitForDevtools()
      .goto(homepageUrl)
      .wait(3000)
      .wait(bumplayoutHeader.bumpLogo)
      .resetHAR()
      .click(bumplayoutHeader.bumpLogo)
      .wait(5000)
      .getHAR()
      .end()
      .then((result)=>{
        let eventFound = searchHAR.findEvent(result.entries, 'Menu Interaction');
        expect(eventFound, 'Analytics event did not fire').to.be.true;
        
        let placementFound = searchHAR.findProperty(result.entries,'placement','header')
        expect(placementFound, 'placement property is not correct').to.be.true

        let platformFound = searchHAR.findProperty(result.entries, 'platform', 'desktop web')
        expect(platformFound, 'platform property is not correct').to.be.true

        let productFound = searchHAR.findProperty(result.entries, 'product', 'bump')
        expect(productFound, 'product property is not correct').to.be.true

        let selectionFound = searchHAR.findProperty(result.entries, 'selection', 'the bump')
        expect(selectionFound, 'selection property is not correct').to.be.true

        doen()

      })
      .catch(done)
  }) 
})
