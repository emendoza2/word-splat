export default function choose<T = any>(listLike: T[] | string): T | string {
    const index = Math.floor(Math.random()*listLike.length)
    return listLike[index]
}
