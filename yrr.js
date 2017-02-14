'use strict';
var surname=document.getElementById('surName');
var givenname=document.getElementById('givenName');
var emailFirstPart=document.getElementById('emailLocal');
var emailSecondPart=document.getElementById('emailDomain');
var phoneNumber=document.getElementById('phoneNomber');
var submitBtn=document.getElementById('submit');
var newsLetterBox=document.getElementById('newsLetterBox');
var radioAnswersArr=['a','b','c'];
var popupBox=document.getElementById('popup');
var user={
		firstName: '',
		lastName: '',
		email: '',
		education:'' ,
		englishLevel: '',
		age: '',
	};
	
popupBox.setAttribute('display', 'none');
popupBox.addEventListener('click', popupDissapear);

/*  Listeners  */
surname.oninput=validatingName;  //oninput works in real time
givenname.oninput=validatingName;
emailFirstPart.onchange=validatingEmailDots;
emailSecondPart.onchange=validatingEmailDots;
phoneNumber.oninput=validatingPhoneNumber;

/*  validating while user typing  */
	/*  doesn't let invalid characters in the name inputs  */
function validatingName(){//ŐŐ szó közben beszúrt rossz karaktert hogy lehet eltüntetni, IT miért enged számot
	var nameLength=this.value.length;
	console.log('validtaingName');
	if (!/^[a-zéáűúőóüöí \.-]+$/ig.test(this.value)) {
		console.log("Invalid characters");
		this.value=this.value.substring(0,nameLength-1); //deletes invalid character
	}
	//console.log(this.value.indexOf(/^[a-zéáűúőóüöí .-]+$/i));

}
	/*  doesn't let duble .. or . be the first/last character in the email inputs  */
/* function validatingEmailLocal(){
	var emailLength=this.value.length;
	
	if (this.value.indexOf('..')>-1 || this.value.indexOf('.')==0 || this.value.indexOf('.')==emailLength ){
		console.log("Invalid email");// ŐŐ HOVA IRJAM KI ,HOGYAN JELEZZEM HOGY ROSSZ
		//this.value=this.value.substring(0,nameLength-1); //deletes invalid character
	} 

} */

function validatingEmailDots(){
	var emailLength=this.value.length;
	
	if (this.value.indexOf('..')>-1 || this.value.indexOf('.')==0 || this.value.indexOf('.')==emailLength ){
		console.log("Invalid email");//ŐŐ MI NEM LEHET BENNE ,HOGY TESZTELJEM
		popupBox.setAttribute("style", "display: block;");
		popupBox.innerHTML="Nem megfelelő email cím.";
		emailFirstPart.addEventListener('click', noShadow);
		emailFirstPart.setAttribute("style", "box-shadow: 0 0 2px red;");
		emailSecondPart.addEventListener('click', noShadow);
		emailSecondPart.setAttribute("style", "box-shadow: 0 0 2px red;");
		window.onscroll = popupDissapear;
	}
}
	/*  only number can be in the phone number inputs, without the number type controls  */
function validatingPhoneNumber(){
	var phoneLength=this.value.length;

	if (!/^[0-9+]*$/g.test(this.value)) {
		console.log("Invalid characters");
		this.value=this.value.substring(0,phoneLength-1); //deletes invalid character
	}
}

/*  validation, submitting and acting on server's answer  */
jQuery("form").on('submit',function(e){
	var schoolRadioArr=document.querySelectorAll('label [name="school"]');
	var englishRadioArr=document.querySelectorAll('label [name="english"]');
	var ageRadioArr=document.querySelectorAll('label [name="ageRange"]');
	var isThereWrongInput=0;
	
    e.preventDefault();
	popupBox.innerHTML='';
	
	user.firstName=givenname.value;
	user.lastName=surname.value;
	user.email=emailFirstPart.value+'@'+emailSecondPart.value;
	
	radioValues(schoolRadioArr,"education");
	radioValues(englishRadioArr, "englishLevel");
	radioValues(ageRadioArr, "age");
	
	/* checks the phone number again, so it can only contain numbers*/
	if (!/^[0-9+]*$/g.test(phoneNumber.value)) {
		popupBox.innerHTML+="Nem megfelelő telefonszám.<br><br>";
		window.onscroll = popupDissapear;
		phoneNumber.addEventListener('click', noShadow);
		phoneNumber.setAttribute("style", "box-shadow: 0 0 2px red;"); 
		isThereWrongInput+=1;
	}
	
	/* checks the last name again*/
	if (!/^[a-zéáűúőóüöí \.-]+$/ig.test(surname.value)) {
		popupBox.innerHTML+="Nem megfelelő vezetéknév.<br><br>";
		window.onscroll = popupDissapear;
		isThereWrongInput+=1;
				surname.addEventListener('click', noShadow);
		surname.setAttribute("style", "box-shadow: 0 0 2px red;");
		
	}
	
	/* checks the first name again*/
	if (!/^[a-zéáűúőóüöí \.-]+$/ig.test(givenname.value)) {
		popupBox.innerHTML+="Nem megfelelő keresztnév.<br><br>";
		window.onscroll = popupDissapear;
		isThereWrongInput+=1;
		givenname.addEventListener('click', noShadow);
		givenname.setAttribute("style", "box-shadow: 0 0 2px red;");
		
	}
	
	/* checks the email again*/
	if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ig.test(user.email.value)) {
		popupBox.innerHTML+="Nem megfelelő email cím.<br><br>";
		window.onscroll = popupDissapear;
		isThereWrongInput+=1;
		emailFirstPart.addEventListener('click', noShadow);
		emailFirstPart.setAttribute("style", "box-shadow: 0 0 2px red;");
		emailSecondPart.addEventListener('click', noShadow);
		emailSecondPart.setAttribute("style", "box-shadow: 0 0 2px red;");
	} 

	if(isThereWrongInput>0){
		popupBox.setAttribute("style", "display: block;");
		return;
	};

	if(newsLetterBox.checked==true){
		user.newsLetter='on';
	}
	console.log(user);
	var userJson = JSON.stringify(user);
	console.log(userJson);
	sendData(user);

});

function sendData(user){
	$.post("https://yellowroad.training360.com/registration", user, function(res) {
		console.log(res);
		if(res.success==true){
			submitBtn.innerHTML='Sikeres Regisztráció';
			submitBtn.classList.add('done');
			submitBtn.disabled=true;
		}
		if(res.error!=undefined){
			for(var i=0; i<res.error.length; i++){
			popupBox.innerHTML+=res.error[i];
			}
		window.onscroll = popupDissapear;
		
		
		popupBox.setAttribute("style", "display: block;");
		}
	});
}

/*  sets the a,b,c radio values in user obj  */
function radioValues(givenRadioArr, keyForUser){
	for(var i=0; i<givenRadioArr.length;i++){
		if(givenRadioArr[i].checked==true){
			user[keyForUser]=radioAnswersArr[i];
		}
	}
}

function popupDissapear(){
	popupBox.setAttribute("style", "display: none;");
}
function noShadow(){
	console.log(this);
	this.setAttribute("style", "box-shadow: none;"); 
}