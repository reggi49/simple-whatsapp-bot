(() => {
	//
	// GLOBAL VARS AND CONFIGS
	//
	var lastMessageOnChat = false;
	var ignoreLastMsg = {};
	var elementConfig = {
		"chats": [0, 0, 5, 2, 0, 3, 0, 0, 0],
		"chat_icons": [0, 0, 1, 1, 1, 0],
		"chat_title": [0, 0, 1, 0, 0, 0, 0],
		"chat_lastmsg": [0, 0, 1, 1, 0, 0],
		"chat_active": [0, 0],
		"selected_title": [0, 0, 5, 3, 0, 1, 1, 0, 0, 0, 0]
	};

	const jokeList = [
		`
		Jangan tenggelam dalam masa lalu, jangan bermimpi di masa depan, konsentrasikan pikiran pada kejadian hari ini. - Buddha`,

		`
		Hidup bukan masalah untuk diselesaikan tetapi realita untuk dihadapi. - Soren Kierkegaard`,

		`
		Jika Anda hidup cukup lama, Anda membuat banyak kesalahan. Tetapi jika Anda belajar dari kesalahan tersebut, Anda akan menjadi orang yang lebih baik. Itu adalah bagaimana Anda menghadapi kesulitan, bukan bagaimana hal itu mempengaruhi Anda. Hal yang utama adalah jangan berhenti, jangan berhenti, dan jangan berhenti. - William J. Clinton.`,

		`
		Pertanyaan yang paling mendesak dan presisten dalam hidup adalah Apa yang Anda lakukan bagi orang lain? - Martin Luther King, Jr.`,
		
		`
		Buka mata dan lihat sekitar. Apakah Anda bahagia dengan hidup Anda? - Bob Marley.`,
		
		`
		Anda tidak akan pernah bahagia jika Anda masih mencari apa komposisi kebahagiaan. Anda tidak akan pernah hidup jika Anda masih mencari arti hidup. - Albert Camus.`,
		
		`
		Anda memiliki musuh? Bagus. Itu artinya Anda berdiri untuk sesuatu, suatu saat dalam hidup Anda. - Winston Churchill.`,
		
		`
		Tidak penting seberapa lambat Anda bergerak selama Anda tidak berhenti. - Confucius.`,
		
		`
		Selalu lakukan yang terbaik. Apa yang Anda tanam sekarang, akan Anda tuai nantinya. - Og Mandino.`,
		
		`
		Jika Anda bisa memimpikannya, Anda bisa melakukannya. - Walt Disney.`,
		
		`
		Bekerjalah untuk mencapai sesuatu itu sekarang. Masa depan tidak dijanjikan untuk siapa-siapa. - Wayne Dyer.`,
		
		`
		Buatlah sesuatu yang hebat, orang akan mencoba menirunya. - Albert Schweitzer.`,
		
		`
		Kualitas bukanlah sebuah aksi, itu adalah kebiasaan. - Aristotle.`,
		
		`
		Jika Anda terjatuh kemarin, berdirilah untuk hari ini. - H. G. Wells.`,
		
		`
		Selangkah demi selangkah dan pekerjaan akan selesai. - Charles Atlas.`,
		
		`
		Hidup itu penuh dengan kejutan. - John Major.`,
		
		`
		Sebuah pengakuan harus menjadi bagian dari hidup baru Anda. - Ludwig Wittgenstein.`,
		
		`
		Jika hidup Anda berubah, kita bisa mengubah dunia juga. - Yoko Ono.`,
		
		`
		Anda ditakdirkan untuk membuat keputusan atau pilihan. Inilah paradox terbesar kehidupan. - Wayne Dyer.`,
		
		`
		Jika Anda ingin menghidupi hidup yang penuh dengan kenangan, Anda harus menjadi orang yang ingat untuk mengingat. - Joshua Foer.`,
		
		`
		Pemenang adalah mereka yang memiliki tujuan pasti dalam hidup. - Denis Waitley.`,
		
		`
		Tidakkah Anda tahu bahwa kesempurnaan hidup berarti akhir dari sebuah seni? - Robert Musil.`,
		
		`
		Apa yang Anda dapatkan adalah kehidupan, apa yang Anda beri adalah hidup. - Lillian Gish.`,
		
		`
		Moto hidup saya adalah 'Ambillah resiko' Anda tidak memiliki suara jika Anda tidak melakukannya. Anda harus berusaha di luar batas Anda. Itulah kehidupan yang sesungguhnya. - Kelly Wearstler.`,
		
		`
		Kita harus bisa mengapresiasi betapa berharganya hidup ini. - Shelley Fabares.`
	]
	//
	// FUNCTIONS
	//

	// Get random value between a range
	function rand(high, low = 0) {
		return Math.floor(Math.random() * (high - low + 1) + low);
	}
	
	function getElement(id, parent){
		if (!elementConfig[id]){
			return false;
		}
		var elem = !parent ? document.body : parent;
		var elementArr = elementConfig[id];
		elementArr.forEach(function(pos) {
			if (!elem.childNodes[pos]){
				return false;
			}
			elem = elem.childNodes[pos];
		});
		return elem;
	}
	
	function getLastMsg(){
		var messages = document.querySelectorAll('.msg');
		var pos = messages.length-1;
		
		while (messages[pos] && (messages[pos].classList.contains('msg-system') || messages[pos].querySelector('.message-in'))){
			pos--;
			if (pos <= -1){
				return false;
			}
		}
		if (messages[pos] && messages[pos].querySelector('.selectable-text')){
			return messages[pos].querySelector('.selectable-text').innerText.trim();
		} else {
			return false;
		}
	}
	
	function getUnreadChats(){
		var unreadchats = [];
		var chats = getElement("chats");
		if (chats){
			chats = chats.childNodes;
			for (var i in chats){
				if (!(chats[i] instanceof Element)){
					continue;
				}
				var icons = getElement("chat_icons", chats[i]).childNodes;
				if (!icons){
					continue;
				}
				for (var j in icons){
					if (icons[j] instanceof Element){
						if (!(icons[j].childNodes[0].getAttribute('data-icon') == 'muted' || icons[j].childNodes[0].getAttribute('data-icon') == 'pinned')){
							unreadchats.push(chats[i]);
							break;
						}
					}
				}
			}
		}
		return unreadchats;
	}
	
	function didYouSendLastMsg(){
		var messages = document.querySelectorAll('.msg');
		if (messages.length <= 0){
			return false;
		}
		var pos = messages.length-1;
		
		while (messages[pos] && messages[pos].classList.contains('msg-system')){
			pos--;
			if (pos <= -1){
				return -1;
			}
		}
		if (messages[pos].querySelector('.message-out')){
			return true;
		}
		return false;
	}

	function calc(fn) {
		try {
			return new Function('return ' + fn)();
		}
		catch (err) {
			return "Gunakan Lambang dan simbol matematika secara lengkap!. Cth 6/2*(1+2)."
		}
	}

	// Call the main function again
	const goAgain = (fn, sec) => {
		// const chat = document.querySelector('div.chat:not(.unread)')
		// selectChat(chat)
		setTimeout(fn, sec * 1000)
	}

	// Dispath an event (of click, por instance)
	const eventFire = (el, etype) => {
		var evt = document.createEvent("MouseEvents");
		evt.initMouseEvent(etype, true, true, window,0, 0, 0, 0, 0, false, false, false, false, 0, null);
		el.dispatchEvent(evt);
	}

	// Select a chat to show the main box
	const selectChat = (chat, cb) => {
		const title = getElement("chat_title",chat).title;
		eventFire(chat.firstChild.firstChild, 'mousedown');
		if (!cb) return;
		const loopFewTimes = () => {
			setTimeout(() => {
				const titleMain = getElement("selected_title").title;
				if (titleMain !== undefined && titleMain != title){
					console.log('not yet');
					return loopFewTimes();
				}
				return cb();
			}, 300);
		}

		loopFewTimes();
	}

	// Send a message
	const sendMessage = (chat, message, cb) => {
		//avoid duplicate sending
		var title;

		if (chat){
			title = getElement("chat_title",chat).title;
		} else {
			title = getElement("selected_title").title;
		}
		ignoreLastMsg[title] = message;
		
		messageBox = document.querySelectorAll("[contenteditable='true']")[1];

		//add text into input field
		messageBox.innerHTML = message.replace(/  /gm,'');

		//Force refresh
		event = document.createEvent("UIEvents");
		event.initUIEvent("input", true, true, window, 1);
		messageBox.dispatchEvent(event);

		//Click at Send Button
		eventFire(document.querySelector('span[data-icon="send"]'), 'click');

		cb();
	}

	//
	// MAIN LOGIC
	//
	const start = (_chats, cnt = 0) => {
		// get next unread chat
		const chats = _chats || getUnreadChats();
		const chat = chats[cnt];
		
		var processLastMsgOnChat = false;
		var lastMsg;
		
		if (!lastMessageOnChat){
			if (false === (lastMessageOnChat = getLastMsg())){
				lastMessageOnChat = true; //to prevent the first "if" to go true everytime
			} else {
				lastMsg = lastMessageOnChat;
			}
		} else if (lastMessageOnChat != getLastMsg() && getLastMsg() !== false && !didYouSendLastMsg()){
			lastMessageOnChat = lastMsg = getLastMsg();
			processLastMsgOnChat = true;
		}
		
		if (!processLastMsgOnChat && (chats.length == 0 || !chat)) {
			console.log(new Date(), 'nothing to do now... (1)', chats.length, chat);
			return goAgain(start, 3);
		}

		// get infos
		var title;
		if (!processLastMsgOnChat){
			title = getElement("chat_title",chat).title + '';
			lastMsg = (getElement("chat_lastmsg", chat) || { innerText: '' }).title.replace(/[\u2000-\u206F]/g, ""); //.last-msg returns null when some user is typing a message to me
		} else {
			title = getElement("selected_title").title;
		}
		// avoid sending duplicate messaegs
		if (ignoreLastMsg[title] && (ignoreLastMsg[title]) == lastMsg) {
			console.log(new Date(), 'nothing to do now... (2)', title, lastMsg);
			return goAgain(() => { start(chats, cnt + 1) }, 0.1);
		}

		// what to answer back?
		let sendText

		if (lastMsg.toUpperCase().indexOf('@HELP') > -1){
			sendText = `
				Beberapa Command untuk Group WA ${title} !

				1. @time
				2. @motivasi
				3. @notes judul;isi (ex: @notes hello;hello world!)
				4. @shownote judul (ex: @shownote hello)
				5. @countdown 5 (exp : hitungan mundur dalam 5 menit / satuan menit)
				6. @hitung (100*2)/200 (hasilnya 1 kaya kamu)`
		}

		if (lastMsg.toUpperCase().indexOf('@TIME') > -1){
			sendText = `
				Saat ini Jam

				*${new Date()}*`
		}

		if (lastMsg.toUpperCase().indexOf('@MOTIVASI') > -1){
			// console.log(lastMsg)
			sendText = lastMsg + jokeList[rand(jokeList.length - 1)];
		}

		if (lastMsg.toUpperCase().indexOf('@NOTES') > -1){
			gTitle = getElement("chat_title", chat).title;
			content = lastMsg.substring(7);
			reminder = content.split(";");
			judulPenuh =  gTitle+`-`+reminder[0];
			judul =  reminder[0];
			isi =  reminder[1];
			// itemsArray.push(content)
			localStorage.setItem(judulPenuh, JSON.stringify(isi));
			sendText = ` Judul : ` + judul + 
			`
			Isi : `+ isi +
			`
			oke noted bos !`;
		}

		if (lastMsg.toUpperCase().indexOf('@SHOWALLNOTES') > -1){
			const gTitle = getElement("chat_title", chat).title;
			const fTitle = gTitle +`-`; 
			i = 0;

			if (localStorage.getItem(fTitle + i) != null) {

				for (i = 0; i < localStorage.length; i++) {

					console.log(i)

				}
			}

			for (var i = 0, len = localStorage.length; i < len; ++i) {
				console.log(localStorage.getItem(localStorage.key(i)));
			}
			// sendText = ` Judul : ` + judul + 
			// `
			// Isi : `+ isi +
			// `
			// oke noted bos !`;
		}
		
		if (lastMsg.toUpperCase().indexOf('@SHOWNOTE') > -1){
			judul = lastMsg.substring(10);
			const gTitle = getElement("chat_title", chat).title;
			const fTitle = gTitle + `-` + judul; 
			content = localStorage.getItem(fTitle);
			sendText = `Isi Notes `+ 
			content;
		}

		if (lastMsg.toUpperCase().indexOf('@COUNTDOWN') > -1){
			countdown = lastMsg.substring(11);
			timer = countdown * 60;
			timerInterval = setInterval(() => {
				console.log('timer:' + timer)
				minutes = parseInt(timer / 60, 10)
				seconds = parseInt(timer % 60, 10);

				minutes = minutes < 10 ? "0" + minutes : minutes;
				seconds = seconds < 10 ? "0" + seconds : seconds;
				console.log('tersisa'+minutes)
				--timer;
				if (timer == 120)  {
					sendMessage(null, 'Countdown Kurang Dari 2 Menit', () => {
						goAgain(() => { start(chats, cnt + 1) }, 1);
					});
				} else if (timer == 60) {
					sendMessage(null, 'Countdown Kurang Dari 1 Menit', () => {
						goAgain(() => { start(chats, cnt + 1) }, 1);
					});
				} else if (timer < 1) {
					sendMessage(null, 'Waktu habis', () => {
						goAgain(() => { start(chats, cnt + 1) }, 1);
					});
					clearInterval(timerInterval);
				}
			}, 1000);
			sendText = `Dihitung mundur dalam ` +
				countdown + ` Menit`;
		}
		
		if (lastMsg.toUpperCase().indexOf('@HITUNG') > -1){
			var hitung = lastMsg.substring(8);
			var hasil = calc(hitung);
			sendText = `hasilnya : ` +
				hasil ;
		}
		
		// that's sad, there's not to send back...
		if (!sendText) {
			ignoreLastMsg[title] = lastMsg;
			console.log(new Date(), 'new message ignored -> ', title, lastMsg);
			return goAgain(() => { start(chats, cnt + 1) }, 0.1);
		}

		console.log(new Date(), 'new message to process, uhull -> ', title, lastMsg);

		// select chat and send message
		if (!processLastMsgOnChat){
			selectChat(chat, () => {
				sendMessage(chat, sendText.trim(), () => {
					goAgain(() => { start(chats, cnt + 1) }, 1);
				});
			})
		} else {
			sendMessage(null, sendText.trim(), () => {
				goAgain(() => { start(chats, cnt + 1) }, 1);
			});
		}
	}
	start();
})()
