let abonent={
	key:'',
	session:'',	
	domain:''
};
let comm={
	ax_get(func, url){//стандартная функция отправки сообщения
		let req=new XMLHttpRequest();
		req.addEventListener('load', control[func]);//привязали контекст
		req.open('GET', url, true);
		req.setRequestHeader('Content-Type', 'application/json');
		req.responseType = 'text';
		req.send();
	},
	ax(form, url){//стандартная функция отправки сообщения
		let req=new XMLHttpRequest();
		req.addEventListener('load', comm.show_ax);//привязали контекст
		//req.upload;
		req.open('POST', url, true);
		//req.setRequestHeader('Content-Type', 'multipart/form-data');//'application/json');
		//req.setRequestHeader('Content-Type', 'application/json');
		
		
		req.responseType = 'text';
		req.send(form);
		//req.onload=comm.err;
	},

	err(e){
		let data=e.target;
		if(data.status!=200){
			if(data.status>399){
				console.log(data.status);
			}
			if(data.response=="Wrong login or password"||data.response=="Wrong domain, session or session expired"){
				control.on_on(['first_menu', 'manual_munu', 'manual_login']);
			}
		}
	},
    show_ax(e) {//стандартная функция получения сообщения
        let data=e.target;
		let obj;
		let isValidJSON=true;
        if(data.status==200){
			try { obj=JSON.parse(data.response)} catch { isValidJSON = false };
			if(!isValidJSON){
				obj=data.response;
				
			}
			//return obj;
			console.log(data.response);
		}
    }

};

let links={ //связываем действия пользователя с функциями
	click:{}, //кнопки
	felds:{},  //поля для ручного ввода данных
	selects:{}, //элементы selektые,

    call_func (e){
        let rand=Math.floor(Math.random() * 20) +40;
        document.documentElement.style.setProperty('--position_fon', rand+'%');
        let link=e.target;
		let nodeName_patent=link.parentNode.nodeName; // таблица
		if(nodeName_patent=='TD'){
			let name=link.parentNode.parentNode.parentNode.dataset.name;
			if(name=='role_list'){ //функции по изменению
				control[name](link);
			}
		}
        name=link.dataset.click;
        if(name!='undefined'){ //функции по клику
			control[name](); 
        }
    },
    call_func_chng (e){
        let link=e.target;
        let name=link.parentNode.parentNode.parentNode.dataset.inputs;
		//let obj={};
        if(name){ //функции по изменению
			control[name](link);
			return;
        }
        name=link.parentNode.parentNode.parentNode.dataset.name_arr;
        if(name){ //функции по изменению
			//control.arr_change(link); 
			return;
        }
        name=link.dataset.id;
        if(name){ //функции по изменению
			control[name](link);
        }
    },
};

let control={
	send(){
	    let ab = new FormData();//создали объект форма
		for(let i in links.felds){
            ab.append(i, links.felds[i].value);
		}
        let file=document.querySelector('.centre>select');
        ab.append('file', myfile.files[0]);
        url='php/ax.php';
		comm.ax(ab, url);
	},



};
function start(){
	let list=document.querySelectorAll('div[data-line]');
	for(let i=0; i<list.length; i++){
		list[i].children[0].innerText =list[i].dataset.line;
		links.felds[list[i].dataset.line]=list[i].children[1];
	}
	list=document.querySelectorAll('div[data-click]');
	for(let i=0; i<list.length; i++){
		links.click[list[i].dataset.click]=list[i];
	}
}

function start(){
	let list=document.querySelectorAll('div[data-line]');
	for(let i=0; i<list.length; i++){
		list[i].children[0].innerText =list[i].dataset.line;
		links.felds[list[i].dataset.line]=list[i].children[1];
	}
	list=document.querySelectorAll('div[data-click]');
	for(let i=0; i<list.length; i++){
		links.click[list[i].dataset.click]=list[i];
	}


	//if(localStorage.owner_abonent){
	//	abonent=JSON.parse(localStorage.owner_abonent);
	//}
	//if(abonent.session){
	//	control.on_on(['main_menu', 'manual_munu']);
	//	control.check_comand('list_domain');
	//} else {
	//	control.on_on(['first_menu', 'manual_first_menu']);
	//}
}


let link_window_all=document.querySelector('body');
link_window_all.addEventListener('click', links.call_func);  
link_window_all.addEventListener("change", links.call_func_chng);


start();