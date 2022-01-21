//used to backfill the enddate
// current version is backfillEndDate2.js
var metGR = new GlideRecord("metric_instance");
metGR.addQuery("table", "STARTSWITH", "alm");
metGR.addQuery(
	"field",
	"IN",
	"assigned_to,substatus,install_status,retired,location"
);
metGR.query();

gs.log("if metric exists");
while (metGR.next()) {
	gs.log(
		"running for: " +
			metGR.id.display_name +
			" field: " +
			metGR.field +
			" start: " +
			metGR.start
	);
	if (!metGR.end) {
		gs.log(
			"Metric: " +
				metGR.field +
				" end time: " +
				metUpdGR.end +
				" <<-- should be blank"
		);
		var metUpdGR = new GlideRecord("metric_instance");
		metUpdGR.addQuery("table", "STARTSWITH", "alm");
		metUpdGR.addQuery("id", metGR.id);
		metUpdGR.addQuery("field", metGR.field);
		metUpdGR.addQuery("start", ">", metGR.start);
		metUpdGR.setLimit(1);
		metUpdGR.query();
		while (metUpdGR.next()) {
			gs.log(
				"Matching change records in metrics table: " +
					metUpdGR.getRowCount() +
					" New end duration: " +
					metUpdGR.start
			);
			gs.log(
				"Updated Record: " +
                metGR.id.display_name +
					" start: " +
					metGR.start +
					" end: " +
					metUpdGR.start
			);
            gs.log("....");
		}
        if(metUpdGR.getRowCount() != 1){
            gs.log("no updated records found.");
            gs.log("....")
        }
	}
}
