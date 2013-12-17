
var ajax = {
    parseJSONP:function(result){

    }
}


$.ajax(
    {
        type       : "GET",
        url        : "http://build.appliciti.com:8000/nmrx/config/work/json-all-schedules/",
        dataType   : 'jsonp',
        success    : function(response) {
            ajax.parseJSONP(response);
        },
        error      : function() {
            alert('Not working!');
        }

    }

);
