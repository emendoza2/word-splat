// import { writable } from "svelte/store";
// import { browser } from "$app/env";

// export const checked = writable();

// if (browser){
//     checked.set(JSON.parse(localStorage.getItem("checked")) || false);
//     checked.subscribe(value => {
//         localStorage.setItem("checked", JSON.stringify(value));
//     });
// }
import { writable, type Writable } from "svelte/store";
import { browser } from '$app/environment';

export const maxGuessingTime = writable<number>(); // seconds
export const difficulty = writable<number>();
export const musicVolume = writable<number>();
export const sfxVolume = writable<number>();

function linkToLocalStorage<T>(w: Writable<T>, key: string, defaultValue: T) {
    w.set(JSON.parse(localStorage.getItem(key) || "null") || defaultValue);
    w.subscribe((value: T)  => {
        localStorage.setItem(key, JSON.stringify(value));
    });
}

if (browser) {
    linkToLocalStorage<number>(maxGuessingTime, "maxGuessingTime", 5)
    linkToLocalStorage<number>(difficulty, "difficulty", 1)
    linkToLocalStorage<number>(musicVolume, "musicVolume", 0.75)
    linkToLocalStorage<number>(sfxVolume, "sfxVolume", 0.75)
}