var showProjects = function(projects) {
	
	// clone our result template code
	var result = $('.templates .projects').clone();
	var pLink = projects.proposalURL;
	
	// Set the project image in result
	var pImage = result.find('.p-image img');
	var imgLink = result.find('.p-image a');
	var image = projects.imageURL;
	pImage.attr('src', image);
	imgLink.attr('href', pLink);

	// set the project title in result
	var pTitle = result.find('.p-title a');
	pTitle.attr('href', pLink);
	pTitle.html(projects.title);
	pTitle.css({
		"text-decoration": "none", 
		"font-weight": "bold", "color": "rgb(226,104,59)"
	});

	return result;
};

var currentIndex = 0;

var getProjects = function (tags, index) {

	var promise = $.ajax({
		type: "GET",
		url: "http://api.donorschoose.org/common/json_feed.html",
		data: {
			partiallyFunded: "no",
			keywords: tags,
			highLevelPoverty: "true",
			showSynopsis: "true",
			APIKey: "DONORSCHOOSE",
			index: currentIndex,
			max: 12,
		},
		dataType: "jsonp",
	});

	loadMore = function() {
		$('.footer-nav').hide();
		$('.results').html('');
      currentIndex += 12;  //increment index to load more projects
		getProjects(tags, currentIndex);
	};

	loadPrevious = function() {
		$('.footer-nav').hide();
		$('.results').html('');
      currentIndex -= 12;  //decrement index to load previous projects
		getProjects(tags, currentIndex);
	};

	promise.done(function(result){

		$.each(result.proposals, function(i, item) {
			var projects = showProjects(item);
			$('.results').append(projects);
		});
	$('.footer-nav').show();
	$('#load-more').show();
	if (currentIndex >= 12) {
		$('#load-previous').show();
	}
	else {
		$('#load-previous').hide();
	};
	});
};

var tags;

$(document).ready(function() {
	alert("hello");
	$('.search').on('click', "img", function(event) {
		// zero out results if previous search has run
		$('.results').html('');
		// hide navigation in case previous search has run
		$('.footer-nav').hide();
		//reset currentIndex for new searches
		currentIndex = 0;
		// get the value of the tags the user submitted, which is derived from the 'id' of the subject icon they've clicked.
		tags = ($(this).attr('id'));
		getProjects(tags);
	});

	$('#load-more').click(function(){
		loadMore();
	});

	$('#load-previous').click(function(){
		loadPrevious();
	});
});