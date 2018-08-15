// Dom7
var $$ = Dom7;
var map;

// Framework7 App main instance
var app  = new Framework7({
  root: '#app', // App root element
  id: 'my.gov.miros.rocom', // App bundle ID
  name: 'ROCOM', // App name
  theme: 'ios', // Automatic theme detection
  // App root data
  data: function () {
    return {
      user: {
        firstName: 'John',
        lastName: 'Doe',
      },
      // Demo products for Catalog section
      products: [
        {
          id: '1',
          title: 'Apple iPhone 8',
          description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi tempora similique reiciendis, error nesciunt vero, blanditiis pariatur dolor, minima sed sapiente rerum, dolorem corrupti hic modi praesentium unde saepe perspiciatis.'
        },
        {
          id: '2',
          title: 'Apple iPhone 8 Plus',
          description: 'Velit odit autem modi saepe ratione totam minus, aperiam, labore quia provident temporibus quasi est ut aliquid blanditiis beatae suscipit odio vel! Nostrum porro sunt sint eveniet maiores, dolorem itaque!'
        },
        {
          id: '3',
          title: 'Apple iPhone X',
          description: 'Expedita sequi perferendis quod illum pariatur aliquam, alias laboriosam! Vero blanditiis placeat, mollitia necessitatibus reprehenderit. Labore dolores amet quos, accusamus earum asperiores officiis assumenda optio architecto quia neque, quae eum.'
        },
      ]
    };
  },
  // App root methods
  methods: {
    helloWorld: function () {
      app.dialog.alert('Hello World!');
    },
  },
  // App routes
  routes: routes,
});

document.addEventListener('deviceready', function(){
	console.log('Device Ready!');
}, false);

// Init/Create views
var homeView = app.views.create('#view-home', {
  url: '/'
});
var rideView = app.views.create('#view-ride', {
  url: '/ride/'
});
var dataListView = app.views.create('#view-datalist', {
  url: '/dataList/'
});
var settingsView = app.views.create('#view-settings', {
  url: '/settings/'
});
var aboutView = app.views.create('#view-about', {
  url: '/about/'
});
var profileView = app.views.create('#view-profile', {
  url: '/profile/'
});

//// Login Screen Demo
//$$('.login-button').on('click', function () {
//  var username = $$('.login-content [name="username"]').val();
//  var password = $$('.login-content [name="password"]').val();
//  
//  // Alert username and password
//  app.dialog.alert('Username: ' + username + '<br>Password: ' + password);
//  
//  // Close login screen
//  app.loginScreen.close('#login-screen');
//  
//  app.router.navigate('/main/');
//});

$( document ).ready(function() {
	$('.toolbar-inner').hide();
	
	var id = window.sessionStorage.getItem("id");
	
	if(id == undefined || id == ''){
		app.dialog.alert('Please login to start using ROCOM!', function(){
			app.router.navigate('/login/');
		});
	}else{
		$('.toolbar-inner').show();
		var username = window.sessionStorage.getItem("username");
		var fullname = window.sessionStorage.getItem("fullname");
		var lastlogin = window.sessionStorage.getItem("lastlogin");
		var ipaddress = window.sessionStorage.getItem("ipaddress");
				
		$('.iID').attr("placeholder", id);
		$('.iUsername').attr("placeholder", username);
		$('.iFullname').attr("placeholder", fullname);
		$('.iLastLogin').attr("placeholder", lastlogin);
		$('.iIPAddress').attr("placeholder", ipaddress);
		
		startApp();
	}
});

function loginNow(){
	var username = $$('.login-content [name="username"]').val();
	var password = $$('.login-content [name="password"]').val();
	
	var datastr = '{"username":"'+username+'","password":"'+password+'"}';
	$.ajax({
		url: "http://mroads.miros.gov.my/rocomv3/api/login",
		type: "POST",
		data: {"datastr":datastr},
		success: function(data){
			var result = JSON.parse(data);
			if(result.status == 1){
				$('.toolbar-inner').show();
				window.sessionStorage.setItem("id", result.id);
				window.sessionStorage.setItem("username", result.username);
				window.sessionStorage.setItem("fullname", result.fullname);
				window.sessionStorage.setItem("lastlogin", result.last_login);
				window.sessionStorage.setItem("ipaddress", result.ip_address);
				
				$('.iID').attr("placeholder", result.id);
				$('.iUsername').attr("placeholder", result.username);
				$('.iFullname').attr("placeholder", result.fullname);
				$('.iLastLogin').attr("placeholder", result.last_login);
				$('.iIPAddress').attr("placeholder", result.ip_address);
				
				startApp();
				
				app.dialog.alert('Welcome ' + window.sessionStorage.getItem("fullname"), function(){
					app.router.navigate('/');
				});			
			}else if(result.status == 2){
				$('.toolbar-inner').hide();
				app.dialog.alert('Account not found!');
			}

		}
	});	
	//app.dialog.alert('Username: ' + username + '<br>Password: ' + password);
}

