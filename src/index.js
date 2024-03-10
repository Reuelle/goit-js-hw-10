import { fetchBreeds, fetchCatByBreed } from "./cat-api";
import SlimSelect from "slim-select";
import 'slim-select/dist/slimselect.css';
import { Notify } from "notiflix/build/notiflix-notify-aio";

const breedSelectEl = document.querySelector(".breed-select");
const catInfoEl = document.querySelector(".cat-info");
const loaderEl = document.querySelector(".loader");
const errorEl = document.querySelector(".error");

errorEl.classList.add("is-hidden");

//CREATE THE OPTIONS
function chooseBreed() {
	fetchBreeds()
		.then((data) => {
			loaderEl.classList.replace("loader", "is-hidden");

			let optionsMarkup = data.map(({ name, id }) => {
				return `<option value=${id}>${name}</option>`;
				//<option value={catId} >Cat Name</option>
			});
			breedSelectEl.insertAdjacentHTML("beforeend", optionsMarkup);
			new SlimSelect({
				select: breedSelectEl,
			});
		})
		.catch(onError);
}

chooseBreed();

breedSelectEl.addEventListener("change", (e) => {
	//show loader while loading.

	loaderEl.classList.replace("is-hidden", "loader");

	//hide select element and cat info while loading.

	catInfoEl.classList.add("is-hidden");

	let breedId = e.target.value;
	fetchCatByBreed(breedId)
		.then((data) => {
			const { url, breeds } = data[0];
			const { name, description, temperament } = breeds[0];

			catInfoEl.innerHTML = `
            <img src='${url}' alt='{name}' width="500"/>
            <div class='box'>
                <h2 style=" font-family: Arial, sans-serif; font-size:45px">${name}</h2>
                <p style=" font-family: Arial, sans-serif; font-size:22px">${description}</p>
                <p style=" font-family: Arial, sans-serif; font-size:17px">${temperament}</p>
            </div>
        `;
			catInfoEl.classList.remove("is-hidden");
			loaderEl.classList.add("is-hidden");
		})
		.catch(onError);
});

function onError() {
	//Show error message
	errorEl.classList.remove("is-hidden");

	//hide select element
	breedSelectEl.classList.add("is-hidden");
	Notify.failure('oops Something went wrong. Please try reloading the page.');
}