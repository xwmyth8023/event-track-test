'use strict';

module.exports = {
    findEvent: function(entries, event) {
        var eventFound = false;
        var postData;
        for(var i=0; i < entries.length; i++) {
            postData = entries[i].request.postData;
            if(!!postData && JSON.stringify(postData.text.replace(/"+/g, '')).includes('event:' + event))  {
                eventFound = true;
                break;
            }
        }
        return eventFound;
    },

    eventNum: function(entries){
        var index = 0;
        var postData;
        for(var i=0; i < entries.length; i++) {
            postData = entries[i].request.postData;
            if(!!postData && JSON.stringify(postData.text.replace(/"+/g, '')).includes('event:Feed Card Impression'))  {
                index += 1
            }
        }
        return index
    },
    
    findUrl: function(entries,expectUrl){
        var urlFound = false;
        var url;
        for (var i=0; i < entries.length; i++){
            url = entries[i].request.url
            if(!!url && url===expectUrl){
               urlFound = true;
               break; 
            }
        }
        return urlFound
    },

    findProperty: function(entries, property, propertyValue) {
        var valueFound = false;
        var postData;
        for(var i=0; i < entries.length; i++) {
            postData = entries[i].request.postData;
            if(!!postData && JSON.stringify(postData.text.replace(/"+/g, '')).includes(property + ':' + propertyValue)) {
                valueFound = true;
                break;
            }
        }
        return valueFound;
    }
};