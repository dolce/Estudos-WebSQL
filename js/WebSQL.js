var websql = (function(){

	var db = null;

	function handleError(transaction, error) {
		console.error("Database Error: " + error + transaction);
		return false;
	}

	return {
		open: function() {

			db = openDatabase("Web SQL Database", "1.0", "coordinates", 2 * 1024 * 1024); // short name, version, display name, max size
			console.info("Database opened.")

		}
		, createTables: function() {

			db.transaction(function (tx) {

				// table one
				tx.executeSql("CREATE TABLE IF NOT EXISTS routes (id integer primary key autoincrement, data datetime(20))", [], null, handleError);
				// table two
				tx.executeSql("CREATE TABLE IF NOT EXISTS coordinates (id integer primary key autoincrement, routeid int(5), data datetime(20), lat varchar(15), long varchar(15), arquivo varchar(50) )", [], null, handleError);

			}, handleError, function(){
				console.info('Created tables.');
			}); // error handler, Success handler

		}
		, dropTable: function(tablename, callback) {

			db.transaction(function (tx) {

				tx.executeSql('DROP TABLE IF EXISTS ' + tablename);

			}, handleError, function(){

				console.warn('Table "'+tablename+'" removed!');

				if (callback && typeof(callback) === "function") {
				    callback();
				}

			});

		}
		, insertRoute: function(callback) {

			db.transaction(function (tx) {

				tx.executeSql("INSERT INTO routes (data) values (strftime('%Y-%m-%d %H:%M:%S', 'now'))", [], function(tx, sql_res) {

					console.info("Inserted Route: " + sql_res.insertId);

					if (callback && typeof(callback) === "function") {
					    callback(sql_res.insertId);
					}

				});

			}, handleError, null);

		}
		, insertCoordinate: function(routeid, lat, long, file, callback) {

			db.transaction(function (tx) {

				tx.executeSql("INSERT INTO coordinates (routeid, data, lat, long, arquivo) VALUES (?, strftime('%d-%m-%Y %H:%M:%S', 'now'), ?, ?, ?)", [routeid, lat, long, file]);

			}, handleError, function(e){
				console.info("Coordinates inserted to Route: "+routeid);
				
				if (callback && typeof(callback) === "function") {
				    callback();
				}

			});				

		}
		, getCoordinates: function(routeid, callback){

			db.transaction(function (tx) {

				tx.executeSql('SELECT * FROM coordinates WHERE routeid = ?', [routeid], function (tx, result) {

					console.info(result.rows.length + " records.");

					if (callback && typeof(callback) === "function") {
					    callback(result);
					}
				});

			}, handleError, function(){
				console.debug('Success');
			}); //end transaction

		}
		, getLastInsertedID: function(tablename, callback){

			var tablename = tablename.replace(/\s+/g, '');
			db.transaction(function (tx) {

				tx.executeSql('SELECT id FROM '+tablename+' order by id desc limit 1', [], function (tx, result) {
					
					var rs = 1;

					if( result.rows.length > 0 ){
						var rs = result.rows[0].id;
					} else {
						websql.insertRoute();
					}

					if (callback && typeof(callback) === "function") {
					    callback(rs); // Last ID of table
					}						

				});

			}, handleError, function(){
				console.debug('Success');
			}); //end transaction

		}

	};

})();