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

function linkToLocalStorage<T>(w: Writable<T>, key: string) {
    w.set(JSON.parse(localStorage.getItem(key) || "null") || 1);
    w.subscribe((value: T)  => {
        localStorage.setItem(key, JSON.stringify(value));
    });
}

if (browser) {
    linkToLocalStorage<number>(maxGuessingTime, "maxGuessingTime")
    linkToLocalStorage<number>(difficulty, "difficulty")
}