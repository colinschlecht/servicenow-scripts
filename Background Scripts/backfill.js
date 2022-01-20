// find alm_asset records

var x1 = new GlideRecord("alm_asset");

var x2 = new GlideRecord("alm_hardware");

var x3 = new GlideRecord("alm_consumable");

x1.query();
x2.query();
x3.query();

gs.log("Starting query for audit table.");

// loop through asset records
function printx(x) {
	while (x.next()) {
		var y = new GlideRecord("sys_audit");
		//this is the audit table

		y.addQuery("documentkey", x.sys_id);
		//// need this for pushing into JUST the Asset Assigned TO metric.
		//// perhaps add more queries for the other 4 fields to watch.

        		//find each audit record for this asset where fieldname is [see list below]
		y.addQuery(
			"fieldname",
			"IN",
			"assigned_to,substatus,install_status,retired,location"
		);
                // and tablename starts with alm [sorts out the weird cmdb stuff]
		y.addQuery("tablename", "STARTSWITH", "alm");

		y.query();

		if (y.next()) {
			gs.log(
				"{" +
					"x sys: " +
					x.sys_id +
					", y key: " +
					y.documentkey +
					", y sys: " +
					y.sys_id +
					", fieldname: " +
					y.fieldname +
					", tablename: " +
					y.tablename +
					"}"
			);
		}
	}
}

printx(x1);
printx(x2);
printx(x3);
