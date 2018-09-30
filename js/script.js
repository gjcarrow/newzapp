const apiKey = '3069187de5574b1593a4db207a707165'
const defaultSource = ''
const sourceSelector = document.querySelector('#newsSources')
const newsArticles = document.querySelector('main')

if ('serviceWorker' in navigator) {
	window.addEventListener('load', ()=>{
		navigator.serviceWorker.register('sw.js')
		.then(register=> console.log('Service Worker Registered'))
		.catch(err=> console.log('Service Worker Failed To Register'))
	})
}

window.addEventListener('load', e=>{
	sourceSelector.addEventListener('change', evt=> updateNews(evt.target.value))
	updateNewsSources().then(()=>{
		// sourceSelector.value = defaultSource;
		updateNews();
	})
})

window.addEventListener('online', ()=> updateNews(sourceSelector.value))

async function updateNewsSources () {
	const response = await fetch('https://newsapi.org/v2/sources?apiKey=' + apiKey);
	const json = await response.json()

	sourceSelector.innerHTML += 
		json.sources
			.map(source=> `<option value="${source.id}">${source.name}</option>`)
			.join('\n');
}

async function updateNews (source = defaultSource) {
	newsArticles.innerHTML = '';
	const url = (source.length)?`https://newsapi.org/v2/top-headlines?sources=${source}&sortBy=top&apiKey=${apiKey}`:`https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`
	const response = await fetch(url)
	// const response = await fetch()      

	const json = await response.json()
	newsArticles.innerHTML = json.articles.map(createArticle).join('\n');
}

function createArticle (article) {
	const backups = {
		urlToImage: 'images/white-dog-icon.png',
		description: 'A description for this article is not currently available.',
		title: 'News Item',
		url: '#'
	}
	const urlToImage = typeof article.urlToImage==='string'?article.urlToImage:backups.urlToImage;
	const description = typeof article.description==='string'?article.description:backups.description;
	const title = typeof article.title === 'string'?article.title:backups.title;
	const url = typeof article.url==='string'?article.url:backups.url;

	return `
	<div class='article'>
		<a href="${url}" target="_blank">
			<h2>${title}</h2>
			<img src="${urlToImage}" alt="${title}" />
			<p>${description}</p>
		</a>
	</div>
	`;
}