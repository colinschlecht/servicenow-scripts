// find alm_asset records
var x1 = new GlideRecord("alm_asset");
x1.query();

// state labels (taken from Colin's PDI - may be different in Patterson DEV)
//compatible with Patterson DEV (added 4, 5, and patterson doesn't use 11)
var stateLabels = {
	1: "In use",
	2: "On order",
	3: "In maintenance",
	4: "Litigation hold",
	5: "Build",
	6: "In stock",
	7: "Retired",
	8: "Missing",
	9: "In transit",
	10: "Consumed",
	11: "Build",
};

// loop through asset records; x == asset that was changed
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
			// y == audit record selected from audit table
			//this is the metric table
			var mi = new GlideRecord("metric_instance");

			// Colin PDI metric_definition sys_ids.
			// var assigned_to = "9a0246132f450110f9b249e72799b643";
			// var retired_date = "03624a572f050110f9b249e72799b67d";
			// var location = "60920e932f450110f9b249e72799b60b";
			// var state = "42a206d32f450110f9b249e72799b673";
			// var substate = "b42386d32f450110f9b249e72799b6d5";
			// Patterson
			var assigned_to = "1e5d550d1b05c110bd12dd36bc4bcb35";
			var retired_date = "21df990d1b05c110bd12dd36bc4bcb98";
			var location = "45af990d1b05c110bd12dd36bc4bcb0c";
			var state = "49bf158d1bc1c110bd12dd36bc4bcb3e";
			var substate = "bccf554d1b05c110bd12dd36bc4bcbcf";

			if (y.fieldname == "assigned_to") {
				//check if new assigned user is null
				if (y.newvalue != "") {
					//if not null, look up the user record. Sometimes there is no assinged_to due to status change.
					var newUser = new GlideRecord("sys_user");
					newUser.addQuery("sys_id", y.newvalue);
					newUser.query();
					while (newUser.next()) {
						//initialize new metric instance
						mi.initialize();
						//set the metric ID field to the asset sys_id
						mi.id = x.sys_id;
						//this is the metric definition for "Asset Assigned to"
						mi.definition = assigned_to;
						//set the metric's 'Table' field to asset's table
						mi.table = x.tablename;
						//set the metric's 'Field' field to asset's changed field (from audit)
						mi.field = y.fieldname;
						//set the metrics 'Value' field to asset's changed value (from audit)
						mi.value = newUser.user_name + " " + newUser.last_name;
						//field value - not sure of importance but metrics pick it up
						mi.field_value = newUser.sys_id;
						//set the start of the metric to when the asset's audit record was created (when it was changed)
						mi.start = y.sys_created_on;
						//insert and save metric
						mi.insert();

						gs.log(
							"Inserted " +
								"username: " +
								mi.value +
								" MI: " +
								mi.id +
								" successfully into: assigned_to"
						);
						//update the newly inserted metric's created date to audit record created date
						mi.sys_created_on = y.sys_created_on;
						mi.update();
					}
				} else {
					mi.initialize();
					//set the metric 'ID' field to the asset sys_id
					mi.id = x.sys_id;
					//this is the metric definition for "Asset Assigned to"
					mi.definition = assigned_to;
					//set the metric's 'Table' field to asset's table
					mi.table = x.tablename;
					//set the metric's 'Field' field to asset's changed field (from audit)
					mi.field = y.fieldname;
					//set the metrics 'Value' field to asset's changed value (from audit)
					mi.value = y.newvalue;
					//field value - not sure of importance but metrics pick it up
					//mi.field_value = y.newvalue;
					//set the start of the metric to when the asset's audit record was created (when it was changed)
					mi.start = y.sys_created_on;
					//metric created, insert it and move on to the next.
					mi.insert();

					gs.log(
						"Inserted " +
							"username: " +
							mi.value +
							" MI: " +
							mi.id +
							" successfully into: assigned_to"
					);

					//update created date to audit record created date
					mi.sys_created_on = y.sys_created_on;
					mi.update();
				}
			}

			if (y.fieldname == "substatus") {
				//substate - changed values are labels rather than numbers (like state)
				mi.initialize();
				mi.id = x.sys_id;
				mi.definition = substate;
				mi.table = x.tablename;
				mi.field = y.fieldname;
				mi.value = y.newvalue;
				mi.field_value = y.newvalue;
				mi.start = y.sys_created_on;
				mi.insert();

				gs.log("Inserted " + mi.id + " successfully into: substate");

				mi.sys_created_on = y.sys_created_on;
				mi.update();
			}

			if (y.fieldname == "install_status") {
				//note - install_status == state
				mi.initialize();
				mi.id = x.sys_id;
				mi.definition = state;
				mi.table = x.tablename;
				mi.field = y.fieldname;
				//selects state label rather than numeric value
				mi.value = stateLabels[y.newvalue];
				mi.field_value = y.newvalue;
				mi.start = y.sys_created_on;
				mi.insert();

				gs.log("Inserted " + mi.id + " successfully into: state");

				mi.sys_created_on = y.sys_created_on;
				mi.update();
			}

			if (y.fieldname == "retired") {
				mi.initialize();
				mi.id = x.sys_id;
				mi.definition = retired_date;
				mi.table = x.tablename;
				mi.field = y.fieldname;
				mi.value = y.newvalue;
				mi.field_value = y.newvalue;
				mi.start = y.sys_created_on;
				mi.insert();

				gs.log("Inserted " + mi.id + " successfully into: retired");

				mi.sys_created_on = y.sys_created_on;
				mi.update();
			}

			if (y.fieldname == "location") {
				//same process as 'assigned_to' - need to look up record with 'sys_id' to get location name
				if (y.newvalue != "") {
					var loc = new GlideRecord("cmn_location");
					loc.addQuery("sys_id", y.newvalue);
					loc.query();

					while (loc.next()) {
						mi.initialize();

						mi.id = x.sys_id;
						mi.definition = location;
						mi.table = x.tablename;
						mi.field = y.fieldname;
						mi.value = loc.name;
						mi.field_value = loc.sys_id;
						mi.start = y.sys_created_on;

						mi.insert();

						gs.log("Inserted " + mi.id + " successfully into: location");

						mi.sys_created_on = y.sys_created_on;
						mi.update();
					}
				} else {
					//standard insert with update to blank location name
					mi.initialize();
					mi.id = x.sys_id;
					mi.definition = location;
					mi.table = x.tablename;
					mi.field = y.fieldname;
					mi.value = y.newvalue;
					mi.field_value = y.newvalue;
					mi.start = y.sys_created_on;
					mi.insert();

					gs.log("Inserted " + mi.id + " successfully into: location");

					mi.sys_created_on = y.sys_created_on;
					mi.update();
				}
			}
		}
	}
}

insertMatchedAsset(x1);
