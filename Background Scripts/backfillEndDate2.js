//used to backfill the enddate

//step 1: query metric instance table
var metGR = new GlideRecord("metric_instance");
metGR.addQuery("table", "STARTSWITH", "alm");
metGR.addQuery(
	"field",
	"IN",
	"assigned_to,substatus,install_status,retired,location"
);
metGR.orderByAsc("sys_created_on");
metGR.query();

//iterate through each instance of metric
while (metGR.next()) {
	gs.log(
		"1. Asset metric for: " +
			metGR.id.display_name +
			" field: " +
			metGR.field +
			" Start: " +
			metGR.start +
			" End: " +
			metGR.end
	);
	// if there is NO end time recorded for that metric
	if (metGR.end == "") {
		//initialize an empty array
		var metricArr = [];

		gs.log(
			"2. Metric: " +
				metGR.field +
				" end time: " +
				metGR.end +
				" <<-- value not found, checking for updates."
		);

		//Query the metric instance table again, this time for all matching updates to metGR. (current glide record)
		var metUpdGR = new GlideRecord("metric_instance");
		metUpdGR.addQuery("table", "STARTSWITH", "alm");
		metUpdGR.addQuery("id", metGR.id);
		metUpdGR.addQuery("field", metGR.field);
		metUpdGR.addQuery("start", ">", metGR.start);
		metUpdGR.orderByAsc("sys_created_on");
		metUpdGR.query();

		//Iterate through this glide record query and push each record into an array
		while (metUpdGR.next()) {
			metricArr.push(metUpdGR);
		}

		//If the array is empty, move on to the next metGR.
		if (metricArr.length < 1) {
			gs.log("3. no updated records found.");
			gs.log(".... Next");
		} else {
			//calculate difference in time
			var gdt1 = new GlideDateTime(metGR.start);
			var gdt2 = new GlideDateTime(metricArr[0].start);
			var duration2 = GlideDateTime.subtract(gdt1, gdt2);
            gs.log("DT1: " + gdt1 + " DT2: " + gdt2 + " DURATION: " + duration2);

			//update the current metGR's "end" field with the next metric for that GR's "start" field
			metGR.end = metricArr[0].start;
			//update the current metGR's "calculation complete" field
			metGR.calculation_complete = "true";
			//update the current metGR's "duration" field
			metGR.duration = duration2;
			//save update
			metGR.update();

			gs.log(
				"3. Updated Metric: " +
					metricArr[0].field +
					" for: " +
					metricArr[0].id.display_name +
					" Start: " +
					metricArr[0].start +
					" End: " +
					metricArr[0].end
			);
			gs.log(".... Next");
		}
	} else {
		//if there was already an end date, exit to the next metGR. (Next Glide Record in the metric instance GR)
		gs.log(
			"2. Metric: " +
				metGR.field +
				" end time: " +
				metGR.end +
				" <<-- value found, skipping."
		);
	}
}