//function logoutNow(){
//	//$('.login-content [name="username"]').val('');
//	//$('.login-content [name="password"]').val('');
//	//window.sessionStorage.clear();
//	//$('.toolbar-inner').hide();
//	app.dialog.alert('Please re-open ROCOM!', function(){
//		window.navigator.app.exitApp();
//	});
//}

function processEvent(event) {
    $('.sX').html(event.acceleration.x);
    $('.sY').html(event.acceleration.y);
    $('.sZ').html(event.acceleration.z);
}

var currentUpdate, lastUpdate;
var cumDistance = 0;
var markers = [];
var onSuccess = function(position) {
    $('.sLat').html(position.coords.latitude);
    $('.sLong').html(position.coords.longitude);
	
	var myLatlng = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
	var mapOptions = {
	  zoom: 18,
	  center: myLatlng
	}
	
	if(map){	
	}else{
		map = new google.maps.Map(document.getElementById('map'), mapOptions);	
	}

	var marker = new google.maps.Marker({
		position: myLatlng,
		//title:"Hello World!",
		icon: {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 4
        },
		map: map
	});

	for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
    }
	
	map.setCenter(myLatlng);
	markers.push(marker);
	//marker.setMap(map);
	
	if(currentUpdate) lastUpdate = currentUpdate;

    currentUpdate = {
        position: new LatLon(position.coords.latitude, position.coords.longitude),
        time: new Date()
    };

    if(!lastUpdate) return;

    currentUpdate.deltaDistMetres = lastUpdate.position.distanceTo(currentUpdate.position)*1000;
    currentUpdate.deltaTimeSecs = (currentUpdate.time - lastUpdate.time)*1000;
    currentUpdate.speed = (currentUpdate.deltaDistMetres/currentUpdate.deltaTimeSecs);
    currentUpdate.accelerationGPS = (currentUpdate.speed - lastUpdate.speed) / currentUpdate.deltaTimeSecs;

    $('.sRideSpeed').html((currentUpdate.speed * 3600 / 1000).toFixed(1));
	cumDistance = cumDistance + (deltaDistMetres/1000);
    $('.sRideDistance').html(cumDistance.toFixed(1));
};

function onError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}

function viewCamera(){
	var options = {
	  x: 0,
	  y: 0,
	  width: window.screen.width / 2,
	  height: window.screen.height / 2,
	  camera: CameraPreview.CAMERA_DIRECTION.BACK,
	  toBack: true,
	  tapPhoto: false,
	  tapFocus: true,
	  previewDrag: true
	};

	CameraPreview.startCamera(options);

	CameraPreview.show();
	
	CameraPreview.onBackButton(function() {
	  CameraPreview.hide();
	  CameraPreview.stopCamera();
	});
}

var previousLat;
var previousLong;

function startApp(){
	//Insomnia.keepAwake();
	$('.sDate').html(moment().format('DD/MM/YYYY'));
	
	window.setInterval(function(){
		$('.sTime').html(moment().format('h:mm:ss a'));
		
		if ( seconds === 60 )
		{
			seconds = 0;
			minutes = minutes + 1;
		}
		
		mins = ( minutes < 10 ) ? ( '0' + minutes + ':' ) : ( minutes + ':' );
		
		if ( minutes === 60 ) 
		{ 
			minutes = 0;
			hours = hours + 1; 
		} 
		
		//gethours = ( hours < 10 ) ? ( '0' + hours + ':' ) : ( hours + ':' );
		secs = ( seconds < 10 ) ? ( '0' + seconds ) : ( seconds );
		seconds++;
		
		$('.sRideDuration').html(mins + secs);
	}, 1000);
	
	window.addEventListener("devicemotion",processEvent, true);
	
	navigator.geolocation.getCurrentPosition(onSuccess,onError);
	navigator.geolocation.watchPosition(onSuccess,onError);
}

function stopTime() 
{ 
	/* check if seconds, minutes and hours are not equal to 0 */ 
	if ( seconds !== 0 || minutes !== 0 || hours !== 0 ) 
	{
		seconds = 0;
		minutes = 0;
		//hours = 0;
		secs = '0' + seconds;
		mins = '0' + minutes + ':';
		$('.sRideDuration').html(mins + secs);
		clearTimeout( clearTime ); 
	}
} 

var count = 0; 
var clearTime; 
var seconds = 0, minutes = 0, hours = 0; 
var clearState; 
var secs, mins, gethours ;