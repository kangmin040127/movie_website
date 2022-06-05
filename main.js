const API_KEY = 'api_key=d338cc5f2abc1b43e966df5f04b0ee1d'
const BASE_URL = 'https://api.themoviedb.org/3'
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY;
const searchURL = BASE_URL + '/search/movie?' + API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500'

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const searchBtn = document.getElementById('search-btn');
const menusEl = document.getElementById('menus');

const genres = [
    {
        "id":28,
        "name":"Action"
    },
    {
        "id":12,"name":"Adventure"
    },
    {
        "id":16,"name":"Animation"
    },
    {
        "id":35,"name":"Comedy"
    }
    ,{
        "id":80,"name":"Crime"
    },
    {
        "id":99,"name":"Documentary"
    }
    ,{
        "id":18,"name":"Drama"
    }
    ,{
        "id":10751,"name":"Family"
    }
    ,{
        "id":14,"name":"Fantasy"
    },
    {
        "id":36,"name":"History"
    }
    ,{
        "id":27,"name":"Horror"
    }
    ,{
        "id":10402,"name":"Music"
    }
    ,{
        "id":9648,"name":"Mystery"
    }
    ,{
        "id":10749,"name":"Romance"
    }
    ,{
        "id":878,"name":"Science Fiction"
    }
    ,{
        "id":10770,"name":"TV Movie"
    }
    ,{
        "id":53,"name":"Thriller"
    }
    ,{
        "id":10752,"name":"War"
    }
    ,{
        "id":37,"name":"Western"
    }]

let selectGenre = [];

getGenre();
function getGenre() {
    menusEl.innerHTML = '';
    genres.forEach(genre=>{
        const m = document.createElement('div');
        m.classList.add('menu');
        m.id = genre.id;
        m.innerText = genre.name;

        m.addEventListener('click', () => {
            if(selectGenre.length == 0){
                selectGenre.push(genre.id);
            } else{
                if(selectGenre.includes(genre.id)){
                    selectGenre.forEach((id,idx) => {
                        if(id == genre.id){
                            selectGenre.splice(idx, 1);
                        }
                    })
                } else{
                    selectGenre.push(genre.id);
                }
            }
            console.log(selectGenre);
            getMovies(API_URL + '&with_genres='+encodeURI(selectGenre.join(',')));
            highlightSelection();
        })
        menusEl.append(m);
    })
}

const highlightSelection = () => {
    const menus = document.querySelectorAll('.menu');
    menus.forEach(menu=>{
        menu.classList.remove('highlight')
    })
    if(selectGenre.length !== 0){
        selectGenre.forEach((id)=>{
            const highlightMenu = document.getElementById(id);
            highlightMenu.classList.add('highlight')
        })
    }
}

getMovies(API_URL);

function getMovies (url){
    
    fetch(url).then(res => res.json()).then(data => {
        console.log(data.results);
        if(data.results.length !== 0){
            showMovies(data.results);
        } else{
            main.innerHTML = `<h1 id="alert-no-movie">결과: NO MOVIE</h1>`
        }
        
    })
}

function showMovies(data){
    main.innerHTML = '';

    data.forEach(movie => {
        const {title,poster_path,vote_average,overview} = movie;
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML = `
        <div class="movie">
            <img src="${poster_path?IMG_URL+poster_path:"https://via.placeholder.com/1080x1580"}" alt="${title}">
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getColor(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
                <h3>Overview</h3>
                ${overview}
            </div>
        </div>
        `

        main.appendChild(movieEl);
    })
}

// const pagenation = () => {

//     let pagenationHTML = ''
//     let pageGroup = Math.ceil(page/5)
//     let last = pageGroup * 5;
//     let first = last - 4;

//     if(first >=6){
//     pagenationHTML = `<li class="page-item">
//             <a class="page-link" href="#" aria-label="Previous"  onclick="GoFirstLast(1)">
//             <span aria-hidden="true">&laquo;</span>
//             </a>
//         </li>  
//         <li class="page-item">
//             <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${page-1})">
//             <span aria-hidden="true">&lt;</span>
//             </a>
//         </li>`;
//     }
//     for(let i = first; i <= last; i++){
//         if(i <= total_pages){
//             pagenationHTML +=`<li class="page-item ${page==i?"active":""}"><a class="page-link" href="#" onclick="moveToPage(${i})">${i}</a></li>`
//         }
        
//     }
//     if(last < total_pages){
//         pagenationHTML+=`
//         <li class="page-item ">
//         <a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${page + 1})">
//         <span aria-hidden="true">&gt;</span>
//         </a>
//     </li>
//     <li class="page-item">
//         <a class="page-link" href="#" aria-label="Previous" onclick="GoFirstLast(total_pages)">
//         <span aria-hidden="true">&raquo;</span>
//         </a>
//     </li>`
//     }

//     document.querySelector('.pagination').innerHTML = pagenationHTML;
// };

function getColor(vote){
    if(vote>=8){
        return 'green'
    } else if(vote >= 5){
        return 'orange'
    } else{
        return 'red'
    }
}

searchBtn.addEventListener('click', (e)=>{
    e.preventDefault();

    const searchTerm = search.value;

    if(searchTerm){
        getMovies(searchURL+'&query='+searchTerm);
    } else{
        getMovies(API_URL)
    }
})