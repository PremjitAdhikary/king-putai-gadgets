var winConditions = {
	win   : "001",
	trio  : "111",
	pair  : "0nn",
	straight : "123",
	flush : "145",
	even  : "246",
	top1  : "257",
	top2  : "347", 
	top3  : "356"
};

function processMove(move){alert('in AI for: '+move);
	var result = "";
	var formattedMove = formatMove(move);
	//sysout('formattedMove>'+formattedMove);
	var chosenStrat = checkForStrategy(formattedMove);
	//sysout('chosenStrat>'+chosenStrat);
	if(chosenStrat != ""){
		result = processReturnMove(move, formattedMove, chosenStrat);
	}
	else
		result = randomMove(move);
		//result = 'no';
	return result;
}

function randomMove(move){
	/*var numOf0 = (move.match(/0/g)||[]).length;
	sysout(numOf0);
	var whichGroup = Math.floor((Math.random()*(3-numOf0))+1);
	sysout(whichGroup);*/
	var returnGroup = Math.floor((Math.random()*(determineGroups(move)))+1);
	var returnMove = 0;
	if(move.charAt(returnGroup-1) != 0)
		returnMove = parseInt(move.charAt(returnGroup-1));
	else
		returnMove = findLargest(move);
	var stratToApply = Math.floor((Math.random()*1) +1);
	returnMove = returnMove+'-'+(returnMove-stratToApply);
	//sysout(returnMove);
	return returnMove;
}

function findLargest(move){
	var temp = 0;
	for(var i=0; i<determineGroups(move); i++){
		if(temp < parseInt(move.charAt(i)))
			temp = parseInt(move.charAt(i));
		//sysout('temp='+temp);
	}
	return temp;
}

function processReturnMove(move, formattedMove, chosenStrat){
	var stratToApply = chosenStrat.split(':')[0];
	var markedMove = chosenStrat.split(':')[1];
	var returnMove = "";
	//sysout(move+', '+formattedMove+', '+markedMove+', '+stratToApply);
	if (stratToApply == "0nn"){
		if((formattedMove.charAt(0) == 0) || (parseInt(formattedMove.charAt(0)) < parseInt(formattedMove.charAt(1))))
			stratToApply = 0+formattedMove.charAt(1)+formattedMove.charAt(1);
		else 
			stratToApply = 0+formattedMove.charAt(0)+formattedMove.charAt(0);
	} //else {
		for(var i=0; i<determineGroups(move); i++){
			if(markedMove.charAt(i) == 'x'){
				stratToApply = stratToApply.replace(formattedMove.charAt(i), '');
			} else {
				returnMove = formattedMove.charAt(i);
			}
		}
	//}
	returnMove = returnMove+'-'+stratToApply;
	//sysout(returnMove);
	return returnMove;
}

function formatMove(move){
	var formattedMove = "";
	var moveArr = [];
	for(var i=0; i<move.toString().length; i++){
		moveArr[i] = parseInt(move.charAt(i));
	}
	moveArr.sort(function(a,b){return a - b});
	for(var i=0; i<move.toString().length; i++){
		formattedMove += ""+moveArr[i];
	}
	return formattedMove;
}

function checkForStrategy(move){
	var numOfGroup = determineGroups(move);
	var isWinMove = new Boolean(false);
	var chosenStrat = "";
	var tmpMove = "";
	var chAt0 = parseInt(move.charAt(0));
	var chAt1 = parseInt(move.charAt(1));
	var chAt2 = parseInt(move.charAt(2));
	for(var index in winConditions) {
		var tmpStrat = "";
		var numOfX = 0;
		if(winConditions[index] == "0nn") {
			//sysout('0nn check');
			if(chAt0==chAt1 && chAt1>1 && chAt2>0) tmpStrat = "xx"+chAt2;
			else if(chAt1==chAt2 && chAt1>1 && chAt0>0) tmpStrat = chAt0+"xx";
			//else if(chAt0==chAt2 && chAt0>1 && chAt1>0) tmpMove = "x"+tmpMove + chAt1+"x" + ":0nn"+"\n";
			else if(chAt0==0 && chAt1>1 && chAt1<chAt2) tmpStrat = "xx"+chAt2;
		} else if( !(chAt0>=parseInt(winConditions[index].charAt(0)) 
		    && chAt1>=parseInt(winConditions[index].charAt(1)) 
			&& chAt2>=parseInt(winConditions[index].charAt(2))) ) {
			//sysout('move < strategy check: '+winConditions[index]);
			continue;
		} else {
			//sysout('calculate strategy: '+winConditions[index]);
			tmpStrat = movePatternMatcher(move, winConditions[index]);
		}
		if(tmpStrat != ""){
			numOfX = (tmpStrat.match(/x/g)||[]).length;
			tmpMove = tmpMove + tmpStrat + ":"+ winConditions[index]+":"+numOfX+"\n";
		}
		if(numOfX == 2){
			chosenStrat = winConditions[index]+":"+tmpStrat;
			break;
		}
	}
	//sysout(tmpMove);
	return chosenStrat;
}

function movePatternMatcher(move, strategy){
	var tmpMove = move;
	for(var i=0; i<strategy.length; i++){
		var ch_st = strategy.charAt(i);
		var matchedChPos = tmpMove.indexOf(ch_st);
		if(matchedChPos != -1)
			tmpMove = tmpMove.substring(0,matchedChPos)+'x'+tmpMove.substring(matchedChPos+1);
	}
	return tmpMove;
}

function sysout(str){
	if(allowSys)
		document.getElementById('sysout').value = document.getElementById('sysout').value + str+'\n';
}

/*
function checkForWinMove(move, numOfGroup){
	//var isWinMove = new Boolean(false);
	
	return ( (numOfGroup == 1 && (1 < parseInt(move))) || 
			( numOfGroup == 2 && ( (move.charAt(0) == 1 && parseInt(move.charAt(1)) > 1) 
									|| (move.charAt(1) == 1 && parseInt(move.charAt(0)) > 1)) ) );
}*/

function determineGroups(move){
	return (move.toString().length) ;
}