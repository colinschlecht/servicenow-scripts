//Use this script to find an incident object and print it as JSON

//NOTE - use this in xplore or maybe run in background scripts

var gr = new GlideRecord("incident");
gr.get("INC0010238");
var gRU = new GlideRecordUtil();
var fieldList = gRU.getFields(gr);


var payload = {};
for (i = 0; i <= fieldList.length-1; i++)
{
payload[fieldList[i]] = gr.getValue(fieldList[i]);
}
gs.info(JSON.stringify(payload));
