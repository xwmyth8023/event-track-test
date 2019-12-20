'use strict';
const config = require('config')
const chai = require('chai')
const Nightmare = require('nightmare')
const harPlugin = require('nightmare-har-plugin')
const searchHAR = require('../../helper/searchHAR')

let expect = chai.expect
let articleUrl = config.get('articleUrl')
let nightmare

harPlugin.install(Nightmare)

describe('Page View',function(){
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
      .goto(articleUrl)
      .wait(5000)
      .getHAR()
      .end()
      .then((result)=>{
        let urlFound = searchHAR.findUrl(result.entries,"https://api.segment.io/v1/p")
        expect(urlFound, 'Analytics event did not fire').to.be.true

        let pathFound = searchHAR.findProperty(result.entries,'path','/a/when-will-my-belly-begin-to-show')
        expect(pathFound, 'path is not correct').to.be.true
        
        let titleFound = searchHAR.findProperty(result.entries, 'title', 'Q&A: When will my belly begin to show?')
        expect(titleFound,'title is not correct').to.be.true

        done()

      })
      .catch(done)
  }) 
})