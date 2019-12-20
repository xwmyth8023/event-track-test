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
      .scrollTo(10000,0)
      .wait(5000)
      .scrollTo(20000,0)
      .wait(5000)
      .evaluate(function(){
        scrollSmoothTo = function (position) {
          if (!window.requestAnimationFrame) {
              window.requestAnimationFrame = function(callback, element) {
                  return setTimeout(callback, 17);
              };
          }
          // 当前滚动高度
          var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
          // 滚动step方法
          var step = function () {
              // 距离目标滚动距离
              var distance = position - scrollTop;
              // 目标滚动位置
              scrollTop = scrollTop + distance / 50;
              console.log(distance)
              if (Math.abs(distance) < 1) {
                  window.scrollTo(0, position);
              } else {
                  window.scrollTo(0, scrollTop);
                  requestAnimationFrame(step);
              }
          };
          step();
        }(0)
      })
      .wait(5000)
      .getHAR()
      .end()
      .then((result)=>{
        let eventsNum = searchHAR.eventNum(result.entries)
        expect(eventsNum,'events number is not correct').to.equal(15)

        let sourceFound = searchHAR.findProperty(result.entries, 'source', 'when-will-my-belly-begin-to-show')
        expect(sourceFound, 'source is not correct').to.be.true

        done()
      })
      .catch(done)
  }) 
})