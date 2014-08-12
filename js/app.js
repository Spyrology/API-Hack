(function (){
	"use strict";
	var tags;
	var spinner;
	var currentIndex = 0;
	var target;

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

	var getProjects = function (tags, index) {

		spinner.spin(target);

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

		promise.done(function(result){

				spinner.stop();

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

	function loadMore() {
			$('.footer-nav').hide();
			$('.results').html('');
	      currentIndex += 12;  //increment index to load more projects
			getProjects(tags, currentIndex);
	};

	function loadPrevious() {
		$('.footer-nav').hide();
		$('.results').html('');
	    currentIndex -= 12;  //decrement index to load previous projects
			getProjects(tags, currentIndex);
	};

	function initSpinner () {
	var opts = {
	  lines: 5, // The number of lines to draw
	  length: 20, // The length of each line
	  width: 10, // The line thickness
	  radius: 30, // The radius of the inner circle
	  corners: 1, // Corner roundness (0..1)
	  rotate: 54, // The rotation offset
	  direction: 1, // 1: clockwise, -1: counterclockwise
	  color: '#000', // #rgb or #rrggbb or array of colors
	  speed: 1, // Rounds per second
	  trail: 60, // Afterglow percentage
	  shadow: false, // Whether to render a shadow
	  hwaccel: false, // Whether to use hardware acceleration
	  className: 'spinner', // The CSS class to assign to the spinner
	  zIndex: 2e9, // The z-index (defaults to 2000000000)
	  top: '200px', // Top position relative to parent
	  left: '50%' // Left position relative to parent
	};

		target = document.getElementById('spinner');
		spinner = new Spinner(opts).spin(target);
		spinner.stop();
	};

	function loadInitial() {
		max = 3;
		tags = "civics";
		getProjects(tags);
	};

	$(document).ready(function() {

		initSpinner();

		getProjects("civics");
		
		$('.search-img').on('click', function(event) {
			// zero out results if previous search has run
			$('.results').html('');
			// hide navigation in case previous search has run
			$('.footer-nav').hide();
			//reset currentIndex for new searches
			currentIndex = 0;
			// get the value of the tags the user submitted, which is derived from the 'id' of the subject icon they've clicked.
			tags = ($(this).find('img').attr('id'));
			getProjects(tags);
		});

		$('#load-more').click(function(){
			loadMore();
		});

		$('#load-previous').click(function(){
			loadPrevious();
		});

	});
}());