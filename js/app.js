$(document).ready(function() {
	alert("hello");
	$('.get-projects').submit(function(event){
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		var tags = $(this).find("input[name='tags']").val();
		getProjects(tags);
	});
});

var showProjects = function(projects) {
	
	// clone our result template code
	var result = $('.templates .projects').clone();
	
	// Set the project image in result
	var pImage = result.find('.image a');
	pImage.attr('href', projects.proposalURL);
	pImage.html("<img src=" + projects.imageURL + "/>");

	// set the project title in result
	var pTitle = result.find('.p-title a');
	pTitle.attr('href', projects.proposalURL);
	pTitle.text(projects.title)

	// set the learn more link in result
	var pLearn = result.find('.p-full');
	pLearn.html('<a target="_blank" href='+ projects.proposalURL +'</a></p>')

	// set the fund now link in result
	var pFund = result.find('.donate');
	pFund.html('<a target="_blank" href='+ projects.fundURL +'</a></p>');

	return result;
};

var getProjects = function (tags) {

	var result = $.ajax({
		url: "http://api.donorschoose.org/common/json_feed.html?keywords="+tags+"&partiallyFunded=no&highLevelPoverty=true&showSynopsis=true&APIKey=DONORSCHOOSE",
		dataType: "jsonp",
		type: "GET",
	})
	.done(function(result){

		$.each(result.proposals, function(i, item) {
			var projects = showProjects(item);
			$('.results').append(projects);
		});
	});
};

