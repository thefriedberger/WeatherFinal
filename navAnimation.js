$('#toggleBox').bind("click", animate);

function animate() {
	if ($('#top').hasClass("thingy noAnimation")) {
		$('#top').removeClass("noAnimation").addClass("topMoveForward");
		$('#middle').removeClass("noAnimation").addClass("middleMoveForward");
		$('#bottom').removeClass("noAnimation").addClass("bottomMoveForward");
		$('#navSlot1').removeClass("moveNav1Up").addClass("moveNav1Down");
		$('#navSlot2').removeClass("moveNav2Up").addClass("moveNav2Down");

		$('#nav').removeClass('hidden');
		$('#nav').addClass('animate');
	} else {
		$('#top').removeClass("topMoveForward").addClass("topMoveBack");
		$('#middle').removeClass("middleMoveForward").addClass("middleMoveBack");
		$('#bottom').removeClass("bottomMoveForward").addClass("bottomMoveBack");
		$('#navSlot1').addClass("moveNav1Up").removeClass("moveNav1Down");
		$('#navSlot2').addClass("moveNav2Up").removeClass("moveNav2Down");

		$('#nav').removeClass('animate');
		$('#nav').addClass('hideNav');

		setTimeout(function() {
			$('#top').removeClass('topMoveBack').addClass("thingy noAnimation");
			$('#middle').removeClass('middleMoveBack').addClass("thingy noAnimation");
			$('#bottom').removeClass('bottomMoveBack').addClass("thingy noAnimation");
			$('#nav').removeClass('hideNav');
			$('#nav').addClass('hidden');
		},1000);
	}
}
