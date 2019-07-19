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