//vers 1.1

const format = require('./format.js');
		
module.exports = function MarkSelf(dispatch) {
	
	const MarkerColor = 0; // 0 = red, 1 = yellow, 2 = blue
	const SendToServer = false; // False = only you will see your marker. True = Leader can mark themself for party/raid (cannot mark yourself if you're not leader).
	
	let enabled = false,
	cid,
	marks = [];
		
    dispatch.hook('S_LOGIN', 2, function(event) {
		cid = event.cid;
	});
			
	const chatHook = event => {		
		let command = format.stripTags(event.message).split(' ');
		
		if (['!markself', '!markme'].includes(command[0].toLowerCase())) {
			toggleMarker(MarkerColor);
			return false;
		}
		else if (['!clearmarkers', '!clearmarks'].includes(command[0].toLowerCase())) {
			removeAllMarkers();
			return false;
		}
	}
	dispatch.hook('C_CHAT', 1, chatHook)	
	dispatch.hook('C_WHISPER', 1, chatHook)
  
	function toggleMarker() {
		enabled = !enabled;
		if (enabled) {
			addMarker();
		} else {
			removeMarker();
		}
	}
	
    dispatch.hook('S_PARTY_MARKER', 1, function(event) {
		marks = event.markers;
	});
	
	function addMarker()
	{
		marks.push({color: MarkerColor, target:cid});
		updateMarkers();
	}
	
	function removeMarker()
	{
		for (let i in marks) {
			if (marks[i].target - cid == 0) {
				marks.splice(i, 1);
			}
		}
		updateMarkers();
	}
	
	function removeAllMarkers()
	{
		marks = [{}];
		updateMarkers();
	}
	
	function updateMarkers()
	{
		if (SendToServer) {
			dispatch.toServer('C_PARTY_MARKER', 1, {
				markers: marks 
			});
		} else {
			dispatch.toClient('S_PARTY_MARKER', 1, {
				markers: marks 
			});
		}
	}
	
}