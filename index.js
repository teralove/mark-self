//vers 1.0
		
module.exports = function MarkSelf(dispatch) {

    dispatch.hook('S_LOGIN', 2, function(event) {
		dispatch.toClient('S_PARTY_MARKER', 1, {
			markers: [{color: 0, target: event.cid}] // 0 = red, 1 = yellow, 2 = blue
		});	
	});
	
}