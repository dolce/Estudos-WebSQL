var latitude = "36.1038111",
	longitude = "-112.1253926";

websql.open();
websql.createTables();


function getLastRouteID(){
	websql.getLastRouteID(function(result){
		document.querySelector("#lastInsertedRouteID").innerHTML = result;
	});
}; getLastRouteID();


document.querySelector("#insertRoute").addEventListener("click", function(){

	websql.insertRoute(function(lastInsertedID){
		
		getLastRouteID();

	});

});


document.querySelector("#insertCoordinates").addEventListener("click", function(){

	websql.getLastRouteID(function(result){

		document.querySelector("#lastInsertedRouteID").innerHTML = result;
		websql.insertCoordinate(result, latitude, longitude, "file.png");

	});

});


document.querySelector("#insertRouteCoordinates").addEventListener("click", function(){

	websql.insertRoute(function(lastInsertedID){
		
		websql.insertCoordinate(lastInsertedID, latitude, longitude, "file.png", function(){
			getLastRouteID();
		});

	});

});


document.querySelector("#dropRoute").addEventListener("click", function(){

	websql.dropTable("routes");
	document.querySelector("#lastInsertedRouteID").innerHTML = ':(';

});


document.querySelector("#dropCoordinates").addEventListener("click", function(){

	websql.dropTable("coordinates");
	document.querySelector("#lastInsertedRouteID").innerHTML = ':(';

});


document.querySelector("#createTables").addEventListener("click", function(){

	websql.createTables();

});


document.querySelector("#getLastRoutesID").addEventListener("click", function(){

	websql.getLastRouteID(function(result){
		alert("Last inserted Route ID is: " + result);
	});

});


document.querySelector("#getCoordinates").addEventListener("click", function(){

	websql.getLastRouteID(function(result){

		var routeID = prompt("Please enter Route ID", result);

		websql.getCoordinates(parseInt(routeID), function(result){
			var results = result.rows;

			document.querySelector("#result").innerHTML = "<p><b>id • data • latitude • longitude</b></p>";
			Array.prototype.forEach.call(results, function(el, i){

				console.log(el);
				document.querySelector("#result").innerHTML += "<p>" + el.id + " • " + el.data + " • " + el.lat + " • " + el.long +"</p>";


			});
		});
	});

});