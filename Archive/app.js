const http = require('http');
const fs = require('fs'); //работа с файлами
const path = require('path'); //работа с путями
const os = require('os');
let port_http=8080;
const ip_adresses = os.networkInterfaces();

let host = '10.4.9.117';
for(const i in ip_adresses){ // получаем свой IP адрес для TCP, UDP и HTTP серверов
	for(const k in ip_adresses[i]){
		if(ip_adresses[i][k].family == 'IPv4'){
			if(ip_adresses[i][k].address!="127.0.0.1"){
				host=ip_adresses[i][k].address;
				console.log("HTTP Server running at http://" + host + ':' + port_http)
			}
		}
	}
}


const server = http.createServer((req, res) => {
    let first_url=req.url;
	//console.log("servers url - "+first_url);	
	if(req.method=='GET'){ // запросы страниц
		send_file( res, first_url);
	}
	if(req.method=='POST'){ // запросы от контроллера и администратора
		send_post(req, res);
	}
}); 
server.listen(port_http);
//console.log('port_http  '+port_http);

function send_file( res, first_url){
    //let mimeType;
    let new_url;
    //исправляем кодировку   
    try{
        new_url=decodeURIComponent(first_url);   
    }
    catch(e){
        res.statusCode = 400;  
        res.end("Bad reques");
        return;
    }
    // проверяем отсутствие 0 байта
    if(~new_url.indexOf('\0')){
        res.statusCode = 400;  
        res.end("Realy Bad reques");
        return;
    }
	//полный путь к файлу
	let all_url=path.normalize(path.join(__dirname,new_url));
	fs.stat(all_url,  function(err, st){
		let mimeType=path.extname(new_url);
		if(!mimeType){
		    mimeType="html";
		    all_url=all_url+"index.html";
		}
		fs.readFile(all_url, function(err, content, the_type=mimeType) { 
			if (err){
				res.writeHead(400,{'Content-Type':'text'});
				res.end('no file  ='+all_url);
			}else{
				res.writeHead(200,{'Content-Type':the_type});
				res.end(content);
			}				
		});
    });
}


function send_post(request, response){
    var body = [];
    request.on('error', function(err) {
        console.error(err);
    }).on('data', function(chunk) {
        body.push(chunk);
    }).on('end', function() {
        body = Buffer.concat(body).toString();
        try {
			console.log(body);
			for (let [key, value] of body) {
				console.log(`${key} - ${value}`)
			}
            
        } catch (e) {
            console.error(e);
        }
 
        response.on('error', function(err) {
            console.error(err);
        });
        response.writeHead(200);    
		if(flag){
			response.end(JSON.stringify(controllers[jsonObj.sn].answer));
		}
    });
}