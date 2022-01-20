// find alm_asset records

var x1 = new GlideRecord("alm_asset");

var x2 = new GlideRecord("alm_hardware");

var x3 = new GlideRecord("alm_consumable");

x1.query();

x2.query();

x3.query();

gs.log("Starting query for audit table.");

// loop through asset records

function insertMatchedAsset(x) {
	while (x.next()) {
		var y = new GlideRecord("sys_audit");

		//this is the audit table

		y.addQuery("documentkey", x.sys_id);

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
			var mi = new GlideRecord("metric_instance");
			//this is the metric table

			// PattersonDev metric_definition sys_ids.

			var assigned_to = "1e5d550d1b05c110bd12dd36bc4bcb35";

			var retired_date = "21df990d1b05c110bd12dd36bc4bcb98";

			var location = "45af990d1b05c110bd12dd36bc4bcb0c";

			var state = "49bf158d1bc1c110bd12dd36bc4bcb3e";

			var substate = "bccf554d1b05c110bd12dd36bc4bcbcf";

			// Nates PDI metric_definition sys_ids

			// var assigned_to = '4dfc09cd2fc1011014682f2ef699b671';

			// var location = 'be9b9d492f05011014682f2ef699b6ee';

			if (y.fieldname == "assigned_to") {
				mi.initialize();

				//set the metric to the asset sys_id

				mi.id = x.sys_id;

				//this is the metric definition for "Asset Assigned to"

				mi.definition = assigned_to;

				//set the table to asset

				mi.table = "alm_asset";

				//set the start of the metric to when the asset was created

				mi.start = x.sys_created_on;

				//metric created, insert it and move on to the next.

				mi.insert();

				gs.log("Inserted " + mi.id + "successfully into: assigned to");

				// update created date to audit record created date

				mi.sys_created_on = y.sys_created_on;

				mi.update();
			}

			if (y.fieldname == "substatus") {
				mi.initialize();

				mi.id = x.sys_id;

				mi.definition = substate;

				mi.table = "alm_asset";

				mi.start = x.sys_created_on;

				mi.insert();

				gs.log("Inserted " + mi.id + "successfully into: substate");

				mi.sys_created_on = y.sys_created_on;

				mi.update();
			}

			if (y.fieldname == "install_status") {
				mi.initialize();

				mi.id = x.sys_id;

				mi.definition = state;

				mi.table = "alm_asset";

				mi.start = x.sys_created_on;

				mi.insert();

				gs.log("Inserted " + mi.id + "successfully into: state");

				mi.sys_created_on = y.sys_created_on;

				mi.update();
			}

			if (y.fieldname == "retired") {
				mi.initialize();

				mi.id = x.sys_id;

				mi.definition = retired_date;

				mi.table = "alm_asset";

				mi.start = x.sys_created_on;

				mi.insert();

				gs.log("Inserted " + mi.id + "successfully into: retired");

				mi.sys_created_on = y.sys_created_on;

				mi.update();
			}

			if (y.fieldname == "location") {
				mi.initialize();

				mi.id = x.sys_id;

				mi.definition = location;

				mi.table = "alm_asset";

				mi.start = x.sys_created_on;

				mi.insert();

				gs.log("Inserted " + mi.id + "successfully into: location");

				mi.sys_created_on = y.sys_created_on;

				mi.update();
			}
		}
	}
}

insertMatchedAsset(x1);

insertMatchedAsset(x2);

insertMatchedAsset(x3);
