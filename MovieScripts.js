function key_down(e) { //allow users to press enter instead of clicking the submit button on the form
	if(e.keyCode == 13) {
		search(); //call search when the enter key is pressed
	}
}

function search(){
	const app = document.getElementById('root')
	const logo = document.createElement('img')
	const container = document.getElementById('div')
	const card = document.createElement('div')
	const inputTitle = document.getElementById('Name')
	const openAddress = 'http://omdbapi.com/?t=' + inputTitle.value + '&apikey=a5834c47'
	container.setAttribute('class', 'container')
	card.setAttribute('class', 'card')

	if (container.firstChild) container.removeChild(container.firstChild);
	if (container.childElementCount > 1) container.removeChild(container.firstChild);

	var request = new XMLHttpRequest()
	request.open('GET', openAddress, true) //Open connection to OMDb API

	request.onload = function() {
		var data = JSON.parse(this.response) //parse OMDb response
		if (request.status >= 200 && request.status < 400) {

			if (document.getElementById('Name').value == "") { //User cannot submit empty search, alert them if they attempt this
				alert("Please enter a title or partial title.")
			}

			const sources = document.createElement('sources')
			var tempSources = '';

			var settings = {
				"async": true,
				"crossDomain": true,
				"url": "https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup?term=" + data.Title,
				"method": "GET",
				"headers": {
					"x-rapidapi-host": "utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com",
					"x-rapidapi-key": "d58ce49f7bmsh6c2652635ed2fecp1ef5c6jsnf8a990d34b0b"
				}
			}

			$.ajax(settings).done(function (response) {
				if (response.results.length != 0){
					for(i = 0; i < response.results.length; i++){
						if (response.results[i].name == data.Title){
							for (j = 0; j < response.results[i].locations.length; j++){

								if (j == response.results[i].locations.length - 1){
									tempSources += response.results[i].locations[j].display_name
								}
								else{
									tempSources += response.results[i].locations[j].display_name + ", ";
								}
							}
							sources.textContent = 'Available for streaming on: ' + tempSources;
						}
					}
				}
			});
			//Create dom elements
			const Title    = document.createElement('h1')
			const anchor	    = document.createElement('a')
			const link	= document.createTextNode (data.Title)
			anchor.appendChild(link);
			anchor.title = data.Title;
			anchor.href = "https://www.google.com/search?q=" + data.Title;
			Title.appendChild(anchor);
			const p        = document.createElement('p')
			const cast     = document.createElement('cast')
			const rel      = document.createElement('rel')
			const rate     = document.createElement('rate')
			const director = document.createElement('director')
			const reviews  = document.createElement('reviews')
			//add content to DOM elements
			if (data.Ratings[1] != undefined){
				reviews.textContent = `${data.Ratings[1].Source}: ${data.Ratings[1].Value}`
			}

			p.textContent 		 = `${data.Plot}`
			cast.textContent     = `Cast: ${data.Actors}`
			rel.textContent      = `Released: ${data.Year}`
			rate.textContent     = `Rated: ${data.Rated}`
			director.textContent = `Directed by ${data.Director}`

			//add elements to containers
			container.appendChild(card)
			card.appendChild(Title)
			card.appendChild(p)
			card.appendChild(rel)
			card.appendChild(director)
			card.appendChild(rate)
			if (reviews != null){
				card.appendChild(reviews)
			}
			card.appendChild(cast)
			card.appendChild(sources)
			app.appendChild(container)
	}
		else {
			const errorMessage = document.createElement('marquee')
			errorMessage.textContent = `Request Failed`
			app.appendChild(errorMessage)
		}
	}
	request.send();
}
